'use server';
import { revalidatePath } from 'next/cache';

import { ORDER_STATUS } from '@/constant/order-status';
import db from '@/lib/prisma';

export const approveDriverToOrder = async (orderId: string, driverId: string) => {
  // Check if the order exists
  const existingOrder = await db.order.findUnique({
    where: { orderNumber: orderId },
    include: { customer: true }
  });

  if (!existingOrder) {
    return { success: false, message: 'الطلبية غير موجودة' };
  }

  if (existingOrder.driverId) {
    return { success: false, message: 'الطلبية تحت مسئولية سائق اخر' }; //
  }

  // Get driver details for notification
  const driver = await db.user.findUnique({
    where: { id: driverId },
    select: { name: true }
  });

  await db.order.update({
    where: { id: existingOrder.id },
    data: {
      driverId: driverId,
      status: ORDER_STATUS.IN_TRANSIT,
    },
  });

  // Send notifications to customer
  try {
    console.log('🚀 Starting notification process for approved driver...');
    const { createOrderNotification } = await import('@/app/(e-comm)/(adminPage)/user/notifications/actions/createOrderNotification');
    const { ORDER_NOTIFICATION_TEMPLATES } = await import('@/app/(e-comm)/(adminPage)/user/notifications/types/notificationTypes');
    const { PushNotificationService } = await import('@/lib/push-notification-service');
    
    // Use the ORDER_SHIPPED template (since this is also a shipping event)
    const template = ORDER_NOTIFICATION_TEMPLATES.ORDER_SHIPPED(
      existingOrder.orderNumber,
      driver?.name || 'غير معروف'
    );
    
    // Create in-app notification (fallback)
    await createOrderNotification({
      userId: existingOrder.customerId,
      orderId: existingOrder.id,
      orderNumber: existingOrder.orderNumber,
      driverName: driver?.name || undefined,
      ...template
    });
    
    // Send push notification (order_shipped)
    await PushNotificationService.sendOrderNotification(
      existingOrder.customerId,
      existingOrder.id,
      existingOrder.orderNumber,
      'order_shipped',
      driver?.name || undefined
    );
    
    console.log(`✅ Order shipped notification sent for approved order ${existingOrder.orderNumber}`);
  } catch (error) {
    console.error('❌ Failed to send order shipped notifications:', error);
  }

  revalidatePath('/dashboard');
  return { success: true, message: 'تم اسناد العملية بنجاح' }; // Return success response with updated data
};
