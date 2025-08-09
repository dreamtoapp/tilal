'use server';

import { revalidatePath } from 'next/cache';
import { sendEmail } from '../helper/sendMails';

export async function sendBulkEmail(formData: FormData) {
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;
  const selectedEmails = formData.getAll('selectedEmails') as string[];

  if (!subject || !message) {
    return { error: 'العنوان والرسالة مطلوبان' };
  }

  if (selectedEmails.length === 0) {
    return { error: 'يرجى اختيار مستلم واحد على الأقل' };
  }

  try {
    for (const email of selectedEmails) {
      await sendEmail(email, subject, message); // Send email to each selected recipient
    }
    return { success: 'تم إرسال البريد الإلكتروني بنجاح' };
  } catch {
    return { error: 'فشل في إرسال البريد الإلكتروني' };
  } finally {
    revalidatePath('/dashboard');
  }
}
export async function sendIndividualEmail(email: string, subject: string, message: string) {
  try {
    await sendEmail(email, subject, message); // Pass dynamic subject and message
    return { success: `تم إرسال البريد الإلكتروني إلى ${email}` };
  } catch {
    return { error: `فشل في إرسال البريد الإلكتروني إلى ${email}` };
  }
}
