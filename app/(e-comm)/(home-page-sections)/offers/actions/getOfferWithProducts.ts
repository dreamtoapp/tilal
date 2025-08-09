import db from '@/lib/prisma';

export async function getOfferWithProducts(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const offer = await db.offer.findUnique({
    where: { slug: decodedSlug },
    include: {
      productAssignments: {
        include: { product: true },
      },
    },
  });
  if (!offer) return null;
  const products = offer.productAssignments.map((op: any) => op.product);
  return { offer, products };
} 