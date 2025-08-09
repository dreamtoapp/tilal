'use server';

import db from '@/lib/prisma';

// Use the Prisma generated types
import { Offer as PrismaOffer, Product as PrismaProduct } from '@prisma/client';

export type Offer = PrismaOffer & {
  _count?: {
    productAssignments: number;
  };
  productAssignments?: Array<{
    product: Pick<PrismaProduct, 'id' | 'name' | 'images' | 'price'>;
  }>;
};

export async function getOffers(): Promise<Offer[]> {
  try {
    const offers = await db.offer.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        _count: {
          select: { productAssignments: true }
        }
      }
    });

    return offers;
  } catch (error) {
    console.error('Error fetching offers:', error);
    throw new Error('Failed to fetch offers.');
  }
}

export async function getActiveOffers(): Promise<Offer[]> {
  try {
    const offers = await db.offer.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        _count: {
          select: { productAssignments: true }
        },
        productAssignments: {
          select: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true
              }
            }
          },
          take: 4 // Limit for preview
        }
      }
    });

    return offers;
  } catch (error) {
    console.error('Error fetching active offers:', error);
    throw new Error('Failed to fetch active offers.');
  }
}

 