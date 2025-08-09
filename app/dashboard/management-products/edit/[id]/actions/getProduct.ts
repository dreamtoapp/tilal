'use server';

import db from '@/lib/prisma';

export async function getProduct(id: string) {
    try {
        const product = await db.product.findUnique({
            where: { id },
            include: {
                supplier: true,
                categoryAssignments: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        return product;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw new Error('فشل في جلب بيانات المنتج');
    }
} 