// app/dashboard/shifts/actions/actions.ts
'use server';

import db from '../../../../lib/prisma';

// Delete a shift
export async function deleteShift(id: string): Promise<void> {
  try {
    await db.shift.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting shift:', error);
    throw new Error('Failed to delete shift.');
  }
}
