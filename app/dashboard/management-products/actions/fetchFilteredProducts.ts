'use server';
import db from '@/lib/prisma';
// Define the type for Product including the supplier relation
import { Product } from '@/types/databaseTypes';;
import { Prisma } from '@prisma/client'; // Import Prisma

interface FilterParams {
  name?: string;
  supplierId?: string | null;
  status?: string; // "published", "unpublished", "all"
  type?: string; // "company", "offer", "all"
  stock?: string; // "all", "in", "out"
  page?: number;
  pageSize?: number;
}

export async function fetchFilteredProducts( // Update return type
  filters: FilterParams,
): Promise<{ products: Product[]; total: number }> {
  const where: Prisma.ProductWhereInput = {}; // Use correct type
  if (filters.name) {
    where.name = { contains: filters.name, mode: 'insensitive' };
  }
  if (filters.supplierId) {
    where.supplierId = filters.supplierId;
  }
  if (filters.status && filters.status !== 'all') {
    where.published = filters.status === 'published';
  }
  if (filters.type && filters.type !== 'all') {
    // Directly filter by supplier type
    where.supplier = { type: filters.type };
  }
  if (filters.stock && filters.stock !== 'all') {
    where.outOfStock = filters.stock === 'out';
  }

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 10;

  const [products, total] = await Promise.all([ // Use FetchedProduct type
    db.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }, // Default findMany fetches all scalar fields
      include: { supplier: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.product.count({ where }),
  ]);

  return {
    products: products.map(p => ({ ...p, categorySlug: p.categorySlug ?? null })),
    total
  };
}
