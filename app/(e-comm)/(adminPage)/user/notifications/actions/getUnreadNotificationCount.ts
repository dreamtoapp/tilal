"use server";
import db from '@/lib/prisma';

export async function getUnreadNotificationCount(userId: string) {
  try {
    return await db.userNotification.count({
      where: { userId, read: false },
    });
  } catch (error) {
    // Optionally log error or handle as needed
    return 0;
  }
}