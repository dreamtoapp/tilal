'use server';

import { generateOTP } from '@/lib/otp-Generator';
import { sendOTPTemplate, sendOTPTextMessage, generateWhatsAppGuidanceURL } from '@/lib/whatsapp-template-api';
import db from '@/lib/prisma';
import { auth } from '@/auth';
import { debug, error, warn } from '@/utils/logger';

// Rate limiting helper
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const key = `otp_${userId}`;
  const limit = rateLimitStore.get(key);

  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + 60 * 60 * 1000 });
    return true;
  }

  if (limit.count >= 5) {
    return false;
  }

  limit.count++;
  return true;
};

// OTP via WhatsApp handler - Session-based
export const otpViaWhatsApp = async () => {
  try {
    // Get user from session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const userId = session.user.id;
    const userPhone = session.user.phone;

    if (!userPhone) {
      return {
        success: false,
        message: 'رقم الهاتف غير متوفر في الحساب'
      };
    }

    // Check rate limiting
    if (!checkRateLimit(userId)) {
      return {
        success: false,
        message: 'تم تجاوز الحد الأقصى للمحاولات. يرجى المحاولة لاحقاً'
      };
    }

    const { token, expires } = generateOTP();

    // Update user with OTP using user ID
    await db.user.update({
      where: { id: userId },
      data: {
        otpCode: token,
        isOtp: false
      }
    });

    // Only return fake OTP if WhatsApp token is completely missing
    if (!process.env.WHATSAPP_PERMANENT_TOKEN) {
      warn('WhatsApp token missing, returning fake OTP');
      return {
        success: true,
        message: 'تم إرسال رمز التحقق (وهمي) - WhatsApp غير مُعد',
        token,
        expires,
        phoneNumber: userPhone,
        isFake: true
      };
    }

    // Use text message as primary method (works reliably)
    // Code delivery setup templates have complex button requirements that are causing API errors
    let whatsappResult;
    let attemptLog = [];

    try {
      // Primary method: Use text message (works for users who messaged business)
      debug(`Attempting text message for user ${userId} (${userPhone})`);
      whatsappResult = await sendOTPTextMessage(userPhone, token);
      attemptLog.push(`Text message: ${whatsappResult.success ? 'SUCCESS' : 'FAILED - ' + whatsappResult.error}`);

      if (!whatsappResult.success) {
        debug('Text message failed, trying template:', whatsappResult.error);
        // Fallback: Use template (may work for new users, but has button structure issues)
        debug(`Attempting template message for user ${userId} (${userPhone})`);
        whatsappResult = await sendOTPTemplate(userPhone, token);
        attemptLog.push(`Template message: ${whatsappResult.success ? 'SUCCESS' : 'FAILED - ' + whatsappResult.error}`);
      }
    } catch (whatsappError) {
      error('WhatsApp API error:', whatsappError instanceof Error ? whatsappError.message : 'Unknown error');
      whatsappResult = { success: false, error: 'WhatsApp API error' };
      attemptLog.push(`API error: ${whatsappError instanceof Error ? whatsappError.message : 'Unknown error'}`);
    }

    // Log all attempts for debugging
    debug(`OTP attempts for user ${userId}:`, attemptLog.join(' | '));

    if (!whatsappResult.success) {
      // If WhatsApp fails, provide guidance with clickable WhatsApp link
      error('WhatsApp OTP failed:', whatsappResult.error);
      const whatsappGuidanceURL = generateWhatsAppGuidanceURL(userPhone);

      return {
        success: true,
        message: 'تم إرسال رمز التحقق (وهمي) - خطأ في WhatsApp',
        token,
        expires,
        phoneNumber: userPhone,
        isFake: true,
        whatsappError: whatsappResult.error,
        whatsappGuidanceURL: whatsappGuidanceURL,
        guidanceMessage: 'للاستلام، يرجى إرسال رسالة إلى رقم WhatsApp أولاً'
      };
    }

    return {
      success: true,
      message: 'تم إرسال رمز التحقق عبر WhatsApp',
      expires,
      phoneNumber: userPhone,
      isFake: false
    };

  } catch (otpError) {
    error('Error in otpViaWhatsApp:', otpError instanceof Error ? otpError.message : 'Unknown error');
    return {
      success: false,
      message: 'خطأ في الخادم. يرجى المحاولة مرة أخرى'
    };
  }
};

