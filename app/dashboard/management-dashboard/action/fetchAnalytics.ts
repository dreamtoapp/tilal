'use server';

import { cacheData } from '@/lib/cache';
import db from '@/lib/prisma';

// Cached analytics function
export const fetchAnalytics = cacheData(
  async () => {
    console.log('==============================');
    console.log('📊 FETCHING ANALYTICS FROM DB! 📊');
    console.log('==============================');
    try {
      // Get total count of orders
      const totalOrders = await db.order.count();
      
      // Get count of orders by status
      const pendingOrders = await db.order.count({
        where: {
          status: 'PENDING'
        }
      });
      
      const inWayOrders = await db.order.count({
        where: {
          status: 'IN_TRANSIT'
        }
      });
      
      const deliveredOrders = await db.order.count({
        where: {
          status: 'DELIVERED'
        }
      });
      
      const canceledOrders = await db.order.count({
        where: {
          status: 'CANCELED'
        }
      });

      return {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        inWayOrders,
        canceledOrders,
      };
    } catch (error) {
      console.error('Error in fetchAnalytics:', error);
      // Return default values in case of error
      return {
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        inWayOrders: 0,
        canceledOrders: 0,
      };
    }
  },
  ['analyticsData'], // Cache key as static array
  { revalidate: 3600 }, // Revalidate every hour
);
