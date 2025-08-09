"use server";

import db from '@/lib/prisma';

// Fetches the latest alerts/notifications for a user (for NotificationDropdown, etc.)
// Returns up to `limit` records, ordered by newest first.

export interface UserAlert {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string | null;
}

/**
 * Get recent alerts for a user.
 * @param userId User's ID (required)
 * @param limit  Max records to return (default 20)
 */
export async function getUserAlerts(userId: string, limit = 20): Promise<UserAlert[]> {
  if (!userId) return [];
  const alerts = await db.userNotification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      body: true,
      type: true,
      read: true,
      createdAt: true,
      actionUrl: true,
    },
  });
  return alerts as UserAlert[];
} 