import webpush from 'web-push';
import { VAPID_CONFIG, validateVapidConfig } from './vapid-config';
import db from './prisma';
import { debug, error, info } from '@/utils/logger';

// Initialize web-push with VAPID keys
validateVapidConfig();
webpush.setVapidDetails(
  VAPID_CONFIG.subject,
  VAPID_CONFIG.publicKey!,
  VAPID_CONFIG.privateKey!
);

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
  requireInteraction?: boolean;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export type OrderNotificationType =
  | 'order_shipped'
  | 'driver_assigned'
  | 'trip_started'
  | 'delivered'
  | 'cancelled';

export class PushNotificationService {
  /**
   * Send push notification to a single user
   */
  static async sendToUser(userId: string, payload: PushNotificationPayload): Promise<boolean> {
    try {
      // Get user's push subscription
      const subscription = await db.pushSubscription.findUnique({
        where: { id: userId }
      });

      if (!subscription) {
        debug(`No push subscription found for user ${userId}`);
        return false;
      }

      // Prepare subscription object for web-push
      const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth
        }
      };

      // Send push notification
      await webpush.sendNotification(
        pushSubscription,
        JSON.stringify(payload)
      );

      info(`Push notification sent to user ${userId}: ${payload.title}`);
      return true;
    } catch (pushError) {
      error(`Failed to send push notification to user ${userId}:`, pushError instanceof Error ? pushError.message : 'Unknown error');

      // If subscription is invalid, remove it
      if (error instanceof Error && error.message.includes('410')) {
        await db.pushSubscription.delete({
          where: { id: userId }
        });
        debug(`Removed invalid subscription for user ${userId}`);
      }

      return false;
    }
  }

  /**
   * Send push notification to multiple users
   */
  static async sendToUsers(userIds: string[], payload: PushNotificationPayload): Promise<{
    success: string[];
    failed: string[];
  }> {
    const results = await Promise.allSettled(
      userIds.map(userId => this.sendToUser(userId, payload))
    );

    const success: string[] = [];
    const failed: string[] = [];

    results.forEach((result, index) => {
      const userId = userIds[index];
      if (result.status === 'fulfilled' && result.value) {
        success.push(userId);
      } else {
        failed.push(userId);
      }
    });

    debug(`Batch push notification results: ${success.length} success, ${failed.length} failed`);
    return { success, failed };
  }

  /**
   * Send order-specific notification
   */
  static async sendOrderNotification(
    userId: string,
    orderId: string,
    orderNumber: string,
    type: OrderNotificationType,
    driverName?: string
  ): Promise<boolean> {
    const templates = {
      order_shipped: {
        title: '🚚 تم شحن طلبك',
        body: `طلبك رقم ${orderNumber} تم شحنه بنجاح!${driverName ? ` السائق ${driverName} سيقوم بالتوصيل.` : ''}`,
        tag: `order-${orderId}-shipped`,
        data: { orderId, orderNumber, type, driverName }
      },
      driver_assigned: {
        title: 'تم تعيين سائق للتوصيل 🚗',
        body: `تم تعيين السائق ${driverName || 'غير معروف'} لتوصيل طلبك ${orderNumber}. سيبدأ التوصيل قريباً.`,
        tag: `order-${orderId}-assigned`,
        data: { orderId, orderNumber, type, driverName }
      },
      trip_started: {
        title: 'بدأ السائق في التوجه إليك 🚗',
        body: `السائق ${driverName || 'غير معروف'} بدأ رحلة توصيل طلبك ${orderNumber}. سيصل إليك قريباً!`,
        tag: `order-${orderId}-trip`,
        data: { orderId, orderNumber, type, driverName }
      },
      delivered: {
        title: 'تم توصيل طلبك بنجاح ✅',
        body: `تم توصيل طلبك ${orderNumber} بنجاح. شكراً لاختيارك متجرنا!`,
        tag: `order-${orderId}-delivered`,
        data: { orderId, orderNumber, type }
      },
      cancelled: {
        title: 'تم إلغاء طلبك',
        body: `تم إلغاء طلبك ${orderNumber}. سيتم استرداد المبلغ إلى محفظتك.`,
        tag: `order-${orderId}-cancelled`,
        data: { orderId, orderNumber, type }
      }
    };

    const template = templates[type];
    if (!template) {
      error(`Unknown order notification type: ${type}`);
      return false;
    }

    const payload: PushNotificationPayload = {
      ...template,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      requireInteraction: type === 'driver_assigned' || type === 'trip_started',
      actions: [
        {
          action: 'view_order',
          title: 'عرض الطلب',
          icon: '/icons/icon-192x192.png'
        },
        {
          action: 'close',
          title: 'إغلاق'
        }
      ]
    };

    return this.sendToUser(userId, payload);
  }

  /**
   * Clean up invalid subscriptions
   */
  static async cleanupInvalidSubscriptions(): Promise<number> {
    try {
      const subscriptions = await db.pushSubscription.findMany();
      let removedCount = 0;

      for (const subscription of subscriptions) {
        try {
          const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth
            }
          };

          // Send a test notification to check if subscription is valid
          await webpush.sendNotification(pushSubscription, JSON.stringify({
            title: 'Test',
            body: 'Test notification'
          }));
        } catch (subscriptionError) {
          // If subscription is invalid, remove it
          if (subscriptionError instanceof Error && subscriptionError.message.includes('410')) {
            await db.pushSubscription.delete({
              where: { id: subscription.id }
            });
            removedCount++;
            debug(`Removed invalid subscription for user ${subscription.userId}`);
          }
        }
      }

      info(`Cleanup complete: removed ${removedCount} invalid subscriptions`);
      return removedCount;
    } catch (cleanupError) {
      error('Error during subscription cleanup:', cleanupError instanceof Error ? cleanupError.message : 'Unknown error');
      return 0;
    }
  }
} 