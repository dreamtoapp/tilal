'use server';

import prisma from '@/lib/prisma';

/**
 * Fetches all categories with product counts (only published products)
 * @returns An array of categories with product counts
 */
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        productAssignments: {
          include: {
            product: {
              select: { published: true }
            }
          }
        }
      },
    });

    // Transform the categories to include only published product count
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      slug: category.slug,
      imageUrl: category.imageUrl,
      productCount: category.productAssignments.filter(pa => pa.product?.published).length
    }));

    return transformedCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
} 