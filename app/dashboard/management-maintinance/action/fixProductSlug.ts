'use server';
import { revalidatePath } from 'next/cache';

import db from '@/lib/prisma';
import { Slugify } from '@/utils/slug';

export async function fixProductSlugs() {
  try {
    // Fetch all products from the database
    const products = await db.product.findMany();

    // Loop through each product and update the slug field
    for (const product of products) {
      const newSlug = Slugify(product.name);

      // Update the product's slug if it differs from the current slug
      if (product.slug !== newSlug) {
        await db.product.update({
          where: { id: product.id },
          data: { slug: newSlug },
        });
      }
    }
    revalidatePath('/'); // Revalidate the homepage or any specific path
  } catch (error) {
    console.error('Error updating product slugs:', error);
    throw new Error('Failed to update product slugs.');
  }
}
