'use server';
import db from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// --- Types ---
interface ProductAnalyticsResult {
  product: any;
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  salesByMonth: { month: string; sales: number }[];
  orderHistory: any[];
  reviews: { list: any[]; average: number; count: number };
  totalProfit: number;
  averageProfitMargin: number;
  activityStartDate: string;
  activityEndDate: string;
}

// --- Data Fetching Helpers ---
async function fetchProductInfo(productId: string) {
  return db.product.findUnique({
    where: { id: productId },
    select: {
      id: true, name: true, imageUrl: true, price: true, costPrice: true, outOfStock: true, supplierId: true, published: true, type: true, createdAt: true, slug: true, details: true, size: true, updatedAt: true, productCode: true, gtin: true, brand: true, material: true, color: true, dimensions: true, weight: true, features: true, requiresShipping: true, stockQuantity: true, manageInventory: true, compareAtPrice: true, tags: true, shippingDays: true, returnPeriodDays: true, hasQualityGuarantee: true, careInstructions: true, images: true, description: true, rating: true, reviewCount: true,
    },
  });
}

async function fetchSupplierName(supplierId?: string | null) {
  if (!supplierId) return null;
  const supplier = await db.supplier.findUnique({ where: { id: supplierId }, select: { name: true } });
  return supplier?.name ?? null;
}

function buildDateFilters(dateFrom?: string, dateTo?: string) {
  const fromDate = dateFrom ? new Date(dateFrom) : undefined;
  const toDate = dateTo ? new Date(dateTo) : undefined;
  let orderWhereDateFilter: Prisma.OrderWhereInput = {};
  let reviewWhereDateFilter: Prisma.ReviewWhereInput = {};
  if (fromDate && toDate) {
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);
    orderWhereDateFilter.createdAt = { gte: fromDate, lte: end };
    reviewWhereDateFilter.createdAt = { gte: fromDate, lte: end };
  }
  return { orderWhereDateFilter, reviewWhereDateFilter };
}

async function fetchOrderItems(productId: string, orderWhereDateFilter: Prisma.OrderWhereInput) {
  return db.orderItem.findMany({
    where: { productId, order: orderWhereDateFilter },
    include: { order: { select: { id: true, customerId: true, createdAt: true, customer: { select: { name: true } }, status: true, orderNumber: true } } },
  });
}

