"use server";
import db from '@/lib/prisma';

export async function deleteDriver(driverId: string) {
  try {
    await db.user.delete({
      where: { id: driverId },
    });

    return {
      success: true,
      msg: 'تم حذف السائق بنجاح',
    };
  } catch (error: any) {
    console.error('Error deleting driver:', error);

    let msg = 'فشل في حذف السائق';

    // Optional: You can inspect Prisma error codes to give more specific feedback
    if (error.code === 'P2014') {
      msg = 'لا يمكن حذف السائق لأنه مرتبط بطلبات';
    }

    return {
      success: false,
      msg,
    };
  }
}
