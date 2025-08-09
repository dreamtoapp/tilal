// utils/fashionSeedData.ts
// Enhanced Fashion E-commerce Realistic Data Simulation
// Run with: pnpm tsx utils/fashionSeedData.ts

import { faker } from '@faker-js/faker/locale/ar';
import db from '../lib/prisma';
import { UserRole, OrderStatus, NotificationType } from '@prisma/client';
import type { User, Supplier, Category, Product, Shift, Address, Order } from '@prisma/client';
import { Slugify } from '../utils/slug';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// Import fashion data
import { FASHION_CATEGORIES } from '../utils/fashionData/categories';
import { FASHION_PRODUCT_TEMPLATES } from '../utils/fashionData/products';
import { FASHION_SUPPLIERS } from '../utils/fashionData/suppliers';
import { FASHION_OFFERS } from '../utils/fashionData/offers';

// --- Logging Helpers (Enhanced) ---
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

// --- Enhanced Seeding Functions ---
async function seedShifts() {
  logStep('Seeding shifts');
  const shifts = await Promise.all([
    db.shift.create({ data: { name: 'Morning', startTime: '06:00', endTime: '14:00' } }),
    db.shift.create({ data: { name: 'Afternoon', startTime: '14:00', endTime: '22:00' } }),
    db.shift.create({ data: { name: 'Night', startTime: '22:00', endTime: '06:00' } }),
  ]);
  logDone('Shifts', shifts.length, shifts.map(s => s.id));
  return shifts;
}

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
    console.warn('⚠️  No addresses were seeded!');
  }
  logDone('Addresses', addresses.length);
  return addresses;
}

async function seedFashionSuppliers(count: number): Promise<Supplier[]> {
  logStep('Seeding fashion suppliers');
  const suppliers = [];
  const maxSuppliers = FASHION_SUPPLIERS.length;
  if (count > maxSuppliers) {
    console.warn(`⚠️  Requested ${count} suppliers, but only ${maxSuppliers} available. Seeding ${maxSuppliers} suppliers.`);
    count = maxSuppliers;
  }
  for (let i = 0; i < count; i++) {
    const supplierData = FASHION_SUPPLIERS[i];
    if (!supplierData) {
      console.warn(`⚠️  No supplier data for index ${i}, skipping.`);
      continue;
    }
    const supplier = await db.supplier.create({
      data: {
        name: supplierData.name,
        slug: supplierData.slug,
        logo: supplierData.logo,
        email: supplierData.email,
        phone: supplierData.phone,
        address: supplierData.address,
        type: supplierData.type,
      },
    });
    suppliers.push(supplier);
    logProgress(i, count, 'Suppliers', '🏢');
  }
  logDone('Suppliers', suppliers.length);
  return suppliers;
}

async function seedFashionCategories(count: number): Promise<Category[]> {
  logStep('Seeding fashion categories');
  // Randomly select count categories from FASHION_CATEGORIES
  const shuffled = [...FASHION_CATEGORIES].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  const categories = [];
  for (let i = 0; i < selected.length; i++) {
    const categoryData = selected[i];
    const category = await db.category.create({
      data: {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        imageUrl: categoryData.imageUrl,
      },
    });
    categories.push(category);
    logProgress(i, selected.length, 'Categories', '🏷️');
  }
  logDone('Categories', categories.length);
  return categories;
}

