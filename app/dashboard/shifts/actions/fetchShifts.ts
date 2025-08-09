'use server';
import db from '@/lib/prisma';
import { Shift } from '@/types/databaseTypes';

export async function fetchShifts(): Promise<Partial<Shift>[]> {
  try {
    const shifts = await db.shift.findMany({
      select: {
        id: true,
        startTime: true,
        endTime: true,
        // omit fields like name, createdAt, updatedAt, etc.
      },
    });
    return shifts;
  } catch (error) {
    console.error('Error fetching shifts:', error);
    throw new Error('Failed to fetch shifts.');
  }
}
