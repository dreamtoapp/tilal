import { NextRequest, NextResponse } from 'next/server';
import { testArabicConfirmTemplate } from '@/app/(e-comm)/(adminPage)/auth/verify/action/otp-via-whatsapp';

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

    console.log(`🧪 Testing Arabic confirm template for: ${phoneNumber}`);

    const result = await testArabicConfirmTemplate(phoneNumber);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        templateName: result.templateName,
        language: result.language,
        testOTP: result.testOTP,
        data: result.data
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        templateName: result.templateName,
        language: result.language,
        fullError: result.fullError,
        message: 'فشل في اختبار قالب التأكيد العربي'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error testing Arabic template:', error);
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
    message: 'Use POST with phoneNumber to test Arabic confirm template',
    example: {
      method: 'POST',
      body: {
        phoneNumber: '0545642264'
      }
    }
  });
}