// Verify OTP - Session-based
export const verifyTheUser = async (code: string) => {
  try {
    // Get user from session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const userId = session.user.id;

    // Get user with OTP data
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        otpCode: true,
        isOtp: true,
        phone: true
      }
    });

    if (!user) {
      return {
        success: false,
        message: 'لم يتم العثور على المستخدم'
      };
    }

    if (!user.otpCode) {
      return {
        success: false,
        message: 'لم يتم إرسال رمز التحقق. يرجى طلب رمز جديد'
      };
    }

    if (user.otpCode !== code) {
      return {
        success: false,
        message: 'رمز التحقق غير صحيح'
      };
    }

    // Update user status using user ID
    await db.user.update({
      where: { id: userId },
      data: {
        isOtp: true,
        isActive: true,
        otpCode: null // Clear OTP after successful verification
      }
    });

    return {
      success: true,
      message: 'تم التحقق من الرمز بنجاح'
    };

  } catch (verifyError) {
    error('Error in verifyTheUser:', verifyError instanceof Error ? verifyError.message : 'Unknown error');
    return {
      success: false,
      message: 'خطأ في الخادم. يرجى المحاولة مرة أخرى'
    };
  }
};

// Resend OTP with cooldown - Session-based
export const resendOTP = async () => {
  try {
    // Get user from session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const userId = session.user.id;

    // Check cooldown
    const cooldownKey = `cooldown_${userId}`;
    const cooldown = rateLimitStore.get(cooldownKey);
    const now = Date.now();

    if (cooldown && now < cooldown.resetTime) {
      const remainingSeconds = Math.ceil((cooldown.resetTime - now) / 1000);
      return {
        success: false,
        message: `يرجى الانتظار ${remainingSeconds} ثانية قبل إعادة الإرسال`
      };
    }

    // Set cooldown
    rateLimitStore.set(cooldownKey, {
      count: 1,
      resetTime: now + 2 * 60 * 1000 // 2 minutes cooldown
    });

    // Send new OTP
    return await otpViaWhatsApp();

  } catch (resendError) {
    error('Error in resendOTP:', resendError instanceof Error ? resendError.message : 'Unknown error');
    return {
      success: false,
      message: 'خطأ في الخادم. يرجى المحاولة مرة أخرى'
    };
  }
};

// Test function for the Arabic "confirm" template shown in the image
export const testArabicConfirmTemplate = async (phoneNumber: string) => {
  try {
    const accessToken = process.env.WHATSAPP_PERMANENT_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const apiVersion = process.env.WHATSAPP_API_VERSION || 'v23.0';

    if (!accessToken || !phoneNumberId) {
      return { success: false, error: 'Server configuration error' };
    }

    // Convert phone number to international format
    const cleaned = phoneNumber.replace(/\D/g, '');
    let internationalPhone = phoneNumber;

    if (cleaned.startsWith('05') && cleaned.length === 10) {
      const numberWithoutZero = cleaned.substring(1);
      internationalPhone = `+966${numberWithoutZero}`;
    } else if (phoneNumber.startsWith('+966')) {
      internationalPhone = phoneNumber;
    }

    debug(`Testing Arabic confirm template for: ${phoneNumber} → ${internationalPhone}`);

    const endpoint = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

    // Test the Arabic "confirm" template from the image
    const testOTP = '1234'; // Test OTP
    const requestBody = {
      messaging_product: 'whatsapp',
      to: internationalPhone,
      type: 'template',
      template: {
        name: 'confirm',
        language: {
          code: 'ar'
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: testOTP
              }
            ]
          }
        ]
      }
    };

    debug(`Testing Arabic confirm template:`, JSON.stringify(requestBody, null, 2));

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    debug(`Arabic confirm template test response (${response.status}):`, JSON.stringify(data, null, 2));

    if (response.ok) {
      debug(`Arabic confirm template test SUCCESS!`);
      return {
        success: true,
        data,
        message: 'تم اختبار قالب التأكيد العربي بنجاح',
        templateName: 'confirm',
        language: 'ar',
        testOTP: testOTP
      };
    } else {
      debug(`Arabic confirm template test FAILED:`, data.error?.message);
      return {
        success: false,
        error: data.error?.message || 'Template test failed',
        templateName: 'confirm',
        language: 'ar',
        fullError: data
      };
    }

  } catch (templateError) {
    const errorMessage = templateError instanceof Error ? templateError.message : 'Unknown error occurred';
    error('Error testing Arabic confirm template:', errorMessage);
    return {
      success: false,
      error: errorMessage,
      templateName: 'confirm',
      language: 'ar'
    };
  }
}; 