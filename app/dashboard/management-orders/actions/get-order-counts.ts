'use server';

import db from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export interface OrderCounts {
  total: number;
  pending: number;
  assigned: number;
  inTransit: number;
  delivered: number;
  canceled: number;
}

export async function getOrderCounts(): Promise<OrderCounts> {
  try {
    const [
      total,
      pending,
      assigned,
      inTransit,
      delivered,
      canceled
    ] = await Promise.all([
      db.order.count(),
      db.order.count({ where: { status: OrderStatus.PENDING } }),
      db.order.count({ where: { status: OrderStatus.ASSIGNED } }),
      db.order.count({ where: { status: OrderStatus.IN_TRANSIT } }),
      db.order.count({ where: { status: OrderStatus.DELIVERED } }),
      db.order.count({ where: { status: OrderStatus.CANCELED } })
    ]);

    return {
      total,
      pending,
      assigned,
      inTransit,
      delivered,
      canceled
    };
  } catch (error) {
    console.error('Error fetching order counts:', error);
    return {
      total: 0,
      pending: 0,
      assigned: 0,
      inTransit: 0,
      delivered: 0,
      canceled: 0
    };
  }
} 