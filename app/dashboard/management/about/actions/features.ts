import db from '@/lib/prisma';
import { z } from 'zod';

// Remove imageUrl from Zod validation entirely
const featureCreateSchema = z.object({
  title: z.string().min(2, 'العنوان مطلوب'),
  description: z.string().min(2, 'الوصف مطلوب'),
  aboutPageId: z.string().min(1, 'معرف صفحة من نحن مطلوب'),
  icon: z.string().optional(),
});

const featureUpdateSchema = z.object({
  title: z.string().min(2, 'العنوان مطلوب'),
  description: z.string().min(2, 'الوصف مطلوب'),
  aboutPageId: z.string().min(1, 'معرف صفحة من نحن مطلوب'),
  icon: z.string().optional(),
});

export type FeatureFormValues = z.infer<typeof featureCreateSchema> & { imageUrl?: string };

export async function getFeatures() {
  try {
    const features = await db.feature.findMany();
    return { success: true, features };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function createFeature(data: FeatureFormValues) {
  const parsed = featureCreateSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() };
  }
  try {
    const feature = await db.feature.create({ data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl || '',
      aboutPageId: data.aboutPageId,
      icon: data.icon || '',
    }});
    return { success: true, feature };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updateFeature(id: string, data: FeatureFormValues) {
  const parsed = featureUpdateSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() };
  }
  try {
    const feature = await db.feature.update({ where: { id }, data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl || '',
      aboutPageId: data.aboutPageId,
      icon: data.icon || '',
    }});
    return { success: true, feature };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteFeature(id: string) {
  try {
    await db.feature.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
} 