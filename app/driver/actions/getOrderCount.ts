import {
  ORDER_STATUS,
} from '@/constant/order-status';

import db from '@/lib/prisma';

export async function getOrderCount(driverId: string) {
  try {
    const [pendingCount, assignedCount, inWayCount, canceledCount, deliveredCount] = await Promise.all([
      db.order.count({ where: { driverId, status: ORDER_STATUS.PENDING } }),
      db.order.count({ where: { driverId, status: ORDER_STATUS.ASSIGNED } }),
      db.order.count({ where: { driverId, status: ORDER_STATUS.IN_TRANSIT } }),
      db.order.count({ where: { driverId, status: ORDER_STATUS.CANCELED } }),
      db.order.count({ where: { driverId, status: ORDER_STATUS.DELIVERED } }),
    ]);
    return {
      counts: {
        pending: pendingCount,
        assigned: assignedCount,
        inWay: inWayCount,
        canceled: canceledCount,
        delivered: deliveredCount,
      },
    };
  } catch (error) {
    return { error: 'فشل في جلب البيانات. حاول مرة أخرى.' };
  }
}