// Update or create category SEO for a given locale
"use server";
import db from '@/lib/prisma';
import { EntityType } from '@prisma/client';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ActionError } from '@/types/commonType';

const schema = z.object({
  categoryId: z.string(),
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
});

export async function updateCategorySeo(input: any) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }
  const data = parsed.data;
  const { categoryId, locale, ...seoFields } = data;
  try {
    await db.globalSEO.upsert({
      where: {
        entityId_entityType_locale: {
          entityId: categoryId,
          entityType: EntityType.CATEGORY,
          locale,
        },
      },
      update: seoFields,
      create: {
        entityId: categoryId,
        entityType: EntityType.CATEGORY,
        locale,
        ...seoFields,
      },
    });
    await Promise.all([
      revalidatePath('/dashboard/seo/category'),
      revalidatePath(`/dashboard/seo/category/${categoryId}`),
    ]);
    return { success: true };
  } catch (error) {
    const err: ActionError =
      typeof error === 'object' && error && 'message' in error
        ? { message: (error as ActionError).message, code: (error as ActionError).code }
        : { message: 'فشل في تحديث بيانات السيو للفئة.' };
    return { success: false, error: err.message };
  }
}
