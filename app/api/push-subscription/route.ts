import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import db from '@/lib/prisma';

export async function POST(request: NextRequest) {
  console.log('Push subscription request received');
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let subscription;
    try {
      subscription = await request.json();
    } catch (parseError) {
      return Response.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return Response.json({ error: 'Invalid subscription data' }, { status: 400 });
    }

    await db.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        userId: session.user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userName: session.user.name || null,
        role: session.user.role || null,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userName: session.user.name || null,
        role: session.user.role || null
      }
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
} 