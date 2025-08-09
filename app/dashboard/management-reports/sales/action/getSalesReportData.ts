import db from '@/lib/prisma';
import { Prisma } from '@prisma/client'; // Import Prisma

export async function getSalesReportData({ from, to }: { from?: string; to?: string }) {
  // Parse date range
  let orderItemWhereInput: Prisma.OrderItemWhereInput = {};
  if (from && to) {
    orderItemWhereInput = {
      order: { // Filter by the related Order's createdAt field
        createdAt: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
    };
  } else {
    // If no date range, fetch all order items (or apply other default filters if any)
    // For an unbounded sales report, this might be very large.
    // Consider if a default range (e.g., last 30 days) should apply if no dates are given,
    // or if 'showAll' truly means all time.
    // For now, if no dates, no date filter is applied to orderItems directly.
    // The subsequent 'orders' fetch will handle date filtering for KPIs and sales chart.
  }

  // Fetch all order items based on the date filter (applied to the related Order)
  const orderItems = await db.orderItem.findMany({
    where: orderItemWhereInput,
    include: { product: true },
  });

  // Group by product
  const productMap = new Map();
  orderItems.forEach((item) => {
    if (!item.product) return;
    const key = item.productId;
    if (!productMap.has(key)) {
      productMap.set(key, {
        name: item.product.name,
        qty: 0,
        total: 0,
      });
    }
    const prod = productMap.get(key);
    prod.qty += item.quantity;
    prod.total += (item.price || 0) * item.quantity;
  });
  // Calculate average unit price for each product
  const allProductsTable = Array.from(productMap.values())
    .map((p) => ({
      ...p,
      unitPrice: p.qty > 0 ? Math.round(p.total / p.qty) : 0,
    }))
    .sort((a, b) => b.qty - a.qty);

  // Top N products (default 3)
  const topProductsTable = allProductsTable.slice(0, 3);
  const remainingCount = allProductsTable.length - topProductsTable.length;

  // Totals
  const totalTopQty = topProductsTable.reduce((sum, p) => sum + p.qty, 0);
  const totalTopSales = topProductsTable.reduce((sum, p) => sum + p.total, 0);
  const totalAllQty = allProductsTable.reduce((sum, p) => sum + p.qty, 0);
  const totalAllSales = allProductsTable.reduce((sum, p) => sum + p.total, 0);

  // Fix: Use correct field 'amount' for sales calculations
  // Construct a separate dateFilter for the Order model for KPIs and sales chart data
  let orderDateFilter: Prisma.OrderWhereInput = {};
  if (from && to) {
    orderDateFilter = {
      createdAt: {
        gte: new Date(from),
        lte: new Date(to),
      },
    };
  }
  // If 'showAll' is true, from/to are undefined, so orderDateFilter remains empty (all orders)

  const orders = await db.order.findMany({
    where: orderDateFilter, // Apply date filter directly to Orders for KPIs/chart
    include: { items: true }, // items might not be needed if orderItems above is comprehensive
  });
  const totalSales = orders.reduce(
    (sum, o) => sum + (typeof o.amount === 'number' && !isNaN(o.amount) ? o.amount : 0),
    0,
  );
  const orderCount = orders.length;
  const avgOrderValue = orderCount ? Math.round(totalSales / orderCount) : 0;
  const topProduct = topProductsTable[0]?.name || '-';

  // Weekly sales chart data (group by day)
  const salesData: { [key: string]: number } = {};
  orders.forEach((order) => {
    const day = order.createdAt?.toLocaleDateString('ar-SA', { weekday: 'long' }) || '';
    salesData[day] =
      (salesData[day] || 0) +
      (typeof order.amount === 'number' && !isNaN(order.amount) ? order.amount : 0);
  });
  const weekDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const salesChart = weekDays.map((day) => ({ day, value: salesData[day] || 0 }));

  return {
    kpis: [
      { label: 'إجمالي المبيعات', value: totalSales.toLocaleString('ar-EG') + ' ر.س', icon: '💰' },
      { label: 'عدد الطلبات', value: orderCount.toLocaleString('ar-EG'), icon: '📦' },
      {
        label: 'متوسط قيمة الطلب',
        value: avgOrderValue.toLocaleString('ar-EG') + ' ر.س',
        icon: '🧾',
      },
      { label: 'المنتج الأكثر مبيعًا', value: topProduct, icon: '⭐' },
    ],
    salesData: salesChart,
    topProducts: topProductsTable,
    allProducts: allProductsTable,
    topProductsTotals: {
      totalTopQty,
      totalTopSales,
      totalAllQty,
      totalAllSales,
      remaining: remainingCount,
    },
  };
}
