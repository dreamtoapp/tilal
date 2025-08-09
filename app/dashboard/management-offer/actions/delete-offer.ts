'use server';

import { revalidatePath } from 'next/cache';
import { revalidateTag } from 'next/cache';
import db from '@/lib/prisma';

export async function deleteOffer(offerId: string) {
  try {
    // Check if offer exists
    const offer = await db.offer.findUnique({
      where: { id: offerId },
      include: {
        _count: {
          select: { productAssignments: true }
        }
      }
    });

    if (!offer) {
      throw new Error('Offer not found');
    }

    // If offer has product assignments, they will be deleted automatically via onDelete: Cascade
    // No manual cleanup needed due to the cascade delete in the schema

    // Delete the offer
    await db.offer.delete({
      where: { id: offerId },
    });
    revalidateTag('offers');

    // Revalidate relevant paths
    revalidatePath('/dashboard/management-offer');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error deleting offer:', error);
    throw new Error('Failed to delete offer.');
  }
} 