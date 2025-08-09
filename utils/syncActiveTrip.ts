"use server"

import db from '@/lib/prisma';
import { ActionError } from '@/types/commonType';

export async function syncActiveTrip() {
  try {
    // console.log('🔄 Syncing ActiveTrip table with orders where status=IN_TRANSIT...');
    const tripOrders = await db.order.findMany({ where: { status: 'IN_TRANSIT' } });
    // console.log(tripOrders.length, 'orders found with status=IN_TRANSIT');
    let addedCount = 0;
    for (const order of tripOrders) {
      if (!order.driverId) continue;
      const existing = await db.activeTrip.findUnique({ where: { orderId_driverId: { orderId: order.id, driverId: order.driverId } } });
      if (!existing) {
                  await db.activeTrip.create({
          data: {
            orderId: order.id,
            driverId: order.driverId,
            orderNumber: order.orderNumber,
            // Remove latitude/longitude since they no longer exist on Order model
            // TODO: Get location from order.address if needed
          },
        });
        addedCount++;
      }
    }
    // console.log(`✅ Sync complete. Added ${addedCount} missing ActiveTrip records.`);
    return { success: true, addedCount };
  } catch (error) {
    const err: ActionError =
      typeof error === 'object' && error && 'message' in error
        ? { message: (error as ActionError).message, code: (error as ActionError).code }
        : { message: 'فشل في مزامنة بيانات ActiveTrip.' };
    return { success: false, error: err.message };
  }
}
