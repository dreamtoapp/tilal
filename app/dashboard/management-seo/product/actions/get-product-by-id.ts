// Fetch a single product by ID
import db from '@/lib/prisma'; // Use your custom db wrapper

export async function getProductById(id: string) {
  return db.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      images: true,
      imageUrl: true,
      productCode: true,
      price: true,
      compareAtPrice: true,
      costPrice: true,
      size: true,
      details: true,
      brand: true,
      color: true,
      dimensions: true,
      weight: true,
      features: true,
      requiresShipping: true,
      shippingDays: true,
      returnPeriodDays: true,
      hasQualityGuarantee: true,
      careInstructions: true,
      published: true,
      outOfStock: true,
      manageInventory: true,
      stockQuantity: true,
      rating: true,
      reviewCount: true,
      tags: true,
      slug: true,
      gtin: true,
      supplier: { select: { name: true } },
      reviews: {
        take: 3,
        select: {
          rating: true,
          comment: true,
        },
      },
    },
  });
}
