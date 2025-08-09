'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';
import { OrderNotificationType } from '@/app/(e-comm)/(adminPage)/user/notifications/types/notificationTypes';

interface UpdateOrderStatusParams {
  orderId: string;
  newStatus: OrderStatus;
  notes?: string;
}

interface UpdateOrderStatusResult {
  success: boolean;
  message: string;
  data?: {
    orderId: string;
    oldStatus: string;
    newStatus: string;
    updatedAt: Date;
  };
  error?: string;
}

export async function updateOrderStatus({
  orderId,
  newStatus,
  notes
}: UpdateOrderStatusParams): Promise<UpdateOrderStatusResult> {
  try {
    // Validate inputs
    if (!orderId || !newStatus) {
      return {
        success: false,
        message: 'معرف الطلب والحالة الجديدة مطلوبان',
        error: 'MISSING_PARAMETERS'
      };
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        driver: true,
        customer: {
          select: { name: true, phone: true }
        }
      }
    });

    if (!order) {
      return {
        success: false,
        message: 'الطلب غير موجود',
        error: 'ORDER_NOT_FOUND'
      };
    }

    const oldStatus = order.status;

    // Validate status transition
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.ASSIGNED, OrderStatus.CANCELED],
      [OrderStatus.ASSIGNED]: [OrderStatus.IN_TRANSIT, OrderStatus.CANCELED],
      [OrderStatus.IN_TRANSIT]: [OrderStatus.DELIVERED, OrderStatus.CANCELED],
      [OrderStatus.DELIVERED]: [], // Final state
      [OrderStatus.CANCELED]: [], // Final state
    };

    const allowedTransitions = validTransitions[oldStatus] || [];
    if (!allowedTransitions.includes(newStatus)) {
      return {
        success: false,
        message: `لا يمكن تغيير الحالة من ${oldStatus} إلى ${newStatus}`,
        error: 'INVALID_STATUS_TRANSITION'
      };
    }

    // Special validation for IN_TRANSIT status
    if (newStatus === OrderStatus.IN_TRANSIT && !order.driverId) {
      return {
        success: false,
        message: 'لا يمكن بدء الرحلة بدون تعيين سائق',
        error: 'NO_DRIVER_ASSIGNED'
      };
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        ...(newStatus === OrderStatus.CANCELED && notes && { resonOfcancel: notes }),
        updatedAt: new Date(),
      }
    });

    // Send notifications based on status change
    try {
      const { createOrderNotification } = await import('@/app/(e-comm)/(adminPage)/user/notifications/actions/createOrderNotification');
      const { ORDER_NOTIFICATION_TEMPLATES } = await import('@/app/(e-comm)/(adminPage)/user/notifications/helpers/notificationTemplates');
      const { PushNotificationService } = await import('@/lib/push-notification-service');

      let template;
      let notificationType: OrderNotificationType;

      switch (newStatus) {
        case OrderStatus.IN_TRANSIT:
          template = ORDER_NOTIFICATION_TEMPLATES.TRIP_STARTED(order.orderNumber, order.driver?.name || '');
          notificationType = 'trip_started' as OrderNotificationType;
          break;
        case OrderStatus.DELIVERED:
          template = ORDER_NOTIFICATION_TEMPLATES.ORDER_DELIVERED(order.orderNumber);
          notificationType = 'order_delivered' as OrderNotificationType;
          break;
        case OrderStatus.CANCELED:
          template = ORDER_NOTIFICATION_TEMPLATES.ORDER_CANCELLED(order.orderNumber);
          notificationType = 'order_cancelled' as OrderNotificationType;
          break;
        default:
          return {
            success: true,
            message: `تم تحديث حالة الطلب إلى ${newStatus}`,
            data: {
              orderId: updatedOrder.id,
              oldStatus,
              newStatus,
              updatedAt: updatedOrder.updatedAt,
            }
          };
      }

      // Send in-app notification
      await createOrderNotification({
        userId: order.customerId,
        orderId: orderId,
        orderNumber: order.orderNumber,
        driverName: order.driver?.name || undefined,
        ...template
      });

      // Send push notification
      const pushNotificationType = notificationType === 'order_delivered' ? 'delivered' : 
                                  notificationType === 'trip_started' ? 'trip_started' : 
                                  'cancelled';
      
      await PushNotificationService.sendOrderNotification(
        order.customerId,
        orderId,
        order.orderNumber,
        pushNotificationType as any,
        order.driver?.name || undefined
      );

    } catch (error) {
      console.error('❌ [STATUS_UPDATE] Notification error:', error);
    }

    // Revalidate relevant pages
    revalidatePath('/dashboard/management-orders');
    revalidatePath(`/dashboard/management-orders/status/pending`);
    revalidatePath(`/dashboard/management-orders/status/in-way`);
    revalidatePath(`/dashboard/management-orders/status/delivered`);
    revalidatePath(`/dashboard/management-orders/status/canceled`);

    return {
      success: true,
      message: `تم تحديث حالة الطلب إلى ${newStatus}`,
      data: {
        orderId: updatedOrder.id,
        oldStatus,
        newStatus,
        updatedAt: updatedOrder.updatedAt,
      }
    };

  } catch (error) {
    console.error('Error updating order status:', error);
    
    return {
      success: false,
      message: 'حدث خطأ أثناء تحديث حالة الطلب',
      error: 'STATUS_UPDATE_FAILED'
    };
  }
} 