"use server";

import db from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

// Types for analytics data
export interface OrderAnalyticsData {
  totalOrders: number;
  ordersByStatus: { status: string; _count: { status: number } }[];
  totalRevenue: number;
  firstOrder?: { orderNumber: string; createdAt: Date };
  lastOrder?: { orderNumber: string; createdAt: Date };
  todayOrdersByStatus: { status: string; _count: { status: number } }[];
  unfulfilledOrders: number;
  returnsCount: number;
  salesTrends: { date: string; orders: number; revenue: number }[];
  topProducts: { name: string; count: number }[];
  topCustomers: { name: string; total: number }[];
}

export interface GetOrderAnalyticsResult {
  success: boolean;
  data?: OrderAnalyticsData;
  error?: string;
}

// --- Analytics helpers ---

async function getCoreStats() {
  const [totalOrders, revenueResult] = await Promise.all([
    db.order.count(),
    db.order.aggregate({ _sum: { amount: true } })
  ]);
  return {
    totalOrders,
    totalRevenue: revenueResult._sum.amount || 0
  };
}

async function getStatusAnalytics() {
  const [ordersByStatus, todayOrdersByStatus] = await Promise.all([
    db.order.groupBy({ by: ['status'], _count: { status: true } }),
    getTodayStatusCounts()
  ]);
  return { ordersByStatus, todayOrdersByStatus };
}

async function getTodayStatusCounts() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return db.order.groupBy({
    by: ['status'],
    where: { createdAt: { gte: today, lt: tomorrow } },
    _count: { status: true }
  });
}

async function getOrderTimeline() {
  const [firstOrder, lastOrder] = await Promise.all([
    db.order.findFirst({ orderBy: { createdAt: 'asc' }, select: { orderNumber: true, createdAt: true } }),
    db.order.findFirst({ orderBy: { createdAt: 'desc' }, select: { orderNumber: true, createdAt: true } })
  ]);
  return { firstOrder, lastOrder };
}

async function getFulfillmentMetrics() {
  const [unfulfilledOrders] = await Promise.all([
    db.order.count({ where: { status: { notIn: [OrderStatus.DELIVERED, OrderStatus.CANCELED] } } })
  ]);
  return { unfulfilledOrders };
}

async function getSalesTrendAnalysis() {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 29);
  const rawData = await db.order.findMany({
    where: { createdAt: { gte: fromDate } },
    select: { createdAt: true, amount: true }
  });
  // Aggregate by day
  const trends: Record<string, { date: string; orders: number; revenue: number }> = {};
  for (const order of rawData) {
    const date = order.createdAt.toISOString().slice(0, 10);
    if (!trends[date]) trends[date] = { date, orders: 0, revenue: 0 };
    trends[date].orders++;
    trends[date].revenue += order.amount || 0;
  }
  return Object.values(trends).sort((a, b) => a.date.localeCompare(b.date));
}

async function getProductLeaderboard() {
  const items = await db.orderItem.findMany({
    select: { productId: true, quantity: true, product: { select: { name: true } } }
  });
  const productMap: Record<string, { name: string; count: number }> = {};
  for (const item of items) {
    if (!item.product) continue;
    if (!productMap[item.productId]) productMap[item.productId] = { name: item.product.name, count: 0 };
    productMap[item.productId].count += item.quantity;
  }
  return Object.values(productMap).sort((a, b) => b.count - a.count).slice(0, 5);
}

async function getCustomerLeaderboard() {
  const orders = await db.order.findMany({
    where: { customerId: { not: undefined } },
    select: { amount: true, customer: { select: { name: true } } }
  });
  const customerMap: Record<string, number> = {};
  for (const order of orders) {
    const name = order.customer?.name;
    if (!name) continue;
    customerMap[name] = (customerMap[name] || 0) + (order.amount || 0);
  }
  return Object.entries(customerMap)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
}

// --- Main analytics function ---

export async function getOrderAnalytics(): Promise<GetOrderAnalyticsResult> {
  try {
    // Run all analytics in parallel
    const [coreStats, statusAnalytics, timeline, fulfillmentMetrics, salesTrends, topProducts, topCustomers] = await Promise.all([
      getCoreStats(),
      getStatusAnalytics(),
      getOrderTimeline(),
      getFulfillmentMetrics(),
      getSalesTrendAnalysis(),
      getProductLeaderboard(),
      getCustomerLeaderboard()
    ]);
    // Combine all analytics into one object
    const analyticsData: OrderAnalyticsData = {
      ...coreStats,
      ...statusAnalytics,
      firstOrder: timeline.firstOrder || undefined,
      lastOrder: timeline.lastOrder || undefined,
      returnsCount: 0,
      ...fulfillmentMetrics,
      salesTrends,
      topProducts,
      topCustomers,
    };
    return { success: true, data: analyticsData };
  } catch (error) {
    console.error("Order analytics error:", error);
    return { success: false, error: "Failed to generate order analytics" };
  }
}