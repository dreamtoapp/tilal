import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface ErrorEmailData {
  errorId: string;
  message: string;
  stack?: string | null;
  url?: string;
  userAgent?: string;
  userId?: string | null;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
}

// 📧 Create detailed error email template
function createErrorEmailTemplate(errorData: ErrorEmailData): string {
  const severityEmoji = {
    LOW: '🟢',
    MEDIUM: '🟡', 
    HIGH: '🟠',
    CRITICAL: '🔴'
  };

  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .footer { background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
        .error-id { background: #fef2f2; border: 2px solid #fecaca; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: center; }
        .severity { font-weight: bold; padding: 5px 10px; border-radius: 4px; display: inline-block; }
        .severity.CRITICAL { background: #fef2f2; color: #dc2626; }
        .severity.HIGH { background: #fff7ed; color: #ea580c; }
        .severity.MEDIUM { background: #fefce8; color: #ca8a04; }
        .severity.LOW { background: #f0fdf4; color: #16a34a; }
        .code-block { background: #1f2937; color: #f9fafb; padding: 15px; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 تنبيه خطأ جديد في النظام</h1>
            <p>تم تسجيل خطأ جديد في تطبيق المتجر الإلكتروني</p>
        </div>
        
        <div class="content">
            <div class="error-id">
                <h2>🔍 معرف الخطأ للمتابعة</h2>
                <strong style="font-size: 18px; color: #dc2626;">${errorData.errorId}</strong>
            </div>
            
            <h3>${severityEmoji[errorData.severity]} مستوى الخطر:</h3>
            <span class="severity ${errorData.severity}">${errorData.severity}</span>
            
            <h3>📅 وقت الحدوث:</h3>
            <p>${errorData.timestamp}</p>
            
            <h3>💬 رسالة الخطأ:</h3>
            <p style="background: #fef2f2; padding: 10px; border-radius: 4px; border-left: 4px solid #dc2626;">
                ${errorData.message}
            </p>
            
            <h3>🌐 صفحة الخطأ:</h3>
            <p>${errorData.url || 'غير محدد'}</p>
            
            <h3>👤 معلومات المستخدم:</h3>
            <p><strong>معرف المستخدم:</strong> ${errorData.userId || 'مستخدم غير مسجل'}</p>
            <p><strong>المتصفح:</strong> ${errorData.userAgent || 'غير محدد'}</p>
            
            ${errorData.stack ? `
            <h3>🔧 تفاصيل تقنية (Stack Trace):</h3>
            <div class="code-block">${errorData.stack.replace(/\n/g, '<br>')}</div>
            ` : ''}
            
            <h3>🎯 إجراءات مقترحة:</h3>
            <ul>
                <li>فحص سجل الأخطاء في لوحة التحكم</li>
                <li>التحقق من حالة قاعدة البيانات</li>
                <li>مراجعة الكود المتعلق بالخطأ</li>
                ${errorData.severity === 'CRITICAL' ? '<li><strong>⚠️ خطأ حرج: يتطلب تدخل فوري!</strong></li>' : ''}
            </ul>
        </div>
        
        <div class="footer">
            <p>نظام تتبع الأخطاء التلقائي - متجر Dream To App</p>
            <p>تم إرسال هذا التنبيه تلقائياً عند حدوث الخطأ</p>
        </div>
    </div>
</body>
</html>`;
}

// 📧 Send error notification email
export async function sendErrorNotificationEmail(errorData: ErrorEmailData): Promise<boolean> {
  try {
    const subject = `🚨 خطأ ${errorData.severity} في النظام - ${errorData.errorId}`;
    const emailContent = createErrorEmailTemplate(errorData);
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'dreamto@gmail.com',
      subject,
      html: emailContent,
    });

    console.log(`✅ Error notification email sent for ${errorData.errorId}`);
    return true;
    
  } catch (emailError) {
    console.error('❌ Failed to send error notification email:', emailError);
    return false;
  }
} 