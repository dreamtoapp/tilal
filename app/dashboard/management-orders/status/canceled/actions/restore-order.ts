'use server';

import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import db from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function restoreOrder(orderId: string) {
  console.log(orderId);
  try {
    const session = await auth();

    if (!session?.user) {
      return { message: 'Unauthorized' };
    }

    await db.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: OrderStatus.ASSIGNED,
        resonOfcancel: null,
      },
    });
  } catch (error: any) {
    console.error(error);
    return {
      message: 'Failed to restore order',
    };
  }

  revalidatePath('/dashboard/orders-management/status/canceled');
  return { message: 'Order restored' };
}
