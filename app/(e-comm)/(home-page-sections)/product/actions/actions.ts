'use server';

import db from '@/lib/prisma';

/**
 * Get product details by slug
 */
export async function getProductBySlug(slug: string) {
  console.log('slug', slug);

  try {
    // Decode the URL-encoded slug
    const decodedSlug = decodeURIComponent(slug);

    // First try with the decoded slug
    let product = await db.product.findUnique({
      where: { slug: decodedSlug },
      include: {
        supplier: true,
        reviews: true,
      },
    });

    // If not found, try with the original slug
    if (!product) {
      product = await db.product.findUnique({
        where: { slug: decodedSlug },
        include: {
          supplier: true,
          reviews: true,
        },
      });
    }

    // If still not found, try to find similar products for debugging
    if (!product) {
      await db.product.findMany({
        where: {
          OR: [
            { slug: { contains: decodedSlug.split('-')[0] } },
            { name: { contains: decodedSlug.split('-')[0] } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        take: 5,
      });
    }

    // Add the derived inStock field if product is found
    return product ? { ...product, inStock: !product.outOfStock } : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Get product reviews
 */
export async function getProductReviews(productId: string) {
  try {
    const reviews = await db.review.findMany({
      where: {
        productId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return [];
  }
}


