import db from '@/lib/prisma';

export async function getInventory() {
  const productsRaw = await db.product.findMany({
    include: { supplier: true },
    orderBy: [{ outOfStock: 'desc' }, { name: 'asc' }],
  });
  return productsRaw.map((p) => ({
    ...p,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
    supplier: p.supplier
      ? {
          ...p.supplier,
          createdAt:
            p.supplier.createdAt instanceof Date
              ? p.supplier.createdAt.toISOString()
              : p.supplier.createdAt,
          updatedAt:
            p.supplier.updatedAt instanceof Date
              ? p.supplier.updatedAt.toISOString()
              : p.supplier.updatedAt,
        }
      : undefined,
  }));
}
