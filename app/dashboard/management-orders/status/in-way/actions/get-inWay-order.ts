'use server';
import { ORDER_STATUS } from '@/constant/order-status';
import db from '@/lib/prisma';
import { Order, orderIncludeRelation } from '@/types/databaseTypes';

export async function fetchOrders({
  status,
  driverId,
}: {
  status?: string;
  driverId?: string;
}): Promise<{ orders: Order[] }> {
  try {
    const where: any = status ? { status } : {};
    if (driverId) where.driverId = driverId;

    const orders = await db.order.findMany({
      where,
      include: orderIncludeRelation,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { orders };
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
}

export async function fetchAnalytics() {
  try {

    const orderCount = await db.order.count({
      where: { status: ORDER_STATUS.IN_TRANSIT }
    });



    return orderCount;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    // Return default analytics on error
    return 0
  }
}