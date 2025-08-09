'use server';

import { revalidatePath } from 'next/cache';
import db from '@/lib/prisma';

// Get all products for selection
export async function getAllProducts() {
  try {
    const products = await db.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: true,
        categoryAssignments: {
          select: {
            category: {
              select: {
                name: true
              }
            }
          },
          take: 1
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ]
    });

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

// Add products to offer
export async function addProductsToOffer(offerId: string, productIds: string[]) {
  try {
    // Check if offer exists
    const offer = await db.offer.findUnique({
      where: { id: offerId }
    });

    if (!offer) {
      throw new Error('Offer not found');
    }

    // Get existing product assignments to avoid duplicates
    const existingAssignments = await db.offerProduct.findMany({
      where: { 
        offerId: offerId,
        productId: { in: productIds }
      },
      select: { productId: true }
    });

    const existingProductIds = existingAssignments.map(a => a.productId);
    const newProductIds = productIds.filter(id => !existingProductIds.includes(id));

    if (newProductIds.length === 0) {
      return { success: true, message: 'جميع المنتجات المحددة مضافة بالفعل' };
    }

    // Add new product assignments
    await db.offerProduct.createMany({
      data: newProductIds.map(productId => ({
        offerId: offerId,
        productId: productId,
      })),
    });

    // Revalidate relevant paths
    revalidatePath('/dashboard/management-offer');
    revalidatePath(`/dashboard/management-offer/manage/${offerId}`);
    revalidatePath('/');

    return { 
      success: true, 
      message: `تم إضافة ${newProductIds.length} منتج بنجاح` 
    };
  } catch (error) {
    console.error('Error adding products to offer:', error);
    throw new Error('Failed to add products to offer');
  }
}

// Remove product from offer
export async function removeProductFromOffer(offerId: string, productId: string) {
  try {
    await db.offerProduct.deleteMany({
      where: {
        offerId: offerId,
        productId: productId
      }
    });

    // Revalidate relevant paths
    revalidatePath('/dashboard/management-offer');
    revalidatePath(`/dashboard/management-offer/manage/${offerId}`);
    revalidatePath('/');

    return { success: true, message: 'تم حذف المنتج من المجموعة بنجاح' };
  } catch (error) {
    console.error('Error removing product from offer:', error);
    throw new Error('Failed to remove product from offer');
  }
} 