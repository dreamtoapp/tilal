// app/dashboard/seo/pixels/actions.ts
"use server";
import { revalidatePath } from 'next/cache';

import db from '@/lib/prisma';
import { ActionError } from '@/types/commonType';

export async function getAnalyticsSettings() {
  try {
    const settings = await db.analyticsSettings.findFirst({
      where: { singletonKey: 'global_analytics_settings' },
    });
    return settings;
  } catch (error) {
    const err: ActionError =
      typeof error === 'object' && error && 'message' in error
        ? { message: (error as ActionError).message, code: (error as ActionError).code }
        : { message: 'فشل في جلب إعدادات التحليلات.' };
    throw err;
  }
}

export type AnalyticsSettings = {
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  tiktokPixelId?: string;
  snapchatPixelId?: string;
  pinterestTagId?: string;
  linkedinInsightTagId?: string;
};

export async function upsertAnalyticsSettings(
  data: AnalyticsSettings
): Promise<any> {
  type CleanData = Omit<AnalyticsSettings, 'id' | 'updatedAt' | 'singletonKey'>;
  // Remove id and updatedAt from data if present
  const cleanData: CleanData = { ...data };
  delete (cleanData as any).id;
  delete (cleanData as any).updatedAt;
  delete (cleanData as any).singletonKey;

  try {
    const updated = await db.analyticsSettings.upsert({
      where: { singletonKey: 'global_analytics_settings' },
      update: cleanData,
      create: {
        singletonKey: 'global_analytics_settings',
        ...cleanData,
      },
    });
    revalidatePath('/dashboard/seo/pixels');
    return updated;
  } catch (error) {
    const err: ActionError =
      typeof error === 'object' && error && 'message' in error
        ? { message: (error as ActionError).message, code: (error as ActionError).code }
        : { message: 'فشل في تحديث إعدادات التحليلات.' };
    throw err;
  }
}
