"use server";
import { ORDER_STATUS } from '@/constant/order-status';
import db from '@/lib/prisma';

export const revertOrderToAssigned = async (
  orderId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await db.order.update({
      where: { id: orderId },
      data: { status: ORDER_STATUS.ASSIGNED },
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to revert order to ASSIGNED:', { orderId, error });
    return { success: false, error: 'فشل تحديث حالة الطلب' };
  }
}; 