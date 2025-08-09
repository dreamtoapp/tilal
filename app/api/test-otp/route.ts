import { NextResponse } from 'next/server';
import { otpViaWhatsApp } from '@/app/(e-comm)/(adminPage)/auth/verify/action/otp-via-whatsapp';

export async function POST() {
  try {
    // Test OTP via WhatsApp
    const result = await otpViaWhatsApp();

    return NextResponse.json(result);

  } catch (error) {
    console.error('Test OTP error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error testing OTP',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'OTP Test API is running',
    instructions: 'Send POST request to test OTP via WhatsApp (requires user session)'
  });
} 