import { auth } from '@/auth';
import db from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ driverId: string }> }
) {
  const { driverId } = await params;
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentOrder = await db.order.findFirst({
      where: {
        driverId: driverId,
        status: 'IN_TRANSIT'
      },
      include: {
        customer: {
          select: { name: true, phone: true }
        }
      }
    });

    const latestLocation = await db.locationHistory.findFirst({
      where: {
        driverId: driverId,
        orderId: currentOrder?.id
      },
      orderBy: { createdAt: 'desc' }
    });

    return Response.json({
      driver: {
        id: driverId,
        currentOrder: currentOrder ? {
          id: currentOrder.id,
          orderNumber: currentOrder.orderNumber,
          customer: currentOrder.customer,
          status: currentOrder.status
        } : null,
        currentLocation: latestLocation ? {
          latitude: parseFloat(latestLocation.latitude || '0'),
          longitude: parseFloat(latestLocation.longitude || '0'),
          timestamp: latestLocation.createdAt
        } : null
      }
    });

  } catch (error) {
    console.error('Driver location fetch error:', error);
    return Response.json({ error: 'Failed to fetch location' }, { status: 500 });
  }
} 