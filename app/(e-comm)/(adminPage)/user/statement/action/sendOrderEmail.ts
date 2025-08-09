'use server';
import nodemailer from 'nodemailer';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

import db from '@/lib/prisma';
import { Order } from '../[id]/page';

interface EmailOptions {
  to: string;
  orderData: Order;
  customerName: string;
}

interface CompanyData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  website?: string;
}

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

const generateOrderEmailTemplate = (order: Order, customerName: string, companyData: CompanyData) => {
  const orderItems = order.items.map(item => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 12px; text-align: right;">
        <div style="display: flex; align-items: center; gap: 12px;">
          ${item.product?.imageUrl ? 
            `<img src="${item.product.imageUrl}" alt="${item.product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">` : 
            `<div style="width: 50px; height: 50px; background: #f3f4f6; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #6b7280;">صورة</div>`
          }
          <div>
            <div style="font-weight: 600; color: #1f2937;">${item.product?.name || 'منتج غير متوفر'}</div>
            <div style="font-size: 12px; color: #6b7280;">كود المنتج: ${item.productId}</div>
          </div>
        </div>
      </td>
      <td style="padding: 12px; text-align: center; font-weight: 600;">${item.quantity}</td>
      <td style="padding: 12px; text-align: center; color: #059669;">${item.price.toFixed(2)} ر.س</td>
      <td style="padding: 12px; text-align: center; color: #dc2626; font-weight: 600;">${(item.quantity * item.price).toFixed(2)} ر.س</td>
    </tr>
  `).join('');

  const addressDisplay = order.address ? `
    ${order.address.district}, ${order.address.street}, مبنى ${order.address.buildingNumber}
    ${order.address.floor ? `, الطابق ${order.address.floor}` : ''}
    ${order.address.apartmentNumber ? `, شقة ${order.address.apartmentNumber}` : ''}
    ${order.address.landmark ? `<br><small>علامة مميزة: ${order.address.landmark}</small>` : ''}
  ` : 'عنوان غير متوفر';

  const shiftDisplay = order.shift ? `${order.shift.name} (${order.shift.startTime} - ${order.shift.endTime})` : 'وقت غير محدد';

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <title>تفاصيل الطلبية #${order.orderNumber}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; direction: rtl; margin: 0; padding: 0; background-color: #f9fafb; }
        .container { max-width: 800px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .order-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-right: 4px solid #3b82f6; }
        .order-info h3 { margin: 0 0 15px 0; color: #1f2937; }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .info-item { }
        .info-label { font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
        .info-value { color: #1f2937; font-weight: 500; }
        .items-section { margin: 25px 0; }
        .items-table { width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
        .items-table th { background: #f3f4f6; padding: 15px 12px; text-align: center; font-weight: 600; color: #374151; }
        .items-table td { background: white; }
        .total-section { background: #ecfdf5; padding: 20px; border-radius: 8px; margin-top: 25px; text-align: center; }
        .total-amount { font-size: 24px; font-weight: 700; color: #059669; }
        .status-badge { 
            display: inline-block; 
            padding: 6px 12px; 
            border-radius: 20px; 
            font-size: 12px; 
            font-weight: 600; 
            text-transform: uppercase;
        }
        .status-delivered { background: #dcfce7; color: #166534; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-inway { background: #dbeafe; color: #1e40af; }
        .status-canceled { background: #fee2e2; color: #991b1b; }
        .footer { background: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb; color: #6b7280; }
        .footer a { color: #3b82f6; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>تفاصيل الطلبية #${order.orderNumber}</h1>
            <p>عميلنا العزيز ${customerName}</p>
        </div>
        
        <div class="content">
            <div class="order-info">
                <h3>معلومات الطلبية</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">رقم الطلبية</div>
                        <div class="info-value">#${order.orderNumber}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">تاريخ الطلب</div>
                        <div class="info-value">${format(new Date(order.createdAt), 'dd MMMM yyyy - HH:mm', { locale: ar })}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">حالة الطلبية</div>
                        <div class="info-value">
                            <span class="status-badge status-${order.status.toLowerCase()}">
                                ${order.status === 'DELIVERED' ? 'مسلم' : 
                                  order.status === 'PENDING' ? 'قيد الانتظار' : 
                                  order.status === 'IN_TRANSIT' ? 'في الطريق' : 
                                  order.status === 'CANCELED' ? 'ملغي' : order.status}
                            </span>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">طريقة الدفع</div>
                        <div class="info-value">${order.paymentMethod || 'نقد عند التسليم'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">وقت التوصيل</div>
                        <div class="info-value">${shiftDisplay}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">عنوان التوصيل</div>
                        <div class="info-value">${addressDisplay}</div>
                    </div>
                </div>
                ${order.deliveryInstructions ? `
                    <div style="margin-top: 15px; padding: 12px; background: #fffbeb; border-radius: 6px; border-right: 3px solid #f59e0b;">
                        <div class="info-label">تعليمات التوصيل</div>
                        <div class="info-value">${order.deliveryInstructions}</div>
                    </div>
                ` : ''}
            </div>

            <div class="items-section">
                <h3 style="margin-bottom: 15px; color: #1f2937;">عناصر الطلبية</h3>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th style="text-align: right;">المنتج</th>
                            <th>الكمية</th>
                            <th>سعر الوحدة</th>
                            <th>الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderItems}
                    </tbody>
                </table>
            </div>

            <div class="total-section">
                <div style="margin-bottom: 8px; color: #6b7280; font-weight: 600;">إجمالي المبلغ</div>
                <div class="total-amount">${order.amount.toFixed(2)} ر.س</div>
            </div>
        </div>

        <div class="footer">
            <p>شكراً لاختياركم ${companyData.fullName || process.env.APP_NAME || 'متجرنا'}</p>
            <p>📞 ${companyData.phoneNumber || ''} | 📧 <a href="mailto:${companyData.email || process.env.EMAIL_USER}">${companyData.email || process.env.EMAIL_USER}</a></p>
            <p style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
                هذه رسالة تلقائية. يرجى عدم الرد مباشرة على هذا البريد الإلكتروني.
            </p>
        </div>
    </div>
</body>
</html>
`;
};

export const sendOrderEmail = async ({ to, orderData, customerName }: EmailOptions) => {
  try {
    const company = await db.company.findFirst();
    const companyData: CompanyData = company ? {
      fullName: company.fullName,
      email: company.email,
      phoneNumber: company.phoneNumber,
      website: company.website,
    } : {};

    const transporter = createTransporter();
    const htmlTemplate = generateOrderEmailTemplate(orderData, customerName, companyData);

    const mailOptions = {
      from: `"${companyData.fullName || process.env.APP_NAME || 'Online Shop'}" <${process.env.EMAIL_USER}>`,
      to,
      subject: `تفاصيل الطلبية #${orderData.orderNumber}`,
      text: `تفاصيل الطلبية #${orderData.orderNumber}\n\nالمبلغ الإجمالي: ${orderData.amount.toFixed(2)} ر.س\nحالة الطلبية: ${orderData.status}\n\nشكراً لاختياركم ${companyData.fullName || 'متجرنا'}.`,
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'تم إرسال تفاصيل الطلبية بنجاح' };
  } catch (error) {
    console.error(`❌ Error sending order email:`, error);
    return { success: false, message: 'فشل في إرسال البريد الإلكتروني' };
  }
}; 