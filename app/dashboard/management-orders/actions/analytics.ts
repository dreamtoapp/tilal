'use server';

import { ORDER_STATUS } from '@/constant/order-status';
import db from '@/lib/prisma';

// Using direct string values to match database

export type OrderAnalytics = {
  inWayOrders: number;
};

export async function fetchAnalytics(): Promise<OrderAnalytics> {
  try {

    const inWayCount = await db.order.count({
      where: { status: ORDER_STATUS.IN_TRANSIT }
    });

    // Create analytics object
    const analytics = {
      inWayOrders: inWayCount,
    };

    return analytics;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    // Return default analytics on error
    return {
      inWayOrders: 0,
    };
  }
}




