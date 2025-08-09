'use server';
import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { revalidateTag } from 'next/cache';

export async function deleteProduct(productId: string) {
  try {
    // First check if the product exists
    const product = await db.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error('المنتج غير موجود');
    }

    // Check for related transactions (order items)
    const relatedOrderItem = await db.orderItem.findFirst({ where: { productId } });
    if (relatedOrderItem) {
      throw new Error('لا يمكن حذف المنتج لأنه مرتبط بمعاملات أو طلبات.');
    }

    await db.product.delete({ where: { id: productId } });
    revalidateTag('products');
    revalidatePath('/dashboard/products-control');
    revalidatePath('/dashboard/products'); // Revalidate the supplier-specific product list page
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('حدث خطأ أثناء حذف المنتج');
  }
}