async function seedFashionProducts(suppliers: Supplier[], categories: Category[], count: number): Promise<Product[]> {
  logStep('Seeding fashion products');
  const products: Product[] = [];
  if (count === 0) {
    console.warn('⚠️  Product count is 0. No products will be seeded.');
    return products;
  }
  if (categories.length === 0) {
    console.warn('⚠️  No categories provided. No products will be seeded.');
    return products;
  }
  const perCategory = Math.floor(count / categories.length);
  let productIndex = 0;
  for (const category of categories) {
    // Use the first template as a default for all categories
    const template = FASHION_PRODUCT_TEMPLATES[0];
    for (let i = 0; i < perCategory; i++) {
      const name = faker.helpers.arrayElement(template.names);
      const price = faker.number.int({ min: template.priceRange.min, max: template.priceRange.max });
      const compareAtPrice = template.compareAtPriceRange 
        ? faker.number.int({ min: template.compareAtPriceRange.min, max: template.compareAtPriceRange.max })
        : undefined;
      const inStock = Math.random() < template.stockChance;
      const stockQuantity = inStock ? faker.number.int({ min: 5, max: 50 }) : 0;
      const baseSlug = Slugify(name);
      const uniqueSlug = `${baseSlug}-${Date.now()}-${faker.string.alphanumeric(4).toLowerCase()}`;
      const previewCount = faker.number.int({ min: 0, max: 100 });
      const supplier = faker.helpers.arrayElement(suppliers);
      const product = await db.product.create({
        data: {
          name,
          description: faker.helpers.arrayElement(template.features),
          slug: uniqueSlug,
          price,
          compareAtPrice,
          costPrice: price * 0.6,
          size: faker.helpers.arrayElement(template.sizes),
          details: faker.helpers.arrayElement(template.features),
          imageUrl: faker.helpers.arrayElement(template.imageUrls),
          images: template.imageUrls,
          supplierId: supplier.id,
          type: 'product',
          productCode: `FASH-${faker.string.alphanumeric(6).toUpperCase()}`,
          material: faker.helpers.arrayElement(template.materials),
          brand: faker.helpers.arrayElement(template.brands),
          color: faker.helpers.arrayElement(template.colors),
          dimensions: 'Standard',
          weight: 'Light',
          features: template.features,
          requiresShipping: true,
          shippingDays: '3-5',
          returnPeriodDays: 14,
          hasQualityGuarantee: true,
          careInstructions: 'Machine wash cold, tumble dry low',
          published: true,
          outOfStock: !inStock,
          manageInventory: true,
          stockQuantity,
          rating: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
          reviewCount: 0, // Will update after reviews are seeded
          previewCount,
          categoryAssignments: { create: [{ categoryId: category.id }] },
          categorySlug: category.slug, // Denormalized for fast filtering
        },
      });
      products.push(product);
      logStockStatus(product.name, inStock);
      logProgress(productIndex, count, 'Products', '📦');
      productIndex++;
    }
  }
  logDone('Products', products.length);
  return products;
}

async function seedFashionOffers(products: Product[], offerCount: number): Promise<void> {
  logStep('Seeding fashion offers');
  if (offerCount === 0) {
    console.warn('⚠️  Offer count is 0. No offers will be seeded.');
    return;
  }
  // Randomly select offerCount offers from FASHION_OFFERS
  const shuffled = [...FASHION_OFFERS].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, offerCount);
  for (let i = 0; i < selected.length; i++) {
    const offerData = selected[i];
    const offer = await db.offer.create({
      data: {
        name: offerData.name,
        slug: offerData.slug,
        description: offerData.description,
        bannerImage: offerData.bannerImage,
        isActive: offerData.isActive,
        displayOrder: offerData.displayOrder,
        hasDiscount: offerData.hasDiscount,
        discountPercentage: offerData.discountPercentage,
        header: offerData.header,
        subheader: offerData.subheader,
      },
    });
    // Assign products to offer based on category
    const offerProducts = faker.helpers.arrayElements(products, offerData.productCount);
    for (const product of offerProducts) {
      await db.offerProduct.create({ data: { offerId: offer.id, productId: product.id } });
    }
    logProgress(i, selected.length, 'Offers', '💸');
  }
  logDone('Offers', selected.length);
}

