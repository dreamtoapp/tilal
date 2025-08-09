// Server action to fetch all products and their SEO status for each locale
import db from '@/lib/prisma';
import { EntityType } from '@prisma/client';

const LOCALES = ['ar-SA', 'en-US'];

export async function getAllProductsWithSeoStatus() {
  // Fetch all products
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Fetch all SEO data for these products and locales in one query
  const allSeoData = await db.globalSEO.findMany({
    where: {
      entityType: EntityType.PRODUCT,
      entityId: { in: products.map((p) => p.id) },
      locale: { in: LOCALES },
    },
  });

  // Map SEO status in memory
  const results = products.map((product) => {
    const seoStatus: Record<string, { hasMetaTitle: boolean; hasMetaDescription: boolean }> = {};
    for (const locale of LOCALES) {
      const seo = allSeoData.find(
        (s) => s.entityId === product.id && s.locale === locale
      );
      seoStatus[locale] = {
        hasMetaTitle: !!seo?.metaTitle,
        hasMetaDescription: !!seo?.metaDescription,
      };
    }
    return { ...product, seoStatus };
  });
  return results;
}
