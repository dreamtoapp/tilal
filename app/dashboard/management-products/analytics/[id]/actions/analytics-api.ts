import db from '@/lib/prisma';

export async function getProductAnalytics(productId: string) {
  // Total quantity sold for this product
  const totalSalesAgg = await db.orderItem.aggregate({
    _sum: { quantity: true },
    where: { productId },
  });
  const totalOrders = await db.orderItem.count({ where: { productId } });

  // Get sales by month for the last 12 months (MongoDB version)
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return d;
  });
  // Fetch all orderItems for this product in the last 12 months
  const fromDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const orderItems = await db.orderItem.findMany({
    where: {
      productId,
      order: { createdAt: { gte: fromDate } },
    },
    include: { order: true },
  });
  // Group sales by month
  const salesByMonth = months.map((monthDate) => {
    const nextMonth = new Date(monthDate);
    nextMonth.setMonth(monthDate.getMonth() + 1);
    const month = monthDate.toLocaleString('default', { year: 'numeric', month: '2-digit' });
    const sales = orderItems
      .filter((oi) => {
        const created = oi.order?.createdAt;
        return created && created >= monthDate && created < nextMonth;
      })
      .reduce((sum, oi) => sum + (oi.quantity || 0), 0);
    return { month, sales };
  });

  return {
    totalSales: totalSalesAgg._sum.quantity || 0,
    totalOrders,
    salesByMonth,
  };
} 