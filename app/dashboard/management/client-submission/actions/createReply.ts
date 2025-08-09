'use server';
import db from '../../../../../lib/prisma';
import nodemailer from 'nodemailer';

export async function createReplyAction(formData: FormData) {
  const submissionId = formData.get('submissionId') as string;
  const content = formData.get('content') as string;
  if (!submissionId || !content) {
    return { success: false, error: 'Submission ID and content are required.' };
  }
  try {
    // Create reply in DB
    const reply = await db.reply.create({
      data: {
        content,
        contactSubmission: { connect: { id: submissionId } },
      },
      include: { contactSubmission: true },
    });

    // Send email to client
    const { email, name, subject, message } = reply.contactSubmission;
    // TODO: Replace with your real SMTP config
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'user@example.com',
        pass: process.env.SMTP_PASS || 'password',
      },
    });
    const mailOptions = {
      from: process.env.SMTP_FROM || 'support@online-shop.com',
      to: email,
      subject: `رد على استفسارك: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
          <div style="background: #4f46e5; color: #fff; padding: 16px 24px;">
            <h2 style="margin: 0;">رد من فريق الدعم - Online Shop</h2>
          </div>
          <div style="padding: 24px; background: #fafbfc;">
            <p>مرحباً <b>${name}</b>,</p>
            <p>شكراً لتواصلك معنا بخصوص: <b>${subject}</b></p>
            <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;" />
            <p style="color: #555;">رسالتك الأصلية:</p>
            <blockquote style="background: #f1f5f9; padding: 12px 16px; border-radius: 6px; color: #333;">${message}</blockquote>
            <p style="color: #555; margin-top: 24px;">ردنا عليك:</p>
            <blockquote style="background: #e0f7fa; padding: 12px 16px; border-radius: 6px; color: #222;">${content}</blockquote>
            <p style="margin-top: 32px; color: #888; font-size: 13px;">إذا كان لديك أي استفسار آخر، لا تتردد في الرد على هذا البريد.</p>
          </div>
          <div style="background: #f1f5f9; color: #4f46e5; text-align: center; padding: 12px 0; font-size: 14px;">Online Shop &copy; ${new Date().getFullYear()}</div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);

    return { success: true, reply };
  } catch (error) {
    console.error('Error creating reply or sending email:', error);
    return { success: false, error: 'Failed to create reply or send email.' };
  }
} 