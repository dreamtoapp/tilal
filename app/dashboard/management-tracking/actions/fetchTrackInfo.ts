'use server';

import db from '@/lib/prisma';
// import { ActionError } from '@/types/commonType';
import { activeTripIncludeRelation, ActiveTrip } from '@/types/databaseTypes';

export const fetchTrackInfo = async (orderid: string): Promise<ActiveTrip | null> => {
  try {
    // Validate orderid format
    if (!orderid || typeof orderid !== 'string' || orderid.trim().length === 0) {
      return null;
    }

    const trackInfo = await db.activeTrip.findUnique({
      where: { orderId: orderid.trim() },
      include: activeTripIncludeRelation
    });

    return trackInfo;
  } catch (error) {
    console.error('Error fetching track info:', error);
    
    // Log error for debugging but don't throw to avoid breaking the UI
    // Instead return null to show the "not started" state
    return null;
  }
}; 