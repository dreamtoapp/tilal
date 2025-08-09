import { createOrderNotification } from '@/app/(e-comm)/(adminPage)/user/notifications/actions/createOrderNotification';
import { ORDER_NOTIFICATION_TEMPLATES } from '@/app/(e-comm)/(adminPage)/user/notifications/types/notificationTypes';
import { PushNotificationService } from '@/lib/push-notification-service';
import { OrderNotificationType } from '@/app/(e-comm)/(adminPage)/user/notifications/types/notificationTypes';
import { debug, error } from '@/utils/logger';

interface NotificationData {
  userId: string;
  orderId: string;
  orderNumber: string;
  driverName?: string;
  notificationType: OrderNotificationType;
}

interface NotificationResult {
  success: boolean;
  inAppSuccess: boolean;
  pushSuccess: boolean;
  error?: string;
  details?: {
    inAppResult?: any;
    pushResult?: boolean;
  };
}

/**
 * Stable, reusable notification helper
 * This function handles both in-app and push notifications with proper error handling
 */
export async function sendOrderNotification(data: NotificationData): Promise<NotificationResult> {
  const { userId, orderId, orderNumber, driverName, notificationType } = data;

  debug('Starting notification process...');
  debug('Notification details:', {
    userId,
    orderId,
    orderNumber,
    driverName,
    notificationType
  });

  let inAppSuccess = false;
  let pushSuccess = false;
  let inAppResult: any = null;
  let pushResult: boolean = false;
  let errorMessage: string | undefined;

  try {
    // Step 1: Create template based on notification type
    let template;
    switch (notificationType) {
      case 'order_shipped':
        template = ORDER_NOTIFICATION_TEMPLATES.ORDER_SHIPPED(orderNumber, driverName);
        break;
      case 'trip_started':
        template = ORDER_NOTIFICATION_TEMPLATES.TRIP_STARTED?.(orderNumber, driverName) || {
          title: '🚗 بدأ السائق رحلته',
          body: `السائق ${driverName || 'غير معروف'} بدأ توصيل طلبك رقم ${orderNumber}`
        };
        break;
      case 'order_delivered':
        template = ORDER_NOTIFICATION_TEMPLATES.ORDER_DELIVERED?.(orderNumber) || {
          title: '✅ تم توصيل طلبك',
          body: `تم توصيل طلبك رقم ${orderNumber} بنجاح!`
        };
        break;
      default:
        throw new Error(`Unknown notification type: ${notificationType}`);
    }

    debug('Template created:', template);

    // Step 2: Send in-app notification (fallback)
    debug('Creating in-app notification...');
    try {
      inAppResult = await createOrderNotification({
        userId,
        orderId,
        orderNumber,
        driverName,
        ...template
      });

      inAppSuccess = inAppResult.success;
      debug('In-app notification result:', inAppResult);
    } catch (inAppError) {
      error('In-app notification failed:', inAppError instanceof Error ? inAppError.message : String(inAppError));
      inAppSuccess = false;
    }

    // Step 3: Send push notification
    debug('Sending push notification...');
    try {
      // Map notification type to push service type
      const pushNotificationType = notificationType === 'order_delivered' ? 'delivered' : notificationType;

      pushResult = await PushNotificationService.sendOrderNotification(
        userId,
        orderId,
        orderNumber,
        pushNotificationType as any,
        driverName
      );

      pushSuccess = pushResult;
      debug('Push notification result:', pushResult);
    } catch (pushError) {
      error('Push notification failed:', pushError instanceof Error ? pushError.message : String(pushError));
      pushSuccess = false;
    }

    // Step 4: Determine overall success
    const overallSuccess = inAppSuccess || pushSuccess; // Success if at least one works

    if (overallSuccess) {
      debug(`Notification sent successfully for ${notificationType}`);
    } else {
      errorMessage = 'Both in-app and push notifications failed';
      error('All notification methods failed');
    }

    return {
      success: overallSuccess,
      inAppSuccess,
      pushSuccess,
      error: errorMessage,
      details: {
        inAppResult,
        pushResult
      }
    };

  } catch (mainError) {
    error('Critical error in notification process:', mainError instanceof Error ? mainError.message : String(mainError));
    return {
      success: false,
      inAppSuccess: false,
      pushSuccess: false,
      error: mainError instanceof Error ? mainError.message : 'Unknown error',
      details: {
        inAppResult,
        pushResult
      }
    };
  }
}

/**
 * Quick test function to verify notification system is working
 */
export async function testNotificationSystem(userId: string): Promise<NotificationResult> {
  debug('Testing notification system...');

  return await sendOrderNotification({
    userId,
    orderId: 'test-order-id',
    orderNumber: 'TEST-NOTIFICATION',
    driverName: 'Test Driver',
    notificationType: 'order_shipped'
  });
} 