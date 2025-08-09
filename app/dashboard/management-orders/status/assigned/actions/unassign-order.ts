'use server';

import db from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function unassignOrder(orderId: string) {
  try {
    await db.order.update({
      where: { id: orderId },
      data: {
        driverId: null,
        status: OrderStatus.PENDING,
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
} 