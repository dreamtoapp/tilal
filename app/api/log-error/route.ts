import { NextRequest, NextResponse } from 'next/server';
import { logErrorToDatabase } from '@/helpers/errorLogger';

// 📝 API endpoint for client-side error logging
export async function POST(request: NextRequest) {
  try {
    const { message, stack, digest, url, additionalInfo } = await request.json();
    
    // Create error object from client data
    const error = new Error(message);
    if (stack) error.stack = stack;
    
    // Log error (this will send email automatically)
    const errorId = await logErrorToDatabase(error, {
      url,
      digest,
      additionalInfo: additionalInfo || 'Error from client-side component'
    });

    return NextResponse.json({
      success: true,
      errorId
    });

  } catch (error) {
    console.error('Failed to log client error:', error);
    return NextResponse.json({
      success: false,
      errorId: `ERR-${Date.now()}`
    }, { status: 500 });
  }
} 