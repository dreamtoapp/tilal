// Fetch product SEO for a given locale
import db from '@/lib/prisma';
import { EntityType } from '@prisma/client';

export async function getProductSeoByLocale(productId: string, locale: string) {
  return db.globalSEO.findUnique({
    where: {
      entityId_entityType_locale: {
        entityId: productId,
        entityType: EntityType.PRODUCT,
        locale,
      },
    },
  });
}
