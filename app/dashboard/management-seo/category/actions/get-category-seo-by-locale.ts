// Server action to get SEO by locale for a category
import db from '@/lib/prisma';
import { EntityType } from '@prisma/client';

export async function getCategorySeoByLocale(categoryId: string) {
  const seo = await db.globalSEO.findMany({
    where: {
      entityId: categoryId,
      entityType: EntityType.CATEGORY,
    },
  });
  const seoByLocale: Record<string, any> = {};
  seo.forEach((entry) => {
    seoByLocale[entry.locale] = entry;
  });
  return seoByLocale;
}
