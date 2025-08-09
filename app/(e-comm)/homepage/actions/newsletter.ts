'use server';

import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import db from '@/lib/prisma';
import { pusherServer } from '@/lib/pusherServer';
// import { pusherServer } from '@/lib/pusherSetting';
import { checkNewsletterExists, addNewsletter } from '@/helpers/newsletterHelpers';

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email') as string;

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'يرجى إدخال بريد إلكتروني صحيح.' };
  }

  try {
    // Check if email already exists
    const existingEmail = await checkNewsletterExists(email);
    if (existingEmail) {
      return { error: 'هذا البريد الإلكتروني مسجل بالفعل.' };
    }
    // Save email to the database
    await addNewsletter(email);

    const session = await auth();

    const userId = session?.user.id || 'Guest';
    // إنشاء إشعار الطلب
    const notificationMessage = `مشترك جديدة   `;
    const puserNotifactionmsg = {
      message: `مشترك جديدة   `,
      type: 'news',
    };
          // Save the notification to the database
      await db.userNotification.create({
        data: {
          title: 'اشتراك في النشرة الإخبارية',
          body: notificationMessage,
          type: 'INFO',
          read: false,
          userId: userId, // Associate the notification with the authenticated user
        },
      });
    // إرسال الإشعار عبر Pusher
    await pusherServer.trigger('admin', 'new-order', {
      message: notificationMessage, // Send the message as a string
      type: puserNotifactionmsg.type, // Include the type explicitly
    });

    revalidatePath('/'); // Revalidate the page if needed
    return { message: 'تم التسجيل بنجاح!' };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return { error: 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.' };
  }
}
