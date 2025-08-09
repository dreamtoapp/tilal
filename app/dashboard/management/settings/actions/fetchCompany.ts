'use server';
import db from '@/lib/prisma';
import { Company } from '@/types/databaseTypes';

export const fetchCompany = async (): Promise<Company | null> => {
  try {
    const data = await db.company.findFirst();
    if (!data) return null; // Return null if no company is found
    return {
      ...data,
    };
  } catch (error) {
    console.error('Error fetching company:', error);
    throw new Error('Failed to fetch company.');
  }
};
