'use server';

import db from '@/lib/prisma';

// Use the Prisma generated types
import { Offer as PrismaOffer } from '@prisma/client';

export type Offer = PrismaOffer & {
  _count?: {
    productAssignments: number;
  };
};

export async function getOffers(): Promise<Offer[]> {
  try {
    const offers = await db.offer.findMany({
      where: {
        isActive: true // Only show active offers to customers
      },
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
    return []; // Return empty array instead of throwing for customer-facing page
  }
} 