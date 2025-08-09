'use server';
import { z } from 'zod';
import db from '@/lib/prisma';

const aboutSchema = z.object({
  heroTitle: z.string().min(2),
  heroSubtitle: z.string().min(2),
  heroImageUrl: z.string().url(),
  missionTitle: z.string().min(2),
  missionText: z.string().min(2),
  ctaTitle: z.string().min(2),
  ctaText: z.string().min(2),
  ctaButtonText: z.string().min(2),
  brandId: z.string().optional(),
  ctaButtonLink: z.string().optional(),
  contactLink: z.string().optional(),
});

export type AboutFormValues = z.infer<typeof aboutSchema>;

export async function updateAboutPageContent(data: AboutFormValues) {
  const parsed = aboutSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() };
  }
  try {
    // Only one AboutPageContent should exist
    const existing = await db.aboutPageContent.findFirst();
    let aboutPage;
    if (existing) {
      aboutPage = await db.aboutPageContent.update({
        where: { id: existing.id },
        data: { ...data },
      });
    } else {
      aboutPage = await db.aboutPageContent.create({
        data: {
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          heroImageUrl: data.heroImageUrl,
          missionTitle: data.missionTitle,
          missionText: data.missionText,
          ctaTitle: data.ctaTitle,
          ctaText: data.ctaText,
          ctaButtonText: data.ctaButtonText,
          brandId: data.brandId || '',
          ctaButtonLink: data.ctaButtonLink || '',
          contactLink: data.contactLink || '',
        },
      });
    }
    return { success: true, aboutPage };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
} 