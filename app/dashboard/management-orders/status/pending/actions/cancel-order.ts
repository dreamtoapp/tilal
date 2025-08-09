'use server';

import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import { ORDER_STATUS } from '@/constant/order-status';
import prisma from '@/lib/prisma';

async function cancelOrder(orderId: string, reason: string) {

  try {
    const session = await auth();

    if (!session?.user) {
      return { message: 'Unauthorized' };
    }

    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: ORDER_STATUS.CANCELED,
        resonOfcancel: reason,
      },
    });
  } catch (error: any) {
    console.error(error);
    return {
      message: 'Failed to cancel order',
    };
  }

  revalidatePath('/dashboard/orders-management/status/pending');
  return { message: 'Order cancelled' };
}

export default cancelOrder;
