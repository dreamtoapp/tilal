'use server';
import db from '@/lib/prisma';
import { ActiveTrip } from '@prisma/client';

type Result<T = ActiveTrip> =
  | { success: true; data: T }
  | { success: false; error: string };

// Checks if the driver already has an active trip
async function checkExistingTrip(driverId: string): Promise<Result<null>> {
  const existingTrip = await db.activeTrip.findFirst({ where: { driverId } });
  if (existingTrip) {
    return { success: false, error: 'يوجد رحلة نشطة بالفعل. يجب إغلاق الرحلة الحالية أولاً' };
  }
  return { success: true, data: null };
}

// Fetches the order and ensures it is assigned to a driver
async function fetchOrderWithDriver(orderId: string): Promise<Result<any>> {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { customer: true, driver: true }
  });
  if (!order) {
    return { success: false, error: 'الطلب غير موجود' };
  }
  if (!order.driver) {
    return { success: false, error: 'لم يتم تعيين سائق لهذا الطلب' };
  }
  return { success: true, data: order };
}

// Creates the ActiveTrip record in the database
async function createActiveTrip(orderId: string, driverId: string, latitude: string, longitude: string, orderNumber: string): Promise<Result<ActiveTrip>> {
  try {
    const record = await db.activeTrip.create({
      data: { orderId, driverId, latitude, longitude, orderNumber },
    });
    return { success: true, data: record };
  } catch (error) {
    return { success: false, error: 'فشل إنشاء الرحلة النشطة' };
  }
}

// Orchestrates the trip start process: validates, checks, creates, and notifies
export const startTrip = async (
  orderId: string,
  driverId: string,
  latitude: string,
  longitude: string,
): Promise<Result> => {
  const tripCheck = await checkExistingTrip(driverId);
  if (!tripCheck.success) return tripCheck;

  const orderResult = await fetchOrderWithDriver(orderId);
  if (!orderResult.success) return orderResult;
  const order = orderResult.data;

  const tripResult = await createActiveTrip(orderId, driverId, latitude, longitude, order.orderNumber);
  if (!tripResult.success) return tripResult;

  return { success: true, data: tripResult.data };
};
