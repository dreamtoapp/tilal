"use server";
import db from '@/lib/prisma';

export async function getUserNotifications(userId: string) {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  try {
    // 🔔 Fetch REAL notifications from database
    const dbNotifications = await db.userNotification.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Convert database format to UI format
    const notifications = dbNotifications.map(notif => ({
      id: notif.id,
      title: notif.title,
      body: notif.body,
      type: notif.type as 'ORDER' | 'PROMO' | 'SYSTEM',
      read: notif.read,
      createdAt: notif.createdAt.toISOString(),
      actionUrl: notif.actionUrl || undefined
    }));

    // 📝 If no real notifications exist, return some sample data for demo
    if (notifications.length === 0) {
      return [
        {
          id: 'demo-1',
          title: 'لا توجد إشعارات حالياً',
          body: 'ستظهر إشعاراتك هنا عند توفرها. سجل دخولك بانتظام للحصول على آخر التحديثات.',
          type: 'SYSTEM' as const,
          read: false,
          createdAt: new Date().toISOString(),
          actionUrl: undefined
        }
      ];
    }

    return notifications;

  } catch (error) {
    console.error('Error fetching notifications:', error);
    
    // Return fallback data in case of error
    return [
      {
        id: 'error-1',
        title: 'خطأ في تحميل الإشعارات',
        body: 'حدث خطأ أثناء تحميل إشعاراتك. يرجى تحديث الصفحة أو المحاولة لاحقاً.',
        type: 'SYSTEM' as const,
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: undefined
      }
    ];
  }
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  return db.userNotification.count({
    where: {
      userId,
      read: false,
    },
  });
} 