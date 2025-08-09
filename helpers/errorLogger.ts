import db from '@/lib/prisma';
import { auth } from '@/auth';
import { sendErrorNotificationEmail } from './errorEmailService';

// 🔍 Generate human-readable error ID for users to reference
function generateErrorId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 5);
  return `ERR-${timestamp}-${random}`.toUpperCase();
}

// 📊 Determine error severity based on error message/type
function determineErrorSeverity(error: Error): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  const message = error.message?.toLowerCase() || '';
  const stack = error.stack?.toLowerCase() || '';
  
  // Critical errors
  if (
    message.includes('database') || 
    message.includes('connection') ||
    message.includes('authentication') ||
    stack.includes('prisma')
  ) {
    return 'CRITICAL';
  }
  
  // High severity errors
  if (
    message.includes('payment') ||
    message.includes('order') ||
    message.includes('checkout') ||
    message.includes('network')
  ) {
    return 'HIGH';
  }
  
  // Low severity errors
  if (
    message.includes('validation') ||
    message.includes('form') ||
    message.includes('input')
  ) {
    return 'LOW';
  }
  
  // Default to medium
  return 'MEDIUM';
}

// 🌐 Get browser and device information
function getBrowserInfo(): string {
  if (typeof window === 'undefined') return 'Server-side';
  
  const nav = navigator;
  return `${nav.userAgent} | Screen: ${screen.width}x${screen.height} | Platform: ${nav.platform}`;
}

// 📝 Main error logging function
export async function logErrorToDatabase(
  error: Error,
  context?: {
    url?: string;
    digest?: string;
    additionalInfo?: string;
  }
) {
  try {
    const session = await auth();
    const errorId = generateErrorId();
    const severity = determineErrorSeverity(error);
    const userAgent = getBrowserInfo();
    const url = context?.url || (typeof window !== 'undefined' ? window.location.href : 'Unknown');

    // 📧 Send email FIRST (most important - always works even if DB fails)
    const emailSuccess = await sendErrorNotificationEmail({
      errorId,
      message: error.message || 'Unknown error',
      stack: error.stack || null,
      url,
      userAgent,
      userId: session?.user?.id || null,
      severity,
      timestamp: new Date().toLocaleString('ar-SA', { 
        timeZone: 'Asia/Riyadh',
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    });

    // 💾 Then try to save to database (don't let this block email)
    let dbSuccess = false;
    try {
      await db.errorLog.create({
        data: {
          errorId,
          message: error.message || 'Unknown error',
          stack: error.stack || null,
          digest: context?.digest || null,
          url,
          userAgent,
          userId: session?.user?.id || null,
          severity,
          status: 'NEW'
        }
      });
      dbSuccess = true;
    } catch (dbError) {
      console.error('❌ Failed to save error to database:', dbError);
    }

    console.log(`✅ Error ${errorId}: ${emailSuccess ? '📧 Email sent' : '❌ Email failed'} | ${dbSuccess ? '💾 DB saved' : '❌ DB failed'}`);
    return errorId;

  } catch (loggingError) {
    // Don't break the app if logging fails
    console.error('❌ Failed to log error to database:', loggingError);
    return `ERR-${Date.now()}`;
  }
}

// 🎯 Quick error logging for specific error types
export const ERROR_LOGGER = {
  // Database errors
  database: (error: Error, query?: string) => 
    logErrorToDatabase(error, { additionalInfo: `Database query: ${query}` }),
  
  // API errors  
  api: (error: Error, endpoint?: string) =>
    logErrorToDatabase(error, { additionalInfo: `API endpoint: ${endpoint}` }),
  
  // Payment errors
  payment: (error: Error, orderId?: string) =>
    logErrorToDatabase(error, { additionalInfo: `Order ID: ${orderId}` }),
  
  // Authentication errors
  auth: (error: Error, userId?: string) =>
    logErrorToDatabase(error, { additionalInfo: `User ID: ${userId}` })
}; 