"use server";
import db from '@/lib/prisma';
import { ActionError } from '@/types/commonType';
import { UserRole } from '@prisma/client';

export async function getDrivers() {
  try {
    // Fetch all users with role: 'DRIVER' instead of from the old Driver table
    const drivers = await db.user.findMany({ where: { role: UserRole.DRIVER } });
    return drivers;
  } catch (error) {
    const err: ActionError =
      typeof error === 'object' && error && 'message' in error
        ? { message: (error as ActionError).message, code: (error as ActionError).code }
        : { message: 'فشل في جلب قائمة السائقين من قاعدة البيانات.' };
    throw err;
  }
}
