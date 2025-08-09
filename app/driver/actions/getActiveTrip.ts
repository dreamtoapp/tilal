'use server';



import db from '@/lib/prisma';
import { orderIncludeRelation } from '@/types/databaseTypes';

export async function getActiveTrip(driverId: string) {
  const getOrderId = await db.activeTrip.findFirst({
    where: {
      driverId: driverId, // تأكد من أن driverId معرّف
    },
  });
  const orderId = getOrderId?.orderId;
  if (!orderId) {
    return false;
  }

  try {
    const activeOrder = await db.order.findFirst({
      where: { id: orderId },
      include: orderIncludeRelation,

      orderBy: { updatedAt: 'desc' },
    });

    return activeOrder;
  } catch (error) {
    console.error('Database error:', error);
    // return { error: "فشل في جلب البيانات. حاول مرة أخرى." };
  }
}