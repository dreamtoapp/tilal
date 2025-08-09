"use server"
import { revalidatePath } from 'next/cache'; // Import revalidatePath
import { z } from 'zod';

import db from '@/lib/prisma';
import {
  EntityType,
  type GlobalSEO,
} from '@prisma/client';
import { ActionError } from '@/types/commonType';

// Placeholder for SEO actions
export async function getAllSeoEntries() {
  try {
    const seoEntries = await db.globalSEO.findMany();
    return seoEntries;
  } catch (error) {
    const err: ActionError =
      typeof error === 'object' && error && 'message' in error
        ? { message: (error as ActionError).message, code: (error as ActionError).code }
        : { message: 'فشل في جلب بيانات السيو.' };
    throw err;
  }
}

export async function getSeoEntryById(id: string) { // New function
  try {
    const seoEntry = await db.globalSEO.findUnique({
      where: { id },
    });
    return seoEntry;
  } catch (error) {
    const err: ActionError =
      typeof error === 'object' && error && 'message' in error
        ? { message: (error as ActionError).message, code: (error as ActionError).code }
        : { message: `فشل في جلب بيانات السيو للمعرف ${id}.` };
    throw err;
  }
}

/**
 * Fetch a single SEO entry by business key (entityId + entityType + locale).
 * This is the recommended way for main pages (homepage, about, blog, etc).
 */
export async function getSeoEntryByEntity(entityId: string, entityType: EntityType, locale: string) {
  try {
    const seoEntry = await db.globalSEO.findUnique({
      where: {
        entityId_entityType_locale: {
          entityId,
          entityType,
          locale,
        },
      },
    });
    return seoEntry;
  } catch (error) {
    const err: ActionError =
      typeof error === 'object' && error && 'message' in error
        ? { message: (error as ActionError).message, code: (error as ActionError).code }
        : { message: `فشل في جلب بيانات السيو للكيان ${entityId}.` };
    throw err;
  }
}

export async function deleteSeoEntry(id: string) { // New function
  try {
    await db.globalSEO.delete({
      where: { id },
    });
    revalidatePath('/seo');
    return { success: true };
  } catch (error) {
    const err: ActionError =
      typeof error === 'object' && error && 'message' in error
        ? { message: (error as ActionError).message, code: (error as ActionError).code }
        : { message: `فشل في حذف بيانات السيو للمعرف ${id}.` };
    return { success: false, errors: { _form: [err.message] } };
  }
}

const seoFormDataSchema = z.object({
  entityId: z.string().min(1, { message: 'Entity ID is required' }),
  metaTitle: z.string().min(1, { message: 'Meta title is required' }).max(120, { message: 'Meta title must be less than 120 characters' }),
  metaDescription: z.string().max(320, { message: 'Meta description must be less than 320 characters' }),
  entityType: z.nativeEnum(EntityType),
  locale: z.string().min(2, { message: 'Locale is required' }),
  canonicalUrl: z.string().url().optional(),
  robots: z.string().optional(),
  schemaOrg: z.any().optional(),
});

export type SeoFormData = z.infer<typeof seoFormDataSchema>;

export type ServerActionResult = {
  success: boolean;
  data?: { id: string };
  errors?: Record<string, string[]>;
};

export async function createSeoEntry(data: SeoFormData): Promise<ServerActionResult> {
  try {
    const validatedData = seoFormDataSchema.safeParse(data);

    if (!validatedData.success) {
      const errors: Record<string, string[]> = {};
      validatedData.error.errors.forEach((error) => {
        const field = error.path.join('.');
        errors[field] = errors[field] || [];
        errors[field].push(error.message);
      });
      return { success: false, errors };
    }

    const seoEntry: GlobalSEO = await db.globalSEO.create({
      data: {
        ...validatedData.data,
        // locale is now required and included in validatedData.data
      },
    });

    return { success: true, data: { id: seoEntry.id } };
  } catch (error) {
    const err: ActionError =
      typeof error === 'object' && error && 'message' in error
        ? { message: (error as ActionError).message, code: (error as ActionError).code }
        : { message: 'فشل في إنشاء بيانات السيو.' };
    return { success: false, errors: { _form: [err.message] } };
  }
}

export async function updateSeoEntry(id: string, data: Partial<{ metaTitle: string; metaDescription: string; schemaOrg: string }>) {
  try {
    await db.globalSEO.update({
      where: { id },
      data,
    });
    revalidatePath('/dashboard/seo');
    return { success: true };
  } catch (error) {
    const err: ActionError =
      typeof error === 'object' && error && 'message' in error
        ? { message: (error as ActionError).message, code: (error as ActionError).code }
        : { message: 'فشل في تحديث بيانات السيو.' };
    return { success: false, errors: { _form: [err.message] } };
  }
}
