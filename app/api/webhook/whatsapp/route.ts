import { NextRequest, NextResponse } from 'next/server';
import { getWhatsAppConfig } from '@/lib/whatsapp/config';
import crypto from 'crypto';

// Verify webhook signature for security
function verifyWebhookSignature(
  body: string,
  signature: string,
  appSecret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', appSecret)
      .update(body, 'utf8')
      .digest('hex');

    return `sha256=${expectedSignature}` === signature;
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const config = getWhatsAppConfig();

    if (mode === 'subscribe' && token === config.webhookVerifyToken) {
      console.log('✅ WhatsApp webhook verified successfully');
      return new NextResponse(challenge, { status: 200 });
    }

    console.log('❌ WhatsApp webhook verification failed');
    return new NextResponse('Forbidden', { status: 403 });
  } catch (error) {
    console.error('Webhook verification error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-hub-signature-256');

    // Verify webhook signature for security
    const config = getWhatsAppConfig();
    if (signature && !verifyWebhookSignature(body, signature, config.appSecret)) {
      console.error('❌ Invalid webhook signature');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = JSON.parse(body);

    // Handle incoming messages and status updates
    if (data.object === 'whatsapp_business_account') {
      const entry = data.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (value?.messages) {
        // Handle incoming messages
        for (const message of value.messages) {
          const from = message.from;
          const text = message.text?.body;
          const timestamp = message.timestamp;

          console.log('📨 Received WhatsApp message:', {
            from,
            text,
            timestamp,
            messageId: message.id
          });

          // TODO: Implement message handling logic
          // - Save to database
          // - Send auto-reply
          // - Process commands
        }
      }

      if (value?.statuses) {
        // Handle message status updates
        for (const status of value.statuses) {
          const messageId = status.id;
          const statusType = status.status;
          const timestamp = status.timestamp;

          console.log('📊 Message status update:', {
            messageId,
            status: statusType,
            timestamp
          });

          // TODO: Update message status in database
          // - Track delivery status
          // - Handle failures
          // - Update analytics
        }
      }
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return new NextResponse('Error', { status: 500 });
  }
} 