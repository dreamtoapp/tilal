'use server';

import {
  endOfDay,
  format,
  startOfDay,
} from 'date-fns';

import db from '@/lib/prisma';

// Server actions for the Order Analytics page

/**
 * Fetches sales data aggregated by day for a given date range.
 * @param startDate - The start date of the range.
 * @param endDate - The end date of the range.
 * @returns An array of objects with date and total sales amount.
 */
export async function getSalesTrends(startDate: Date, endDate: Date) {
  try {
    const salesData = await db.order.findMany({
      where: {
        createdAt: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
        // Optionally filter by status if only completed orders should count towards sales
        status: 'DELIVERED',
      },
      select: {
        createdAt: true,
        amount: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Aggregate sales by day
    const dailySalesMap = new Map<string, number>();

    salesData.forEach(order => {
      const dateKey = format(startOfDay(order.createdAt), 'yyyy-MM-dd');
      const currentTotal = dailySalesMap.get(dateKey) || 0;
      dailySalesMap.set(dateKey, currentTotal + order.amount);
    });

    // Convert map to array of objects
    const aggregatedSales = Array.from(dailySalesMap, ([date, total]) => ({
      date,
      total,
    }));

    return { success: true, data: aggregatedSales };
  } catch (error) {
    console.error('Error fetching sales trends:', error);
    return { success: false, error: 'Failed to fetch sales trends.' };
  }
}

/**
 * Temporary function to check the status of a few orders.
 * @returns An array of order statuses.
 */
export async function checkOrderStatuses() {
  try {
    const orders = await db.order.findMany({
      take: 10,
      select: {
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { success: true, data: orders.map(order => ({ status: order.status, createdAt: order.createdAt })) };
  } catch (error) {
    console.error('Error checking order statuses:', error);
    return { success: false, error: 'Failed to check order statuses.' };
  }
}

/**
 * Fetches the distribution of orders by status.
 * @returns An array of objects with status and count.
 */
export async function getOrderStatusDistribution() {
  try {
    const statusDistribution = await db.order.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    // Map the result to a more convenient format
    const formattedDistribution = statusDistribution.map(item => ({
      status: item.status,
      count: item._count.id,
    }));

    return { success: true, data: formattedDistribution };
  } catch (error) {
    console.error('Error fetching order status distribution:', error);
    return { success: false, error: 'Failed to fetch order status distribution.' };
  }
}

/**
 * Fetches the top N most popular products based on quantity sold.
 * @param limit - The maximum number of popular products to return.
 * @returns An array of objects with product name and total quantity sold.
 */
export async function getPopularProducts(limit: number = 10) {
  try {
    const popularProducts = await db.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    });

    // Fetch product names for the popular product IDs
    const productIds = popularProducts.map(item => item.productId);
    const products = await db.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Map product names to the aggregated data
    const formattedPopularProducts = popularProducts.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        productName: product?.name || 'Unknown Product',
        totalQuantity: item._sum.quantity || 0,
      };
    });

    return { success: true, data: formattedPopularProducts };
  } catch (error) {
    console.error('Error fetching popular products:', error);
    return { success: false, error: 'Failed to fetch popular products.' };
  }
}
