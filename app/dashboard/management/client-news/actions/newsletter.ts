'use server';

import { revalidatePath } from 'next/cache';
 
import { NewLetter } from '@/types/databaseTypes';
import db from '@/lib/prisma';

// Fetch all subscribers
export async function fetchSubscribers(): Promise<NewLetter[]> {
  return await db.newLetter.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

// Delete a subscriber
export async function deleteSubscriber(id: string): Promise<{ success?: string; error?: string }> {
  try {
    await db.newLetter.delete({
      where: { id },
    });
    revalidatePath('/dashboard'); // Revalidate the page to reflect changes
    return { success: 'Subscriber deleted successfully' };
  } catch {
    return { error: 'Failed to delete subscriber' };
  }
}
