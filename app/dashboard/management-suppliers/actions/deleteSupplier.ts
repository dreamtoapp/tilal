'use server';
import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { revalidateTag } from 'next/cache';

export async function deleteSupplier(supplierId: string) {
  try {
    // Check if the supplier has any associated products
    const relatedProduct = await db.product.findFirst({
      where: { supplierId: supplierId },
    });

    if (relatedProduct) {
      throw new Error('لا يمكن حذف المورد لأنه مرتبط بمنتجات حالية. يرجى حذف منتجات المورد أولاً أو إعادة تعيينها لمورد آخر.');
    }

    // If no related products, proceed with deletion
    await db.supplier.delete({
      where: { id: supplierId },
    });

    revalidateTag('suppliers');
    revalidatePath('/dashboard/suppliers');
    // Potentially revalidate other paths if supplier info is displayed elsewhere

    return { success: true, message: 'تم حذف المورد بنجاح.' };
  } catch (error: unknown) {
    console.error('Error deleting supplier:', error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'حدث خطأ غير متوقع أثناء حذف المورد.' };
  }
}
