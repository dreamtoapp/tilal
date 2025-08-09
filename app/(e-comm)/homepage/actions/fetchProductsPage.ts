'use server';

import db from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

type FetchProductsParams = {
  search?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: string;
  page?: number;
  pageSize?: number;
  slug?: string;
};

// Fetch products for homepage/search with filters
export async function fetchProductsPage({
  search = '',
  priceMin,
  priceMax,
  sortBy,
  page = 1,
  pageSize = 8,
  slug
}: FetchProductsParams) {
  const where: any = { published: true };
  if (typeof search === 'string' && search.trim() !== '') {
    where.name = { contains: search.trim(), mode: 'insensitive' };
  }
  if (slug) {
    where.categorySlug = slug;
  }
  if (priceMin !== undefined) where.price = { ...where.price, gte: priceMin };
  if (priceMax !== undefined) where.price = { ...where.price, lte: priceMax };

  // Sort logic
  let orderBy: any = { createdAt: 'desc' };
  if (sortBy === 'priceAsc') orderBy = { price: 'asc' };
  if (sortBy === 'priceDesc') orderBy = { price: 'desc' };
  if (sortBy === 'mostSale') orderBy = { salesCount: 'desc' };

  const skip = (page - 1) * pageSize;
  const [products, total] = await db.$transaction([
    db.product.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        compareAtPrice: true,
        imageUrl: true,
        rating: true,
        reviewCount: true,
        previewCount: true,
        outOfStock: true,
        details: true,
        brand: true,
        size: true,
        description: true,
        features: true,
        categoryAssignments: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    }),
    db.product.count({ where }),
  ]);

  return {
    products,
    total,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page,
  };
}

// Cached version for use in homepage
export async function getCachedProductsPage(params: FetchProductsParams) {
  const cacheKey = `products-${JSON.stringify(params)}`;
  
  const cachedFetch = unstable_cache(
    () => fetchProductsPage(params),
    [cacheKey],
    {
      tags: ['products'],
      revalidate: 3600 // 1 hour
    }
  );
  
  return cachedFetch();
}
