"use server";
import db from '@/lib/prisma';
import { debug } from '@/utils/logger';

export const setOrderInTransit = async (
  orderId: string,
  driverId: string
): Promise<{ success: boolean; error?: string; order?: any }> => {
  try {
    debug('setOrderInTransit called with:', { orderId, driverId });
    // 1. Find the order and check assignment and status
    const order = await db.order.findUnique({ where: { id: orderId } });
    debug('Fetched order:', order);
    if (!order) {
      return { success: false, error: 'Order not found' };
    }
    if (order.driverId !== driverId) {
      return { success: false, error: 'Order not assigned to this driver' };
    }
    if (order.status !== 'ASSIGNED') {
      return { success: false, error: 'Order not in ASSIGNED status' };
    }
    // 2. Check if driver has any other IN_TRANSIT order (exclude current order)
    const existing = await db.order.findFirst({
      where: {
        driverId,
        status: 'IN_TRANSIT',
        NOT: { id: orderId },
      },
    });
    debug('Existing IN_TRANSIT order:', existing);
    if (existing) {
      return { success: false, error: 'ACTIVE_TRIP_EXISTS' };
    }
    // 3. Update order status
    const updated = await db.order.update({
      where: { id: orderId },
      data: { status: 'IN_TRANSIT' },
    });
    return { success: true, order: updated };
  } catch (error) {
    return { success: false, error: 'فشل تحديث حالة الطلب' };
  }
}; 