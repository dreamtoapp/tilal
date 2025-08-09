import db from '@/lib/prisma';
import { Prisma } from '@prisma/client'; // Import Prisma types

// Define the type for Order including relations based on the query
type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    customer: true,
    items: { include: { product: true } },
  }
}>;

/**
 * احصائيات الطلبات: العدد الإجمالي، الإيرادات، متوسط قيمة الطلب، توزيع الحالات، الأعلى قيمة، الاتجاه الزمني.
 */
export async function getOrderAnalyticsData({ from, to }: { from?: string; to?: string }) {
  let orderDateFilter: Prisma.OrderWhereInput = {};
  if (from || to) {
    orderDateFilter = {
      createdAt: {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      },
    };
  }

  // جلب جميع الطلبات مع العميل والعناصر
  const orders: OrderWithRelations[] = await db.order.findMany({
    where: orderDateFilter,
    include: {
      customer: true,
      items: { include: { product: true } },
    },
  });

  // KPIs
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount ?? 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const topOrder = orders.reduce(
    (best: OrderWithRelations | undefined, o) => ((o.amount ?? 0) > (best?.amount ?? 0) ? o : best),
    undefined, // Use the more specific type here too
  );

  // أعلى طلب (تفاصيل)
  let topOrderInfo = null;
  if (topOrder) {
    topOrderInfo = {
      orderNumber: topOrder.orderNumber ?? topOrder.id,
      amount: topOrder.amount ?? 0,
      customer: topOrder.customer?.name ?? '-',
    };
  }

  // توزيع الحالات
  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });

  // الأعلى منتجات
  const productCounts: Record<string, { name: string; count: number }> = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const pid = item.productId;
      if (!productCounts[pid]) {
        productCounts[pid] = { name: item.product?.name ?? '-', count: 0 };
      }
      productCounts[pid].count += item.quantity ?? 1;
    });
  });
  const topProducts = Object.values(productCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // اتجاه الطلبات (حسب اليوم)
  const trends: Record<string, { date: string; orders: number; revenue: number }> = {};
  orders.forEach((o) => {
    const date = o.createdAt.toISOString().slice(0, 10);
    if (!trends[date]) trends[date] = { date, orders: 0, revenue: 0 };
    trends[date].orders += 1;
    trends[date].revenue += o.amount ?? 0;
  });
  const trendData = Object.values(trends).sort((a, b) => a.date.localeCompare(b.date));

  // KPIs
  const kpis = [
    { label: 'إجمالي الطلبات', value: totalOrders },
    { label: 'إجمالي الإيرادات', value: totalRevenue.toFixed(2) },
    { label: 'متوسط قيمة الطلب', value: avgOrderValue.toFixed(2) },
    { label: 'أعلى طلب', value: topOrderInfo },
  ];

  // توزيع الحالات للرسم البياني
  const statusChartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  return {
    orders,
    kpis,
    statusChartData,
    topProducts,
    trendData,
  };
}
