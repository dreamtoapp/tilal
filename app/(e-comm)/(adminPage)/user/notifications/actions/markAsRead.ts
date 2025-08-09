"use server";
import db from '@/lib/prisma';
import { auth } from '@/auth';

export async function markNotificationAsRead(notificationId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }

    const notification = await db.userNotification.update({
      where: { 
        id: notificationId,
        userId: session.user.id // Ensure user can only mark their own notifications
      },
      data: { read: true },
    });

    console.log(`✅ Marked notification ${notificationId} as read`);
    return { success: true, notification };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to mark as read' 
    };
  }
}

// 🔄 Toggle notification read status
export async function toggleNotificationRead(notificationId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }

    // First get the current state
    const currentNotification = await db.userNotification.findFirst({
      where: { 
        id: notificationId,
        userId: session.user.id
      }
    });

    if (!currentNotification) {
      throw new Error('Notification not found');
    }

    // Toggle the read status
    const notification = await db.userNotification.update({
      where: { 
        id: notificationId,
        userId: session.user.id
      },
      data: { read: !currentNotification.read },
    });

    console.log(`🔄 Toggled notification ${notificationId} to ${notification.read ? 'read' : 'unread'}`);
    
    return { success: true, notification, wasRead: currentNotification.read };
  } catch (error) {
    console.error('Error toggling notification read status:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to toggle read status' 
    };
  }
}

export async function handleMarkAsRead(id: string) {
  try {
    const result = await markNotificationAsRead(id);
    if (result.success) {
      console.log(`✅ Notification ${id} marked as read successfully`);
      return true;
    } else {
      console.error(`❌ Failed to mark notification ${id} as read:`, result.error);
      return false;
    }
  } catch (error) {
    console.error('Error in handleMarkAsRead:', error);
    return false;
  }
}

export async function markAllAsRead(userId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) {
      throw new Error('User not authenticated or unauthorized');
    }

    const result = await db.userNotification.updateMany({
      where: { 
        userId: userId,
        read: false 
      },
      data: { read: true },
    });

    console.log(`✅ Marked ${result.count} notifications as read for user ${userId}`);
    return { success: true, count: result.count };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to mark all as read' 
    };
  }
} 

/**
 * Get real user notifications from database (replaces mock data)
 */
export async function getRealUserNotifications(userId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) {
      throw new Error('User not authenticated or unauthorized');
    }

    const notifications = await db.userNotification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to latest 50 notifications
    });

    console.log(`📱 Retrieved ${notifications.length} real notifications for user ${userId}`);
    return notifications;
  } catch (error) {
    console.error('Error fetching real notifications:', error);
    return [];
  }
} 