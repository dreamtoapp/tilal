// Server action to get all categories with SEO status
import db from '@/lib/prisma';
import { EntityType } from '@prisma/client';

export async function getAllCategoriesWithSeoStatus() {
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { id: 'asc' },
  });

  // Fetch all GlobalSEO for categories in one query
  const seoList = await db.globalSEO.findMany({
    where: {
      entityType: EntityType.CATEGORY,
      entityId: { in: categories.map((p: any) => p.id) },
    },
  });

  // Map SEO status per locale
  return categories.map((category: any) => {
    const seoStatus: Record<string, { hasMetaTitle: boolean; hasMetaDescription: boolean }> = {};
    seoList.filter(seo => seo.entityId === category.id).forEach((seo: any) => {
      seoStatus[seo.locale] = {
        hasMetaTitle: !!seo.metaTitle,
        hasMetaDescription: !!seo.metaDescription,
      };
    });
    return { ...category, seoStatus };
  });
}
