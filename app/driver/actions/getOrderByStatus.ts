'use server';

import {
  OrderStatus,
} from '@/constant/order-status';

import db from '@/lib/prisma';

export async function getOrderByStatus(driverId: string, status: OrderStatus) {
  try {
    const ordersToShip = await db.order.findMany({
      where: { driverId, status },
      include: {
        address: true,
        shift: true,
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
        driver: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    return { ordersToShip };
  } catch (error) {
    return { error: 'فشل في جلب البيانات. حاول مرة أخرى.' };
  }
}