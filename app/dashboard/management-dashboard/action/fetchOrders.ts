'use server';

import { cacheData } from '@/lib/cache';
import db from '@/lib/prisma';
import { Order } from '@/types/databaseTypes';

import { OrderStatus } from '@prisma/client';

/**
 * Options for fetching orders
 */
type OrderFilterOptions = {
  status?: string;
  page?: number;
  pageSize?: number;
};

/**
 * Fetches orders with optional filtering and pagination
 * Uses cacheData utility for efficient data caching with a 1-hour revalidation period
 * 
 * @returns Promise containing an array of orders with related data
 */
export const fetchOrdersAction = cacheData(
  async (options?: OrderFilterOptions) => {
    console.log('==============================');
    console.log('📦 FETCHING ORDERS FROM DB! 📦');
    console.log('==============================');
    // Set defaults for undefined options
    const {
      status,
      page = 1,
      pageSize = 10
    } = options || {};

    try {
      // Build where clause conditionally with proper type conversion
      const where = status && Object.values(OrderStatus).includes(status as OrderStatus) 
        ? { status: status as OrderStatus } 
        : undefined;

      // Fetch orders with relations
      const orders = await db.order.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          items: {
            include: { product: true }
          },
          customer: true,
          driver: true,
          shift: true
        }
      });

      return orders as Order[];
    } catch (error) {
      throw new Error('Failed to fetch orders.');
    }
  },
  ['fetchOrders'],
  { revalidate: 3600 }
);