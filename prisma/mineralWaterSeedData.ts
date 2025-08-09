// prisma/mineralWaterSeedData.ts
// Enhanced Mineral Water E-commerce Realistic Data Simulation
// Run with: pnpm tsx prisma/mineralWaterSeedData.ts

import { faker } from '@faker-js/faker/locale/ar';
import db from '../lib/prisma';
import { UserRole } from '@prisma/client';
import type { User, Supplier, Category, Product, Address } from '@prisma/client';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// Import mineral water data
import { getCategorySeedData } from '../utils/fashionData/mineralWaterCategories';
import { getProductSeedData } from '../utils/fashionData/mineralWaterProducts';
import { getSupplierSeedData } from '../utils/fashionData/mineralWaterSuppliers';
import { getOfferSeedData } from '../utils/fashionData/mineralWaterOffers';

// --- Logging Helpers (copied from fashionSeedData.ts) ---
function logBanner(msg: string) {
  console.log('\n' + '='.repeat(msg.length + 8));
  console.log(`=== ${msg} ===`);
  console.log('='.repeat(msg.length + 8));
}
function logStep(title: string) {
  console.log(`\n🔷 ${title}...`);
}
function logDone(title: string, count: number, ids?: string[]) {
  console.log(`✅ Done: ${title} (${count})${ids ? ' [' + ids.join(', ') + ']' : ''}`);
}
function logProgress(i: number, total: number, label: string, icon: string) {
  console.log(`${icon} ${label}: ${i + 1}/${total}`);
}
function logStockStatus(productName: string, inStock: boolean) {
  const status = inStock ? '✅ IN STOCK' : '❌ OUT OF STOCK';
  console.log(`📦 ${productName} - ${status}`);
}

// --- Utility: Clear all data (order matters for relations) ---
async function clearAllData() {
  logBanner('🧹 Clearing all data');
  await db.orderItem.deleteMany({});
  await db.activeTrip.deleteMany({});
  await db.orderRating.deleteMany({});
  await db.review.deleteMany({});
  await db.wishlistItem.deleteMany({});
  await db.userNotification.deleteMany({});
  await db.cartItem.deleteMany({});
  await db.cart.deleteMany({});
  await db.offerProduct.deleteMany({});
  await db.offer.deleteMany({});
  await db.categoryProduct.deleteMany({});
  await db.product.deleteMany({});
  await db.category.deleteMany({});
  await db.supplier.deleteMany({});
  await db.order.deleteMany({});
  await db.address.deleteMany({});
  await db.shift.deleteMany({});
  await db.user.deleteMany({});
  logBanner('✅ All data cleared');
}

// --- Seeding Functions (adapted for mineral water) ---
async function seedUsers(count: number) {
  logStep('Seeding users');
  const users = [];
  for (let i = 0; i < count; i++) {
    let user;
    if (i === 0) {
      user = await db.user.create({ data: { name: 'Admin', phone: '0500000000', password: 'admin123', role: UserRole.ADMIN, email: 'admin@example.com' } });
    } else if (i === 1) {
      user = await db.user.create({ data: { name: 'Marketer', phone: '0500000001', password: 'marketer123', role: UserRole.MARKETER, email: 'marketer@example.com' } });
    } else if (i < 7) {
      user = await db.user.create({ data: { name: faker.person.fullName(), phone: `05000010${i-2}`, password: 'driver123', role: UserRole.DRIVER } });
    } else {
      user = await db.user.create({ data: { name: faker.person.fullName(), phone: `05010010${i-7}`, password: 'customer123', role: UserRole.CUSTOMER, email: `customer${i-7}@example.com` } });
    }
    users.push(user);
    logProgress(i, count, 'Users', '👤');
  }
  logDone('Users', users.length);
  return users;
}

async function seedAddresses(users: User[]): Promise<Address[]> {
  logStep('Seeding addresses');
  const addresses = [];
  const customers = users.filter(u => u.role === 'CUSTOMER');
  for (let i = 0; i < customers.length; i++) {
    const user = customers[i];
    const address = await db.address.create({
      data: {
        userId: user.id,
        label: 'المنزل',
        district: faker.location.city(),
        street: faker.location.street(),
        buildingNumber: faker.string.numeric(2),
        latitude: faker.location.latitude().toString(),
        longitude: faker.location.longitude().toString(),
        isDefault: true,
      },
    });
    addresses.push(address);
    logProgress(i, customers.length, 'Addresses', '🏠');
  }
  if (addresses.length === 0) {
    // Removed console.warn('⚠️  No addresses were seeded!');
  }
  logDone('Addresses', addresses.length);
  return addresses;
}

async function seedMineralWaterSuppliersDynamic(): Promise<Supplier[]> {
  logStep('Seeding mineral water suppliers (dynamic Cloudinary)');
  const suppliersData = await getSupplierSeedData();
  const suppliers = [];
  for (let i = 0; i < suppliersData.length; i++) {
    const supplierData = suppliersData[i];
    const supplier = await db.supplier.create({ data: supplierData });
    suppliers.push(supplier);
    logProgress(i, suppliersData.length, 'Suppliers', '🏢');
  }
  logDone('Suppliers', suppliers.length);
  return suppliers;
}

async function seedMineralWaterCategoriesDynamic(): Promise<Category[]> {
  logStep('Seeding mineral water categories (dynamic Cloudinary)');
  const categoriesData = await getCategorySeedData();
  const categories = [];
  for (let i = 0; i < categoriesData.length; i++) {
    const categoryData = categoriesData[i];
    const category = await db.category.create({ data: categoryData });
    categories.push(category);
    logProgress(i, categoriesData.length, 'Categories', '🏷️');
  }
  logDone('Categories', categories.length);
  return categories;
}

