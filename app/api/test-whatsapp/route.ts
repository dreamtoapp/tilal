import { NextRequest, NextResponse } from 'next/server';
import { sendMessage } from '@/lib/whatapp-cloud-api';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, message } = await request.json();

    if (!phoneNumber || !message) {
      return NextResponse.json(
        { error: 'Phone number and message are required' },
        { status: 400 }
      );
    }

    // Test sending message
    const result = await sendMessage(phoneNumber, message);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Message sent successfully',
        data: result.data
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Test WhatsApp error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'WhatsApp Test API is running',
    instructions: 'Send POST request with { phoneNumber: "+1234567890", message: "Hello" }'
  });
} 