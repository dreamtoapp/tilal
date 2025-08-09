'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';

interface DeleteResult {
  ok: boolean;
  msg?: string;
}

export async function deleteCustomer(customerId: string): Promise<DeleteResult> {
  try {
    // Check if customer exists
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return {
        ok: false,
        msg: 'العميل غير موجود',
      };
    }

    // Check if customer has any related data (orders, etc.)
    const hasOrders = await prisma.order.findFirst({
      where: { customerId: customerId },
    });

    if (hasOrders) {
      return {
        ok: false,
        msg: 'لا يمكن حذف العميل لوجود طلبات مرتبطة به',
      };
    }

    // Delete customer
    await prisma.user.delete({
      where: { id: customerId },
    });

    revalidatePath('/dashboard/management-users/customer');
    return {
      ok: true,
      msg: 'تم حذف العميل بنجاح',
    };
  } catch (error) {
    console.error('Error deleting customer:', error);
    return {
      ok: false,
      msg: 'حدث خطأ أثناء حذف العميل',
    };
  }
} 