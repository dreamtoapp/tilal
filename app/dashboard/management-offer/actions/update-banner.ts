'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import db from '@/lib/prisma';

export async function updateOfferBanner(offerId: string, bannerImageUrl: string) {
  try {
    // Check if offer exists
    const offer = await db.offer.findUnique({
      where: { id: offerId }
    });

    if (!offer) {
      throw new Error('Offer not found');
    }

    // Update the banner image
    await db.offer.update({
      where: { id: offerId },
      data: {
        bannerImage: bannerImageUrl,
      },
    });

    // Revalidate relevant paths
    revalidatePath('/dashboard/management-offer');
    revalidatePath(`/dashboard/management-offer/edit/${offerId}`);
    revalidatePath(`/dashboard/management-offer/manage/${offerId}`);
    revalidatePath('/');
    revalidateTag('offers');

    return { 
      success: true, 
      message: 'تم تحديث صورة البانر بنجاح' 
    };
  } catch (error) {
    console.error('Error updating offer banner:', error);
    throw new Error('Failed to update offer banner');
  }
} 