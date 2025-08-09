'use server';
import db from '@/lib/prisma';

// Update the ActiveTrip record with new coordinates and increment updateCount
export async function updateDriverLocation(orderId: string, latitude: string, longitude: string) {
  try {
    await db.activeTrip.update({
      where: { orderId },
      data: {
        latitude,
        longitude,
        updatedAt: new Date(),
        updateCount: { increment: 1 }, // Increment updateCount by 1
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'فشل تحديث الموقع' };
  }
} 