'use server';
import db from '@/lib/prisma';
import { Shift } from '@/types/databaseTypes';

export async function createShift(data: Partial<Shift>): Promise<Shift> {
  try {
    const shift = await db.shift.create({
      data: {
        name: data.name!,
        startTime: data.startTime!,
        endTime: data.endTime!,
      },
    });
    return shift;
  } catch (error) {
    console.error('Error creating shift:', error);
    throw new Error('Failed to create shift.');
  }
}
