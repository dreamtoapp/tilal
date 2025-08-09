'use server';



import db from '@/lib/prisma';
import { orderIncludeRelation } from '@/types/databaseTypes';

export async function getInwayToDriver(driverId: string,) {
  try {
    const ordersToShip = await db.order.findMany({
      where: { driverId },
      include: orderIncludeRelation,
      orderBy: { updatedAt: 'desc' }
    });
    return { ordersToShip };
  } catch (error) {
    return { error: 'فشل في جلب البيانات. حاول مرة أخرى.' };
  }
}