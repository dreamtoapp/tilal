'use server';
import nodemailer from 'nodemailer';

import db from '@/lib/prisma';
import { Company } from '@/types/databaseTypes';

interface EmailOptions {
  to: string;
  orderNumber: string;
  cc?: string;
  orderId: string; // Made mandatory for invoice link
}

// type company = Partial<Company>   // to avoid TypeScript to some of the type only


const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials not configured');
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true,
    debug: false,
  });
};

const generateEmailTemplate = (orderNumber: string, orderLink: string, company: Partial<Company>) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <title>فاتورة #${orderNumber}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; direction: rtl; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; }
        .header { border-bottom: 1px solid #eee; padding-bottom: 20px; }
        .logo { max-width: 200px; }
        .content { margin: 30px 0; }
        .invoice-details { background: #f9f9f9; padding: 20px; border-radius: 5px; }
        .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background-color: #007bff; 
            color: white !important; 
            text-decoration: none; 
            border-radius: 4px; 
            margin-top: 20px;
        }
        .footer { 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #eee; 
            color: #666; 
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${company.logo}" alt="شعار ${company.fullName}" class="logo">
        </div>
        
        <div class="content">
            <h2>فاتورة الطلبية رقم #${orderNumber}</h2>
            <p>عميلنا العزيز،</p>
            
            <div class="invoice-details">
                <p><strong>رقم الفاتورة:</strong> ${orderNumber}</p>
                <p><strong>تاريخ الإصدار:</strong> ${new Date().toLocaleDateString()}</p>
                <p>يرجى العثور على تفاصيل الفاتورة أدناه. يمكنك عرض وتنزيل الفاتورة الكاملة من خلال بوابتنا الآمنة.</p>
            </div>

            <a href="${orderLink}" class="button">عرض الفاتورة الكاملة</a>
            <p>أو يمكنك نسخ الرابط التالي وفتحه في متصفحك:</p>
            <p><a href="${orderLink}">${orderLink}</a></p>

            <p>إذا كانت لديك أي استفسارات بخصوص هذه الفاتورة، يرجى التواصل مع فريق الدعم الخاص بنا على 
            <a href="mailto:${company.email}">${company.email}</a>.</p>
        </div>

        <div class="footer">
            <p>مع أطيب التحيات،<br>
            ${company.fullName}<br>
            📞 ${company.phoneNumber}<br>
            🌐 <a href="${company.website || process.env.BASE_URL || '#'}">${company.website || process.env.BASE_URL || 'لا يوجد موقع إلكتروني'}</a></p>
            
            <p style="color: #999; font-size: 0.8em;">
                هذه رسالة تلقائية. يرجى عدم الرد مباشرة على هذا البريد الإلكتروني.
            </p>
        </div>
    </div>
</body>
</html>
`;

export const sendInvoiceEmail = async ({ to, orderNumber, cc, orderId }: EmailOptions) => {
  try {
    if (!orderId) throw new Error('Order ID is required');
    const company = await db.company.findFirst();
    if (!company) throw new Error('Company details not found');

    const orderLink = `${process.env.BASE_URL}/client-invoice/${orderId}`;
    if (!process.env.BASE_URL) throw new Error('Base URL not configured');

    const transporter = createTransporter();
    const htmlTemplate = generateEmailTemplate(orderNumber, orderLink, company);

    const mailOptions = {
      from: `"${company.fullName}" <${process.env.EMAIL_USER}>`,
      to,
      cc,
      subject: `فاتورة الطلبية رقم #${orderNumber}`,
      text: `فاتورة الطلبية رقم #${orderNumber}\n\nعرض الفاتورة: ${orderLink}\n\nشكراً لاختياركم ${company.fullName}.`,
      html: htmlTemplate,
      headers: {
        'X-Laziness-level': '1000',
      },
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(`❌ Error sending email for order ${orderNumber}:`, error);
    throw new Error(`Email delivery failed: ${error}`);
  }
};
