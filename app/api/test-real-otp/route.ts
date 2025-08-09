import { NextRequest, NextResponse } from 'next/server';
import { generateOTP } from '@/lib/otp-Generator';
import { sendOTPTemplate } from '@/lib/whatsapp-template-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          error: 'Phone number is required',
          message: 'رقم الهاتف مطلوب'
        },
        { status: 400 }
      );
    }

    console.log(`🧪 Testing real OTP with confirm template for: ${phoneNumber}`);

    // Generate a real OTP
    const { token: realOTP } = generateOTP();
    console.log(`🔢 Generated real OTP: ${realOTP}`);

    // Test the updated template with real OTP
    const result = await sendOTPTemplate(phoneNumber, realOTP);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'تم إرسال رمز التحقق الحقيقي عبر قالب التأكيد العربي',
        templateName: 'confirm',
        language: 'ar',
        realOTP: realOTP,
        data: result.data
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        templateName: 'confirm',
        language: 'ar',
        realOTP: realOTP,
        message: 'فشل في إرسال رمز التحقق الحقيقي'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error testing real OTP:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Server error',
        message: 'خطأ في الخادم'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST with phoneNumber to test real OTP with confirm template',
    example: {
      method: 'POST',
      body: {
        phoneNumber: '0502699023'
      }
    }
  });
}

