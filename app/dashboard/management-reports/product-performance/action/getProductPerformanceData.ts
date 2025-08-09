import db from '@/lib/prisma';

// Define a specific type for the product performance data structure
interface ProductPerformanceData {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null; // Align with mapped data
  supplierName: string | null; // Align with mapped data
  published: boolean;
  outOfStock: boolean;
  quantitySold: number;
  revenue: number;
  orderCount: number;
}

export async function getProductPerformanceData({ from, to }: { from?: string; to?: string }) {
  // Note: Date filtering (from/to) is applied *after* fetching, within the map below

  // Get all products
  const products = await db.product.findMany({
    include: {
      supplier: true,
      orderItems: {
        include: {
          order: true,
        },
      },
    },
  });

  // Aggregate sales data per product
  const productPerformance = products.map((product) => {
    // Filter orderItems by date (if provided)
    const filteredOrderItems = product.orderItems.filter((item) => {
      if (!item.order) return false;
      const createdAt = new Date(item.order.createdAt);
      if (from && createdAt < new Date(from)) return false;
      if (to && createdAt > new Date(to)) return false;
      return true;
    });
    const quantitySold = filteredOrderItems.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
    const revenue = filteredOrderItems.reduce(
      (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0),
      0,
    );
    const orderCount = new Set(filteredOrderItems.map((item) => item.orderId)).size;
    return {
      id: product.id,
      name: product.name, // Ensure this matches ProductPerformanceData
      price: product.price,
      imageUrl: product.imageUrl, // Keep as string | null
      supplierName: product.supplier?.name || null, // Keep as string | null
      published: product.published,
      outOfStock: product.outOfStock,
      quantitySold,
      revenue,
      orderCount,
    };
  });

  // KPIs (Arabic labels, 2 decimal for revenue)
  const totalProductsSold = productPerformance.reduce((sum, p) => sum + p.quantitySold, 0);
  const totalRevenue = productPerformance.reduce((sum, p) => sum + p.revenue, 0);
  const bestSeller = productPerformance.reduce(
    (best: ProductPerformanceData | undefined, p) => (p.quantitySold > (best?.quantitySold ?? 0) ? p : best),
    undefined, // Correctly typed initial value
  );

  const kpis = [
    { label: 'إجمالي المنتجات المباعة', value: totalProductsSold },
    { label: 'إجمالي الإيرادات', value: totalRevenue.toFixed(2) },
    { label: 'الأكثر مبيعًا', value: bestSeller ? bestSeller.name : '-' },
    { label: 'إجمالي المنتجات', value: products.length },
  ];

  // Chart Data
  const chartData = productPerformance.map((p) => ({
    name: p.name,
    quantitySold: p.quantitySold,
    revenue: p.revenue,
  }));

  return {
    products: productPerformance,
    kpis,
    chartData,
    initialFrom: from, // Add initialFrom
    initialTo: to,     // Add initialTo
  };
}
