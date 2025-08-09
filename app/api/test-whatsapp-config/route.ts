import { NextRequest, NextResponse } from 'next/server';
import { getWhatsAppConfig, validateWhatsAppConfig } from '@/lib/whatsapp/config';
import { sendOTPTemplate, sendOTPTextMessage } from '@/lib/whatsapp-template-api';

export async function GET() {
  try {
    // Validate configuration
    const validation = validateWhatsAppConfig();

    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        message: 'WhatsApp configuration validation failed',
        errors: validation.errors
      }, { status: 400 });
    }

    // Get configuration
    const config = getWhatsAppConfig();

    return NextResponse.json({
      success: true,
      message: 'WhatsApp configuration is valid',
      config: {
        apiVersion: config.apiVersion,
        phoneNumberId: config.phoneNumberId,
        businessAccountId: config.businessAccountId,
        environment: config.environment,
        hasAccessToken: !!config.accessToken,
        hasWebhookToken: !!config.webhookVerifyToken,
        hasAppSecret: !!config.appSecret
      }
    });

  } catch (error) {
    console.error('WhatsApp config test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Configuration test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Log the raw request body for debugging
    const rawBody = await request.text();
    console.log('🔍 Raw request body:', rawBody);
    console.log('🔍 Content-Type:', request.headers.get('content-type'));

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      console.error('❌ Raw body that failed:', rawBody);
      return NextResponse.json({
        success: false,
        message: 'Invalid JSON in request body',
        error: parseError instanceof Error ? parseError.message : 'JSON parse failed',
        receivedBody: rawBody.substring(0, 100) // Show first 100 chars for debugging
      }, { status: 400 });
    }

    const { phoneNumber, testType = 'template' } = body;

    if (!phoneNumber) {
      return NextResponse.json({
        success: false,
        message: 'Phone number is required'
      }, { status: 400 });
    }

    // Validate configuration first
    const validation = validateWhatsAppConfig();
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        message: 'WhatsApp configuration validation failed',
        errors: validation.errors
      }, { status: 400 });
    }

    // Generate test OTP
    const testOTP = Math.floor(100000 + Math.random() * 900000).toString();

    let result;

    if (testType === 'template') {
      result = await sendOTPTemplate(phoneNumber, testOTP);
    } else {
      result = await sendOTPTextMessage(phoneNumber, testOTP);
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test ${testType} message sent successfully`,
        data: {
          phoneNumber,
          testType,
          messageId: result.data && typeof result.data === 'object' && 'messages' in result.data ?
            (result.data as any).messages?.[0]?.id : undefined
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `Test ${testType} message failed`,
        error: result.error
      }, { status: 400 });
    }

  } catch (error) {
    console.error('WhatsApp test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 