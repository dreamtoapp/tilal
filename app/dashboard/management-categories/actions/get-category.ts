'use server';
import db from '@/lib/prisma';
import { categoryIncludeRelation } from '@/types/databaseTypes';

export async function getCategories() {
  try {
    const suppliers = await db.category.findMany({
      include: categoryIncludeRelation,
      orderBy: {
        createdAt: 'desc', // Optional: order by creation date
      }
    });


    return suppliers
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw new Error('Failed to fetch suppliers.');
  }
}
