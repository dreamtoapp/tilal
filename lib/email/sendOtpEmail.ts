'use server';
import { createTransport } from 'nodemailer';

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

export const sendOtpEmail = async (to: string, otp: string, recipientName?: string): Promise<{ success: boolean; message: string }> => {
  try {
    await transporter.sendMail({
      from: `"${process.env.EMAIL_SENDER_NAME}" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Your Verification Code - ${process.env.APP_NAME || ''}`,
      html: createOTPEmailTemplate(otp, recipientName),
    });
    return { success: true, message: 'Verification email sent' };
  } catch (error) {
    return { success: false, message: 'Failed to send verification email' };
  }
}; 