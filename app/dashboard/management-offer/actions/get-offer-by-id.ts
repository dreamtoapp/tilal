'use server';

import db from '@/lib/prisma';

export async function getOfferById(id: string) {
  try {
    const offer = await db.offer.findUnique({
      where: { id },
      include: {
        productAssignments: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
                categoryAssignments: {
                  select: {
                    category: {
                      select: {
                        name: true
                      }
                    }
                  },
                  take: 1
                }
              }
            }
          }
        },
        _count: {
          select: {
            productAssignments: true
          }
        }
      }
    });

    if (!offer) {
      throw new Error('Offer not found');
    }

    return offer;
  } catch (error) {
    console.error('Error fetching offer:', error);
    throw new Error('Failed to fetch offer');
  }
} 