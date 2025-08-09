'use server';

import db from '@/lib/prisma';

// Type for purchase history item
export type PurchaseHistoryItem = {
  orderId: string;
  orderNumber: string;
  orderDate: string;
  status: string;
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    quantity: number;
    rating?: number | null;
    hasRated: boolean;
  }[];
};

/**
 * Get a user's purchase history
 */
export async function getUserPurchaseHistory(userId: string): Promise<PurchaseHistoryItem[]> {
  try {
    // Get all orders for this user
    const orders = await db.order.findMany({
      where: {
        customerId: userId,
        status: "DELIVERED", // Only show delivered orders
      },
      orderBy: {
        createdAt: 'desc', // Most recent first
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Format the data for the UI
    return orders.map((order) => ({
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt.toISOString(),
      status: order.status,
      products: order.items.map((item) => ({
        id: item.productId,
        name: item.product?.name || 'منتج غير متوفر',
        slug: item.product?.slug || item.productId,
        imageUrl: item.product?.imageUrl || '/fallback/product-fallback.avif',
        price: item.price,
        quantity: item.quantity,
        rating: item.product?.rating || null,
        hasRated: false, // In a real implementation, you would check if the user has rated this product
      })),
    }));
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    return [];
  }
}
