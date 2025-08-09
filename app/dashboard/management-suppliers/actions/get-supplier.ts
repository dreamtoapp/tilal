'use server';
import db from '@/lib/prisma';
import { supplierIncludeRelation } from '@/types/databaseTypes';

export async function getSuppliers() {
  try {
    const suppliers = await db.supplier.findMany({
      include: supplierIncludeRelation,
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
