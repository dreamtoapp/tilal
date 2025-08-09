'use server';

import { revalidatePath } from 'next/cache';
import { revalidateTag } from 'next/cache';

import db from '@/lib/prisma';
import { Slugify } from '@/utils/slug';

export async function fixSupplierSlugs() {
  try {
    // Fetch all suppliers from the database
    const suppliers = await db.supplier.findMany();

    // Loop through each supplier and update the slug field
    for (const supplier of suppliers) {
      const newSlug = Slugify(supplier.name);

      // Update the supplier's slug if it differs from the current slug
      if (supplier.slug !== newSlug) {
        await db.supplier.update({
          where: { id: supplier.id },
          data: { slug: newSlug },
        });
        revalidateTag('suppliers');
      }
    }
    revalidatePath('/');
  } catch (error) {
    console.error('Error updating supplier slugs:', error);
    throw new Error('Failed to update supplier slugs.');
  }
}
