// actions/shiftActions.ts
'use server';
import db from '@/lib/prisma';

export async function getAvailableShifts() {
  try {
    return await db.shift.findMany({
      select: { id: true, startTime: true, endTime: true },
      orderBy: { startTime: 'asc' },
    });
  } catch (error) {
    console.error('Shift fetch error:', error);
    return [];
  }
}
