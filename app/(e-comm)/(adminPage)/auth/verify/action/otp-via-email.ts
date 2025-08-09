'use server';
import { createTransport } from 'nodemailer';

import { generateOTP } from '@/lib/otp-Generator';
import db from '@/lib/prisma';

// Generate OTP token with expiration (6 digits, 10 minutes)

// Email transporter configuration
const transporter = createTransport({
  // host: process.env.EMAIL_HOST,
  // port: Number(process.env.EMAIL_PORT),

  // secure: true, // true for 465, false for other ports
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email template function
const createOTPEmailTemplate = (otp: string, recipientName?: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Verification Code</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
        .content { padding: 30px; background-color: #ffffff; }
        .otp-code { 
            font-size: 24px; 
            letter-spacing: 3px; 
            padding: 15px 20px; 
            background-color: #f8f9fa; 
            display: inline-block;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer { 
            margin-top: 30px; 
            padding: 20px; 
            background-color: #f8f9fa; 
            text-align: center; 
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>${process.env.APP_NAME || 'Your App Name'}</h2>
        </div>
        
        <div class="content">
            <h3>Hello ${recipientName || 'User'},</h3>
            <p>Your verification code is:</p>
            <div class="otp-code">${otp}</div>
            <p>This code will expire in 10 minutes. If you didn't request this code, please ignore this email.</p>
        </div>

        <div class="footer">
            <p>© ${new Date().getFullYear()} ${process.env.APP_NAME || 'Your App Name'}. All rights reserved.</p>
            <p>Need help? <a href="${process.env.APP_URL}/contact">Contact support</a></p>
        </div>
    </div>
</body>
</html>
`;

// Helper function to send email
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: `"${process.env.EMAIL_SENDER_NAME}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false };
  }
};

// OTP via email handler
export const otpViaEmail = async (email: string) => {
  try {
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, message: 'Invalid email address' };
    }

    // Generate OTP
    const { token, expires } = generateOTP();

    const emailResult = await sendEmail(
      email,
      `Your Verification Code - ${process.env.APP_NAME || ''}`,
      createOTPEmailTemplate(token),
    );

    if (!emailResult.success) {
      return { success: false, message: 'Failed to send verification email' };
    }
    await addOtpToDatabase(email, token);
    return { success: true, message: 'Verification email sent', token, expires };
  } catch (error) {
    console.error('Error in otpViaEmail:', error);
    return { success: false, message: 'Internal server error' };
  }
};

const addOtpToDatabase = async (email: string, token: string) => {
  const userId = await db.user.findFirst({
    where: { email },
    select: { id: true },
  });

  await db.user.update({
    where: { id: userId?.id },
    data: { isOtp: false, otpCode: token },
  });
};

export const verifyTheUser = async (email: string, code?: string) => {
  try {
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, message: 'Invalid email address' };
    }

    // Check if OTP is valid and not expired
    const user = await db.user.findFirst({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return { success: false, message: 'Invalid or expired OTP' };
    }

    // Update user status to verified and store the OTP code
    await db.user.update({
      where: { id: user.id },
      data: { isOtp: true, isActive: true, otpCode: code || null },
    });

    return { success: true, message: 'OTP verified successfully' };
  } catch (error) {
    console.error('Error in verifyTheUser:', error);
    return { success: false, message: 'Internal server error' };
  }
};
