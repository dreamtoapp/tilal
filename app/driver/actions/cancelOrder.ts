'use server';

import {
  ORDER_STATUS,
} from '@/constant/order-status';

import { revalidatePath } from 'next/cache';
import db from '@/lib/prisma';

export const cancelOrder = async (orderId: string, reson: string) => {
  await db.order.update({
    where: { id: orderId },
    data: { status: ORDER_STATUS.CANCELED, resonOfcancel: reson },
  });
      // Safely delete ActiveTrip record if it exists
    const existingActiveTrip = await db.activeTrip.findUnique({
      where: { orderId: orderId },
    });

    if (existingActiveTrip) {
      await db.activeTrip.delete({
        where: { orderId: orderId },
      });
    }

  // Removed notification logic
  // Revalidate driver page to refresh data
  revalidatePath('/driver/showdata');
};