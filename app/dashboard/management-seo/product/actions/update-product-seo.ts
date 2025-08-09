// Update or create product SEO for a given locale
"use server";
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import db from '@/lib/prisma';
import { EntityType } from '@prisma/client';
import { ActionError } from '@/types/commonType';

const schema = z.object({
  productId: z.string(),
  locale: z.string(),
  metaTitle: z.string().min(1, 'Meta title is required'),
  metaDescription: z.string().min(1, 'Meta description is required'),
  openGraphTitle: z.string().optional(),
  openGraphDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  robots: z.string().optional(),
  openGraphImage: z.string().optional(),
  twitterImage: z.string().optional(),
  schemaOrg: z.string().optional(),
  twitterCardType: z.string().optional(),
  customMetaTag: z.string().optional(),
});

export async function updateProductSeo(input: z.infer<typeof schema>) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }
  const data = parsed.data;
  const { productId, locale, ...seoFields } = data;
  try {
    await db.globalSEO.upsert({
      where: {
        entityId_entityType_locale: {
          entityId: productId,
          entityType: EntityType.PRODUCT,
          locale,
        },
      },
      update: seoFields,
      create: {
        entityId: productId,
        entityType: EntityType.PRODUCT,
        locale,
        ...seoFields,
      },
    });
    await Promise.all([
      revalidatePath('/dashboard/seo/product'),
      revalidatePath(`/dashboard/seo/product/${productId}`),
    ]);
    return { success: true };
  } catch (error) {
    const err: ActionError =
      typeof error === 'object' && error && 'message' in error
        ? { message: (error as ActionError).message, code: (error as ActionError).code }
        : { message: 'فشل في تحديث بيانات السيو للمنتج.' };
    return {
      success: false,
      error: err.message,
    };
  }
}
