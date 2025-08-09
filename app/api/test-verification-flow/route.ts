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

    console.log(`🧪 Testing complete verification flow for: ${phoneNumber}`);

    // Step 1: Generate OTP (like the verification page does)
    const { token: realOTP, expires } = generateOTP();
    console.log(`🔢 Generated OTP: ${realOTP}, Expires: ${expires}`);

    // Step 2: Send OTP via WhatsApp using the updated template
    console.log(`📱 Sending OTP via WhatsApp using "confirm" template...`);
    const whatsappResult = await sendOTPTemplate(phoneNumber, realOTP);

    if (whatsappResult.success) {
      console.log(`✅ WhatsApp OTP sent successfully!`);

      return NextResponse.json({
        success: true,
        message: 'تم اختبار عملية التحقق الكاملة بنجاح',
        step1: {
          status: 'completed',
          action: 'OTP Generation',
          result: `Generated OTP: ${realOTP}`
        },
        step2: {
          status: 'completed',
          action: 'WhatsApp Template Send',
          result: 'OTP sent via "confirm" template',
          templateName: 'confirm',
          language: 'ar'
        },
        verificationFlow: {
          otp: realOTP,
          expires: expires,
          whatsappSuccess: true,
          readyForVerification: true
        },
        data: whatsappResult.data
      });
    } else {
      console.log(`❌ WhatsApp OTP failed: ${whatsappResult.error}`);

      return NextResponse.json({
        success: false,
        error: whatsappResult.error,
        step1: {
          status: 'completed',
          action: 'OTP Generation',
          result: `Generated OTP: ${realOTP}`
        },
        step2: {
          status: 'failed',
          action: 'WhatsApp Template Send',
          result: whatsappResult.error,
          templateName: 'confirm',
          language: 'ar'
        },
        verificationFlow: {
          otp: realOTP,
          expires: expires,
          whatsappSuccess: false,
          readyForVerification: false
        },
        message: 'فشل في إرسال رمز التحقق عبر WhatsApp'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error testing verification flow:', error);
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
    message: 'Use POST with phoneNumber to test complete verification flow',
    description: 'This test simulates the exact verification flow used in /auth/verify',
    example: {
      method: 'POST',
      body: {
        phoneNumber: '0502699023'
      }
    },
    steps: [
      '1. Generate OTP (like verification page)',
      '2. Send OTP via WhatsApp using "confirm" template',
      '3. Return results for verification testing'
    ]
  });
}

