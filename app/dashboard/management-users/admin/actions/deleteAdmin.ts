'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';

interface DeleteResult {
  ok: boolean;
  msg?: string;
}

export async function deleteAdmin(adminId: string): Promise<DeleteResult> {
  try {
    // Check if admin exists
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return {
        ok: false,
        msg: 'المشرف غير موجود',
      };
    }

    // Check if admin has any related data or is the last admin
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' },
    });

    if (adminCount <= 1) {
      return {
        ok: false,
        msg: 'لا يمكن حذف آخر مشرف في النظام',
      };
    }

    // Delete admin
    await prisma.user.delete({
      where: { id: adminId },
    });

    revalidatePath('/dashboard/management-users/admin');
    return {
      ok: true,
      msg: 'تم حذف المشرف بنجاح',
    };
  } catch (error) {
    console.error('Error deleting admin:', error);
    return {
      ok: false,
      msg: 'حدث خطأ أثناء حذف المشرف',
    };
  }
} 