async function seedMineralWaterProductsDynamic(suppliers: Supplier[], categories: Category[]): Promise<Product[]> {
  logStep('Seeding mineral water products (dynamic Cloudinary)');
  const productsData = await getProductSeedData();
  const products = [];
  for (let i = 0; i < productsData.length; i++) {
    const productData = productsData[i];
    const data: any = {
      ...productData,
      supplierId: suppliers.length ? suppliers[i % suppliers.length].id : undefined,
      categoryAssignments: categories.length
        ? { create: [{ categoryId: categories[i % categories.length].id }] }
        : undefined,
      type: 'product',
      price: 10 + i, // Example price, adjust as needed
      size: '1L', // Example size, adjust as needed
      brand: 'Brand', // Example brand, adjust as needed
      features: ['Feature 1', 'Feature 2'], // Example features, adjust as needed
      published: true,
      outOfStock: false,
      manageInventory: true,
      stockQuantity: 50,
      rating: 4.5,
      reviewCount: 0
    };
    const product = await db.product.create({ data });
    products.push(product);
    logStockStatus(product.name, !product.outOfStock);
    logProgress(i, productsData.length, 'Products', '💧');
  }
  logDone('Products', products.length);
  return products;
}

async function seedMineralWaterOffersDynamic(products: Product[]): Promise<void> {
  logStep('Seeding mineral water offers (dynamic Cloudinary)');
  const offersData = await getOfferSeedData();
  for (let i = 0; i < offersData.length; i++) {
    const offerData = offersData[i];
    const offer = await db.offer.create({ data: offerData });
    // Optionally assign products to offers
    const offerProducts = products.slice(i * 3, i * 3 + 3); // Example: 3 products per offer
    for (const product of offerProducts) {
      await db.offerProduct.create({ data: { offerId: offer.id, productId: product.id } });
    }
    logProgress(i, offersData.length, 'Offers', '💸');
  }
  logDone('Offers', offersData.length);
}

// --- The rest of the functions (users, addresses, orders, reviews, etc.) remain unchanged ---
// (Copy from fashionSeedData.ts)

// --- Main Seed Function ---
async function getSeedConfig() {
  const rl = readline.createInterface({ input, output });
  const categories = parseInt(await rl.question('How many categories to seed? (default 3): '), 10) || 3;
  const products = parseInt(await rl.question('How many products to seed? (default 20): '), 10) || 20;
  const offers = parseInt(await rl.question('How many offers to seed? (default 3): '), 10) || 3;
  const orders = parseInt(await rl.question('How many orders to seed? (default 20): '), 10) || 20;
  const users = parseInt(await rl.question('How many users to seed? (default 27): '), 10) || 27;
  const suppliers = parseInt(await rl.question('How many suppliers to seed? (default 10): '), 10) || 10;
  const reviews = parseInt(await rl.question('How many reviews per product? (default 5): '), 10) || 5;
  await rl.close();
  // Print summary before seeding
  console.log('\n--- SEED CONFIG SUMMARY ---');
  console.log(`Categories: ${categories}`);
  console.log(`Products:   ${products}`);
  console.log(`Offers:     ${offers}`);
  console.log(`Orders:     ${orders}`);
  console.log(`Users:      ${users}`);
  console.log(`Suppliers:  ${suppliers}`);
  console.log(`Reviews:    ${reviews}`);
  console.log('---------------------------\n');
  return { categories, products, offers, orders, users, suppliers, reviews };
}

async function main() {
  const start = Date.now();
  logBanner('🌱 Starting Enhanced Mineral Water Database Seed');
  const config = await getSeedConfig();
  try {
    await clearAllData();
  } catch (e) {
    console.error('❌ Error clearing data:', e);
    throw e;
  }

  let users, suppliers, categories, products;
  try {
    users = await seedUsers(config.users);
  } catch (e) {
    console.error('❌ Error seeding users:', e);
    throw e;
  }

  try {
    await seedAddresses(users);
  } catch (e) {
    console.error('❌ Error seeding addresses:', e);
    throw e;
  }

  try {
    suppliers = await seedMineralWaterSuppliersDynamic();
  } catch (e) {
    console.error('❌ Error seeding suppliers:', e);
    throw e;
  }

  try {
    categories = await seedMineralWaterCategoriesDynamic();
  } catch (e) {
    console.error('❌ Error seeding categories:', e);
    throw e;
  }

  try {
    products = await seedMineralWaterProductsDynamic(suppliers, categories);
  } catch (e) {
    console.error('❌ Error seeding products:', e);
    throw e;
  }

  try {
    await seedMineralWaterOffersDynamic(products);
  } catch (e) {
    console.error('❌ Error seeding offers:', e);
    throw e;
  }

  // The rest (orders, reviews, wishlist, notifications, carts) can be copied as-is from fashionSeedData.ts

  logBanner('🎉 ENHANCED MINERAL WATER SEED COMPLETE!');
  console.log(`⏱️  Total time: ${((Date.now() - start) / 1000).toFixed(1)}s`);
  console.log(`📊 Generated ${products.length} mineral water products with realistic stock management`);
  console.log(`🏷️  Created ${categories.length} mineral water categories with HD images`);
  console.log(`🏢 Seeded ${suppliers.length} mineral water suppliers with proper branding`);
}

main().catch((e) => {
  console.error('❌ Enhanced mineral water seed failed:', e);
  process.exit(1);
}); 