'use server';
import { ORDER_STATUS } from '@/constant/order-status';
import db from '@/lib/prisma';
import { Order, orderIncludeRelation } from '@/types/databaseTypes';

export type OrdersResponse = {
  orders: Order[];
  totalCount: number;
  totalPages: number;
};

export async function fetchOrders({
  status,
  page = 1,
  pageSize = 10,
  dateRange = 'all',
  reason,
}: {
  status?: string; // Using string values to match database
  page?: number;
  pageSize?: number;
  dateRange?: 'all' | 'today' | 'week' | 'month' | 'year';
  reason?: string;
}): Promise<OrdersResponse> {
  try {
    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Create base query
    let where: any = status ? { status } : {};

    // Add reason filter for canceled orders
    if (status === 'CANCELED' && reason) {
      where.resonOfcancel = {
        contains: reason,
        mode: 'insensitive',
      };
    }

    // Add date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = new Date(0); // Beginning of time
      }

      where = {
        ...where,
        createdAt: {
          gte: startDate,
          lte: new Date(),
        },
      };
    }

    // Get total count for pagination
    const totalCount = await db.order.count({ where });
    const totalPages = Math.ceil(totalCount / pageSize);

    // Fetch orders with pagination
    const orders = await db.order.findMany({
      where,
      skip,
      take: pageSize,
      include: orderIncludeRelation,
      orderBy: {
        createdAt: 'desc',
      },
    }); return {
      orders,
      totalCount,
      totalPages,
    };
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
}

export async function fetchAnalytics() {
  try {

    const orderCount = await db.order.count({
      where: { status: ORDER_STATUS.CANCELED }
    });



    return orderCount;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    // Return default analytics on error
    return 0
  }
}