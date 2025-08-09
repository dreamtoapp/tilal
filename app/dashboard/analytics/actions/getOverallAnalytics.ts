'use server';
import db from '@/lib/prisma';

export interface OverallAnalyticsData { // Added export
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalCustomers: number; // All time
    newCustomersInPeriod: number;
  };
  salesTrend: Array<{ date: string; revenue: number; orders: number }>;
  topProductsByRevenue: Array<{ id: string; name: string; totalRevenueSold: number; quantitySold: number }>;
  topProductsByQuantity: Array<{ id: string; name: string; quantitySold: number; totalRevenueSold: number }>;
  lowStockProducts: Array<{ id: string; name: string; stockQuantity: number | null }>;
  dateRange: { from: string; to: string };
}

export async function getOverallAnalytics(
  dateFrom?: string,
  dateTo?: string
): Promise<OverallAnalyticsData | null> {
  try {
    const today = new Date();
    const toDate = dateTo ? new Date(dateTo) : new Date();
    const fromDate = dateFrom ? new Date(dateFrom) : new Date(new Date().setDate(today.getDate() - 30)); // Default to last 30 days

    // Ensure 'to' date includes the whole day
    const toDateEndOfDay = new Date(toDate);
    toDateEndOfDay.setHours(23, 59, 59, 999);

    // --- Summary Stats ---
    const ordersInPeriod = await db.order.findMany({
      where: {
        createdAt: {
          gte: fromDate,
          lte: toDateEndOfDay,
        },
        // Optionally filter by status, e.g., only 'Completed' or 'Shipped' orders
        // status: { in: ['Completed', 'Shipped', 'Delivered'] } 
      },
      include: {
        items: true, // To calculate revenue from items
      },
    });

    const totalRevenue = ordersInPeriod.reduce((sum, order) => sum + order.amount, 0);
    const totalOrders = ordersInPeriod.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const totalCustomers = await db.user.count(); // Assuming all users are customers for simplicity

    const newCustomersInPeriod = await db.user.count({
      where: {
        createdAt: {
          gte: fromDate,
          lte: toDateEndOfDay,
        },
      },
    });

    // --- Sales Trend (by day) ---
    const dailySales = await db.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: fromDate,
          lte: toDateEndOfDay,
        },
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const salesTrend = dailySales.map(day => ({
      date: new Date(day.createdAt).toISOString().split('T')[0], // YYYY-MM-DD
      revenue: day._sum.amount || 0,
      orders: day._count.id || 0,
    }));

    // --- Top Selling Products (by revenue and quantity) ---
    const orderItemsInPeriod = await db.orderItem.findMany({
      where: {
        order: {
          createdAt: {
            gte: fromDate,
            lte: toDateEndOfDay,
          },
        },
      },
      include: {
        product: {
          select: { id: true, name: true },
        },
      },
    });

    const productSalesMap = new Map<string, { name: string; totalRevenueSold: number; quantitySold: number }>();
    orderItemsInPeriod.forEach(item => {
      if (item.product) {
        const existing = productSalesMap.get(item.productId);
        const itemRevenue = item.quantity * (item.price || 0);
        if (existing) {
          existing.totalRevenueSold += itemRevenue;
          existing.quantitySold += item.quantity;
        } else {
          productSalesMap.set(item.productId, {
            name: item.product.name,
            totalRevenueSold: itemRevenue,
            quantitySold: item.quantity,
          });
        }
      }
    });

    const allProductSales = Array.from(productSalesMap.entries()).map(([id, data]) => ({ id, ...data }));

    const topProductsByRevenue = [...allProductSales].sort((a, b) => b.totalRevenueSold - a.totalRevenueSold).slice(0, 5);
    const topProductsByQuantity = [...allProductSales].sort((a, b) => b.quantitySold - a.quantitySold).slice(0, 5);

    // --- Low Stock Products ---
    const lowStockProducts = await db.product.findMany({
      where: {
        manageInventory: true,
        stockQuantity: {
          lt: 10, // Example: less than 10
        },
      },
      select: {
        id: true,
        name: true,
        stockQuantity: true,
      },
      orderBy: {
        stockQuantity: 'asc',
      },
      take: 10, // Show top 10 low stock items
    });

    return {
      summary: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders,
        averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
        totalCustomers,
        newCustomersInPeriod,
      },
      salesTrend,
      topProductsByRevenue,
      topProductsByQuantity,
      lowStockProducts,
      dateRange: {
        from: fromDate.toISOString().split('T')[0],
        to: toDate.toISOString().split('T')[0]
      },
    };

  } catch (error) {
    console.error("Error fetching overall analytics:", error);
    return null;
  }
}
