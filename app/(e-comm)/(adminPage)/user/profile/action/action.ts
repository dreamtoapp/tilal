'use server';
import db from '@/lib/prisma';

export async function userProfile(id: string) {
  try {
    const userData = await db.user.findFirst({
      where: { id },
    });
    return userData;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}
