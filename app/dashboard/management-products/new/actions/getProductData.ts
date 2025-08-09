'use server';

import { unstable_cache } from 'next/cache';
import db from '@/lib/prisma';

/**
 * Type definitions for product form data
 */
export interface CategoryOption {
  id: string;
  name: string;
}

export interface SupplierOption {
  id: string;
  name: string;
}

export interface ProductFormData {
  categories: CategoryOption[];
  suppliers: SupplierOption[];
}

/**
 * Error type for data fetching operations
 */
export interface DataFetchError {
  success: false;
  error: string;
  categories: CategoryOption[];
  suppliers: SupplierOption[];
}

export interface DataFetchSuccess {
  success: true;
  categories: CategoryOption[];
  suppliers: SupplierOption[];
}

export type DataFetchResult = DataFetchSuccess | DataFetchError;

/**
 * Fetches categories with error handling and caching
 */
async function fetchCategories(): Promise<CategoryOption[]> {
  console.log('==============================');
  console.log('📦 FETCHING CATEGORIES FROM DB! 📦');
  console.log('==============================');
  try {
    const categories = await db.category.findMany({
      select: { 
        id: true, 
        name: true 
      },
      orderBy: { name: 'asc' },
      // Note: No active field in Category model, fetching all categories
    });

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Fetches suppliers with error handling and caching
 */
async function fetchSuppliers(): Promise<SupplierOption[]> {
  console.log('==============================');
  console.log('🚚 FETCHING SUPPLIERS FROM DB! 🚚');
  console.log('==============================');
  try {
    const suppliers = await db.supplier.findMany({
      select: { 
        id: true, 
        name: true 
      },
      orderBy: { name: 'asc' },
      // Note: No active field in Supplier model, fetching all suppliers
    });

    return suppliers;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return [];
  }
}

/**
 * Cached version of categories fetch (1 hour cache)
 */
const getCachedCategories = unstable_cache(
  fetchCategories,
  ['product-categories'],
  { 
    revalidate: 3600, // 1 hour
    tags: ['categories']
  }
);

/**
 * Cached version of suppliers fetch (1 hour cache)
 */
const getCachedSuppliers = unstable_cache(
  fetchSuppliers,
  ['product-suppliers'],
  { 
    revalidate: 3600, // 1 hour
    tags: ['suppliers']
  }
);

/**
 * Main function to get all product form data
 * Fetches both categories and suppliers with proper error handling
 * 
 * @returns Promise<DataFetchResult> - Success or error result with data
 */
export async function getProductFormData(): Promise<DataFetchResult> {
  try {
    // Fetch both categories and suppliers in parallel
    const [categories, suppliers] = await Promise.all([
      getCachedCategories(),
      getCachedSuppliers(),
    ]);

    // Check if both queries returned data
    if (categories.length === 0 && suppliers.length === 0) {
      return {
        success: false,
        error: 'لا توجد فئات أو موردين متاحين. يرجى التأكد من إضافة البيانات الأساسية أولاً.',
        categories: [],
        suppliers: [],
      };
    }

    // Warn if categories are missing
    // console.warn('No categories found. Products may not be properly categorized.');

    // Warn if suppliers are missing
    // console.warn('No suppliers found. Product sourcing information will be incomplete.');

    return {
      success: true,
      categories,
      suppliers,
    };
  } catch (error) {
    console.error('Error fetching product form data:', error);
    
    return {
      success: false,
      error: error instanceof Error 
        ? `خطأ في قاعدة البيانات: ${error.message}`
        : 'حدث خطأ غير متوقع أثناء تحميل البيانات',
      categories: [],
      suppliers: [],
    };
  }
}

// Note: Utility functions moved to ../helpers/productUtils.ts to avoid server action conflicts 