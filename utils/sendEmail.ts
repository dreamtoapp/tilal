// app/utils/sendEmail.ts
'use server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: body,
  };

  await transporter.sendMail(mailOptions);
}
