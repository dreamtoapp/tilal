// app/dashboard/management-orders/status/assigned/actions/get-assigned-order.ts
'use server';
import db from '@/lib/prisma';
import { Order, orderIncludeRelation } from '@/types/databaseTypes';
import { OrderStatus } from '@prisma/client';

export type AssignedOrdersResponse = {
  orders: Order[];
  totalCount: number;
  totalPages: number;
};

export async function fetchAssignedOrders({
  page = 1,
  pageSize = 10,
  search = '',
  sortBy = 'createdAt',
  sortOrder = 'desc',
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: 'createdAt' | 'amount' | 'orderNumber';
  sortOrder?: 'asc' | 'desc';
}): Promise<AssignedOrdersResponse> {
  try {
    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Only fetch assigned orders
    let where: any = { status: OrderStatus.ASSIGNED };

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
    console.error('Error fetching assigned orders:', error);
    throw new Error('Failed to fetch assigned orders');
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
    return 0;
  }
} 