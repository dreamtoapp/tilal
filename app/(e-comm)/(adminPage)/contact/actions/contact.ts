'use server';
import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import db from '@/lib/prisma';
import { pusherServer } from '@/lib/pusherServer';
import { prevState } from '@/types/commonType';

// import { pusherServer } from '@/lib/pusherSetting';



export async function submitContactForm(
  _prevState: prevState,
  formData: FormData,
): Promise<prevState> {
  try {
    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const subject = formData.get('subject')?.toString() || '';
    const message = formData.get('message')?.toString() || '';

    if (!name || !email || !subject || !message) {
      return {
        success: false,
        message: 'جميع الحقول مطلوبة',
      };
    }

    await db.contactSubmission.create({
      data: { name, email, subject, message },
    });

    const session = await auth();

    const userId = session?.user.id || 'Guest';
    // إنشاء إشعار الطلب
    const notificationMessage = `رسالة جديدة  ${subject}`;
    const puserNotifactionmsg = {
      message: `رسالة جديدة  ${subject}`,
      type: 'contact',
    };
          // Save the notification to the database
      await db.userNotification.create({
        data: {
          title: 'رسالة تواصل جديدة',
          body: notificationMessage,
          type: 'INFO',
          read: false,
          userId: userId, // Associate the notification with the authenticated user
        },
      });
    // Get admin users
    const adminUsers = await db.user.findMany({
      where: {
        role: { in: ['ADMIN', 'MARKETER'] }
      },
      select: { id: true }
    });

    // Send to each admin's specific channel for dashboard feedback
    try {
      const pusherPromises = adminUsers.map(admin =>
        pusherServer.trigger(`admin-${admin.id}`, 'new-order', {
          message: notificationMessage,
          type: puserNotifactionmsg.type,
        })
      );
      
      await Promise.all(pusherPromises);
    } catch (error) {
      console.error('Pusher trigger failed:', error);
    }

    revalidatePath('/dashboard/contact');

    return {
      success: true,
      message: 'تم إرسال الرسالة بنجاح ',
    };
  } catch (error) {
    console.error('Submission error:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء الإرسال ',
    };
  }
}
