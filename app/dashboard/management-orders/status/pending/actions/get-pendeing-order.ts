'use server';
import db from '@/lib/prisma';
import { Order, orderIncludeRelation } from '@/types/databaseTypes';
import { OrderStatus } from '@prisma/client';

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
  search = '',
  sortBy = 'createdAt',
  sortOrder = 'desc',
}: {
  status?: OrderStatus | OrderStatus[];
  page?: number;
  pageSize?: number;
  dateRange?: 'all' | 'today' | 'week' | 'month' | 'year';
  reason?: string;
  search?: string;
  sortBy?: 'createdAt' | 'amount' | 'orderNumber';
  sortOrder?: 'asc' | 'desc';
}): Promise<OrdersResponse> {
  try {
    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Create base query
    let where: any = {};
    if (status) {
      if (Array.isArray(status)) {
        // Filter out undefined/null and ensure all are valid OrderStatus
        const filteredStatuses = status.filter((s): s is OrderStatus => Boolean(s));
        if (filteredStatuses.length > 0) {
          where.status = { in: filteredStatuses };
        }
      } else {
        where.status = status;
      }
    }

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

    // Add search filter
    if (search) {
      where = {
        ...where,
        OR: [
          { orderNumber: { contains: search, mode: 'insensitive' } },
          { customer: { name: { contains: search, mode: 'insensitive' } } },
          { customer: { phone: { contains: search, mode: 'insensitive' } } },
        ],
      };
    }

    // Get total count for pagination
    const totalCount = await db.order.count({ where });
    const totalPages = Math.ceil(totalCount / pageSize);

    // Fetch orders with pagination and sorting
    const orders = await db.order.findMany({
      where,
      skip,
      take: pageSize,
      include: orderIncludeRelation,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return {
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
      where: { status: OrderStatus.PENDING }
    });

    return orderCount;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    // Return default analytics on error
    return 0;
  }
}

export async function fetchAssignedAnalytics() {
  try {
    const orderCount = await db.order.count({
      where: { status: OrderStatus.ASSIGNED }
    });

    return orderCount;
  } catch (error) {
    console.error('Error fetching assigned analytics:', error);
    // Return default analytics on error
    return 0;
  }
}