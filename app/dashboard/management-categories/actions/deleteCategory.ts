'use server';

import { revalidatePath } from 'next/cache';
import { revalidateTag } from 'next/cache';

import db from '@/lib/prisma';

export async function deleteCategory(categoryId: string) {
  try {
    const relatedCategory = await db.category.findUnique({
      where: { id: categoryId },
      include: { productAssignments: true },
    });

    if (!relatedCategory) {
      return {
        success: false,
        message: 'التصنيف غير موجود أو قد تم حذفه مسبقًا.',
      };
    }

    if (relatedCategory.productAssignments.length > 0) {
      throw new Error(
        'لا يمكن حذف التصنيف لأنه مرتبط بمنتجات حالية. يرجى حذف المنتجات أولاً أو إعادة تعيينها لتصنيف آخر.'
      );
    }

    await db.category.delete({
      where: { id: categoryId },
    });
    revalidateTag('categories');

    revalidatePath('/dashboard/management-categories');

    return { success: true, message: 'تم حذف التصنيف بنجاح.' };
  } catch (error: unknown) {
    console.error('Error deleting category:', error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return {
      success: false,
      message: 'حدث خطأ غير متوقع أثناء حذف التصنيف.',
    };
  }
}