async function seedOrders(users: User[], addresses: Address[], shifts: Shift[], products: Product[], count: number): Promise<Order[]> {
  logStep('Seeding orders');
  if (!users.length || !addresses.length || !shifts.length || !products.length) {
    console.warn('⚠️  Skipping order seeding: missing users, addresses, shifts, or products.');
    return [];
  }
  const orders = [];
  const customers = users.filter(u => u.role === 'CUSTOMER');
  for (let i = 0; i < count; i++) {
    const customer = faker.helpers.arrayElement(customers);
    const customerAddresses = addresses.filter(a => a.userId === customer.id);
    if (!customerAddresses.length) {
      console.warn(`⚠️  Skipping order for customer ${customer.id} (no addresses)`);
      continue;
    }
    const address = faker.helpers.arrayElement(customerAddresses);
    const shift = faker.helpers.arrayElement(shifts);
    const status = faker.helpers.arrayElement(Object.values(OrderStatus));
    const order = await db.order.create({
      data: {
        orderNumber: faker.string.alphanumeric(8).toUpperCase(),
        customerId: customer.id,
        addressId: address.id,
        shiftId: shift.id,
        status,
        amount: faker.number.int({ min: 50, max: 2000 }),
        paymentMethod: 'CASH',
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        deliveredAt: status === OrderStatus.DELIVERED ? faker.date.recent() : undefined,
      },
    });
    // Add order items
    const items = faker.helpers.arrayElements(products, faker.number.int({ min: 1, max: 4 }));
    for (const product of items) {
      await db.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity: faker.number.int({ min: 1, max: 3 }),
          price: product.price,
        },
      });
    }
    orders.push(order);
    logProgress(i, count, 'Orders', '📝');
  }
  logDone('Orders', orders.length);
  return orders;
}

async function seedReviews(users: User[], products: Product[], reviewCount: number): Promise<void> {
  logStep('Seeding reviews');
  if (reviewCount === 0) {
    console.warn('⚠️  Review count is 0. No reviews will be seeded.');
    return;
  }
  let totalReviews = 0;
  for (let p = 0; p < products.length; p++) {
    const product = products[p];
    const count = faker.number.int({ min: 0, max: reviewCount });
    for (let i = 0; i < count; i++) {
      const user = faker.helpers.arrayElement(users);
      await db.review.create({
        data: {
          productId: product.id,
          userId: user.id,
          rating: faker.number.int({ min: 1, max: 5 }),
          comment: faker.lorem.sentence(),
          isVerified: faker.datatype.boolean(),
          createdAt: faker.date.past(),
        },
      });
      totalReviews++;
      logProgress(totalReviews - 1, products.length * reviewCount, 'Reviews', '⭐');
    }
  }
  logDone('Reviews', totalReviews);
}

async function updateProductReviewCounts() {
  logStep('Updating product reviewCount fields');
  const allProducts = await db.product.findMany({ select: { id: true } });
  for (const product of allProducts) {
    const count = await db.review.count({ where: { productId: product.id } });
    await db.product.update({ where: { id: product.id }, data: { reviewCount: count } });
  }
  logDone('Updated reviewCount for products', allProducts.length);
}

async function seedWishlistItems(users: User[], products: Product[]): Promise<void> {
  logStep('Seeding wishlist items');
  let count = 0;
  for (let u = 0; u < users.length; u++) {
    const user = users[u];
    const items = faker.helpers.arrayElements(products, faker.number.int({ min: 0, max: 5 }));
    for (let i = 0; i < items.length; i++) {
      const product = items[i];
      await db.wishlistItem.create({
        data: {
          userId: user.id,
          productId: product.id,
        },
      });
      count++;
      logProgress(count - 1, users.length * 5, 'Wishlist', '💜');
    }
  }
  logDone('Wishlist items', count);
}

async function seedNotifications(users: User[]): Promise<void> {
  logStep('Seeding notifications');
  let count = 0;
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    await db.userNotification.create({
      data: {
        userId: user.id,
        type: NotificationType.INFO,
        title: 'Welcome!',
        body: 'Thank you for joining our platform.',
        read: false,
      },
    });
    count++;
    logProgress(i, users.length, 'Notifications', '🔔');
  }
  logDone('Notifications', count);
}

