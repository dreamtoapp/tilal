// Notification DB utility for Alerts Page
import db from '@/lib/prisma';
import { NotificationType } from '@prisma/client';

export async function getAllNotifications({ userId, type }: { userId: string; type?: string }) {
  return db.userNotification.findMany({
    where: {
      userId,
      ...(type ? { type: type as NotificationType } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function markAllNotificationsRead({
  userId,
  type,
}: {
  userId: string;
  type?: string;
}) {
  await db.userNotification.updateMany({
    where: {
      userId,
      ...(type ? { type: type as NotificationType } : {}),
      read: false,
    },
    data: { read: true },
  });
}
