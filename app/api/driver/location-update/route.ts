import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import db from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { driverId, orderId, latitude, longitude, timestamp } = await request.json();

    if (driverId !== session.user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.locationHistory.create({
      data: {
        driverId,
        orderId,
        latitude,
        longitude,
        createdAt: new Date(timestamp)
      }
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Location update error:', error);
    return Response.json({ error: 'Failed to update location' }, { status: 500 });
  }
} 