async function seedCarts(users: User[], products: Product[]): Promise<void> {
  logStep('Seeding carts');
  let count = 0;
  for (let u = 0; u < users.length; u++) {
    const user = users[u];
    const cart = await db.cart.create({
      data: {
        userId: user.id,
      },
    });
    const items = faker.helpers.arrayElements(products, faker.number.int({ min: 0, max: 3 }));
    for (let i = 0; i < items.length; i++) {
      const product = items[i];
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          quantity: faker.number.int({ min: 1, max: 3 }),
        },
      });
      count++;
      logProgress(count - 1, users.length * 3, 'Cart items', '🛒');
    }
  }
  logDone('Cart items', count);
}

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

// --- Main Seed Function ---
async function main() {
  const start = Date.now();
  logBanner('🌱 Starting Enhanced Fashion Database Seed');
  const config = await getSeedConfig();
  try {
    await clearAllData();
  } catch (e) {
    console.error('❌ Error clearing data:', e);
    throw e;
  }

  let shifts, users, addresses, suppliers, categories, products;
  try {
    shifts = await seedShifts();
  } catch (e) {
    console.error('❌ Error seeding shifts:', e);
    throw e;
  }

  try {
    users = await seedUsers(config.users);
  } catch (e) {
    console.error('❌ Error seeding users:', e);
    throw e;
  }

  try {
    addresses = await seedAddresses(users);
  } catch (e) {
    console.error('❌ Error seeding addresses:', e);
    throw e;
  }

  try {
    suppliers = await seedFashionSuppliers(config.suppliers);
  } catch (e) {
    console.error('❌ Error seeding suppliers:', e);
    throw e;
  }

  try {
    categories = await seedFashionCategories(config.categories);
  } catch (e) {
    console.error('❌ Error seeding categories:', e);
    throw e;
  }

  try {
    products = await seedFashionProducts(suppliers, categories, config.products);
  } catch (e) {
    console.error('❌ Error seeding products:', e);
    throw e;
  }

  try {
    await seedFashionOffers(products, config.offers);
  } catch (e) {
    console.error('❌ Error seeding offers:', e);
    throw e;
  }

  try {
    await seedOrders(users, addresses, shifts, products, config.orders);
  } catch (e) {
    console.error('❌ Error seeding orders:', e);
    throw e;
  }

  try {
    await seedReviews(users, products, config.reviews);
  } catch (e) {
    console.error('❌ Error seeding reviews:', e);
    throw e;
  }

  try {
    await updateProductReviewCounts();
  } catch (e) {
    console.error('❌ Error updating product reviewCount:', e);
    throw e;
  }

  try {
    await seedWishlistItems(users, products);
  } catch (e) {
    console.error('❌ Error seeding wishlist items:', e);
    throw e;
  }

  try {
    await seedNotifications(users);
  } catch (e) {
    console.error('❌ Error seeding notifications:', e);
    throw e;
  }

  try {
    await seedCarts(users, products);
  } catch (e) {
    console.error('❌ Error seeding carts:', e);
    throw e;
  }

  logBanner('🎉 ENHANCED FASHION SEED COMPLETE!');
  console.log(`⏱️  Total time: ${((Date.now() - start) / 1000).toFixed(1)}s`);
  console.log(`📊 Generated ${products.length} fashion products with realistic stock management`);
  console.log(`🏷️  Created ${categories.length} fashion categories with HD images`);
  console.log(`🏢 Seeded ${suppliers.length} fashion suppliers with proper branding`);
  console.log(`💸 Generated ${FASHION_OFFERS.length} promotional offers and campaigns`);
}

main().catch((e) => {
  console.error('❌ Enhanced fashion seed failed:', e);
  process.exit(1);
});
