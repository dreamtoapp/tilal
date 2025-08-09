'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';

interface DeleteResult {
  ok: boolean;
  msg?: string;
}

export async function deleteDriver(driverId: string): Promise<DeleteResult> {
  try {
    // Check if driver exists
    const driver = await prisma.user.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      return {
        ok: false,
        msg: 'السائق غير موجود',
      };
    }

    // Check if driver has any related data (orders, etc.)
    const hasOrders = await prisma.order.findFirst({
      where: { driverId: driverId },
    });

    if (hasOrders) {
      return {
        ok: false,
        msg: 'لا يمكن حذف السائق لوجود طلبات مرتبطة به',
      };
    }

    // Delete driver
    await prisma.user.delete({
      where: { id: driverId },
    });

    revalidatePath('/dashboard/management-users/drivers');
    return {
      ok: true,
      msg: 'تم حذف السائق بنجاح',
    };
  } catch (error) {
    console.error('Error deleting driver:', error);
    return {
      ok: false,
      msg: 'حدث خطأ أثناء حذف السائق',
    };
  }
} 