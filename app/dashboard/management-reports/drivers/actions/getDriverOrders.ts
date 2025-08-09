import db from '@/lib/prisma';

/**
 * Fetch all completed orders for a specific driver, including customer info.
 * @param driverId - The driver's unique ID
 */
export async function getDriverOrders(driverId: string, page = 1, pageSize = 10) {
  const [orders, totalCount] = await Promise.all([
    db.order.findMany({
      where: { driverId },
      orderBy: [{ createdAt: 'desc' }],
      include: { customer: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.order.count({ where: { driverId } }),
  ]);
  return { orders, totalCount, page, pageSize };
}
