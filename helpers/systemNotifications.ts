import db from '@/lib/prisma';

interface SystemNotificationParams {
  userId: string;
  title: string;
  body: string;
  actionUrl?: string;
}

export const SYSTEM_NOTIFICATIONS = {
  WELCOME: {
    title: 'مرحباً بك في متجرنا! 🎉',
    body: 'شكراً لتسجيلك معنا. يمكنك الآن تصفح المنتجات وطلب ما تريد.'
  },
  ADD_ADDRESS: {
    title: 'أضف عنوانك الأول 📍',
    body: 'أضف عنوانك لتسهيل عملية التوصيل والحصول على أفضل تجربة تسوق.'
  },
  ACTIVATE_ACCOUNT: {
    title: 'تفعيل حسابك 🔐',
    body: 'يرجى تفعيل حسابك عبر رمز التحقق المرسل إلى هاتفك.'
  }
};

/**
 * Creates a system notification for user onboarding and general system messages
 */
export async function createSystemNotification({
  userId,
  title,
  body,
  actionUrl
}: SystemNotificationParams) {
  try {
    // Create notification in database
    const notification = await db.userNotification.create({
      data: {
        userId,
        title,
        body,
        type: 'SYSTEM',
        read: false,
        actionUrl: actionUrl || '/'
      }
    });

    console.log(`📱 System notification created for user ${userId}: ${title}`);

    return { success: true, notification };
  } catch (error) {
    console.error('Error creating system notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create system notification'
    };
  }
} 