async function fetchReviews(productId: string, reviewWhereDateFilter: Prisma.ReviewWhereInput) {
  return db.review.findMany({
    where: { productId, ...reviewWhereDateFilter },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

// --- Data Processing Helpers ---
function calculateRevenue(orderItems: any[]) {
  return orderItems.reduce((sum, item) => sum + item.quantity * (item.price || 0), 0);
}

function getUniqueCount(items: any[], key: string) {
  return new Set(items.map(item => item[key])).size;
}

function getUniqueCustomerCount(orderItems: any[]) {
  return new Set(orderItems.map(item => item.order?.customerId).filter(Boolean)).size;
}

function getSalesByMonth(orderItems: any[]) {
  const revenueByMonth: Record<string, number> = {};
  orderItems.forEach(({ order, quantity, price }) => {
    if (order?.createdAt) {
      const month = order.createdAt.toISOString().slice(0, 7);
      revenueByMonth[month] = (revenueByMonth[month] || 0) + quantity * (price || 0);
    }
  });
  return Object.entries(revenueByMonth)
    .map(([month, sales]) => ({ month, sales }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

function buildOrderHistory(orderItems: any[]) {
  return orderItems.map(item => ({
    id: item.id,
    quantity: item.quantity,
    price: item.price,
    orderId: item.orderId,
    order: item.order
      ? {
        createdAt: item.order.createdAt,
        customerName: item.order.customer?.name ?? null,
        status: item.order.status,
        orderNumber: item.order.orderNumber,
      }
      : null,
  }));
}

function processReviews(reviewsRaw: any[]) {
  const totalReviews = reviewsRaw.length;
  const avgRating = totalReviews ? reviewsRaw.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
  const reviewsList = reviewsRaw.map(r => ({
    id: r.id,
    user: r.user?.name || 'مستخدم غير معروف',
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
  }));
  return { list: reviewsList, average: parseFloat(avgRating.toFixed(1)), count: totalReviews };
}

function getActivityDates(productInfo: any, orderItems: any[], reviewsRaw: any[]) {
  const timestamps = [productInfo.createdAt.getTime()];
  orderItems.forEach(item => item.order?.createdAt && timestamps.push(item.order.createdAt.getTime()));
  if (reviewsRaw[0]) timestamps.push(new Date(reviewsRaw[0].createdAt).getTime());
  const startDate = new Date(Math.min(...timestamps));
  const endDate = new Date(Math.max(...timestamps, Date.now()));
  return {
    activityStartDate: startDate.toISOString().split('T')[0],
    activityEndDate: endDate.toISOString().split('T')[0],
  };
}

function calculateProfit(productInfo: any, orderItems: any[], totalRevenue: number) {
  const totalCOGS = productInfo.costPrice
    ? orderItems.reduce((sum, item) => sum + item.quantity, 0) * productInfo.costPrice
    : 0;
  const totalProfit = totalRevenue - totalCOGS;
  const avgProfitMargin = totalRevenue ? (totalProfit / totalRevenue) * 100 : 0;
  return {
    totalProfit: parseFloat(totalProfit.toFixed(2)),
    averageProfitMargin: parseFloat(avgProfitMargin.toFixed(2)),
  };
}

// --- Main Analytics Function ---
export async function getProductAnalytics(
  productId: string,
  dateFrom?: string,
  dateTo?: string
): Promise<ProductAnalyticsResult | null> {
  try {
    // Fetch product and supplier in parallel
    const productInfo = await fetchProductInfo(productId);
    if (!productInfo) return null;
    const [supplierName, { orderWhereDateFilter, reviewWhereDateFilter }] = await Promise.all([
      fetchSupplierName(productInfo.supplierId),
      Promise.resolve(buildDateFilters(dateFrom, dateTo))
    ]);
    // Fetch order items and reviews in parallel
    const [orderItems, reviewsRaw] = await Promise.all([
      fetchOrderItems(productId, orderWhereDateFilter),
      fetchReviews(productId, reviewWhereDateFilter)
    ]);
    // Process analytics
    const totalRevenue = calculateRevenue(orderItems);
    const totalUniqueOrders = getUniqueCount(orderItems, 'orderId');
    const totalUniqueCustomers = getUniqueCustomerCount(orderItems);
    const salesByMonth = getSalesByMonth(orderItems);
    const orderHistory = buildOrderHistory(orderItems);
    const reviews = processReviews(reviewsRaw);
    const { activityStartDate, activityEndDate } = getActivityDates(productInfo, orderItems, reviewsRaw);
    const { totalProfit, averageProfitMargin } = calculateProfit(productInfo, orderItems, totalRevenue);
    // Prepare final product structure
    const finalProduct = {
      ...productInfo,
      supplierName,
      size: productInfo.size ?? null,
      details: productInfo.details ?? null,
      imageUrl: productInfo.imageUrl ?? null,
      productCode: productInfo.productCode ?? null,
      gtin: productInfo.gtin ?? null,
      material: productInfo.material ?? null,
      brand: productInfo.brand ?? null,
      color: productInfo.color ?? null,
      dimensions: productInfo.dimensions ?? null,
      weight: productInfo.weight ?? null,
      shippingDays: productInfo.shippingDays ?? null,
      careInstructions: productInfo.careInstructions ?? null,
      returnPeriodDays: productInfo.returnPeriodDays,
    };
    return {
      product: finalProduct,
      totalRevenue,
      totalOrders: totalUniqueOrders,
      totalCustomers: totalUniqueCustomers,
      salesByMonth,
      orderHistory,
      reviews,
      totalProfit,
      averageProfitMargin,
      activityStartDate,
      activityEndDate,
    };
  } catch (error) {
    console.error('Product analytics error:', error);
    return null;
  }
} 