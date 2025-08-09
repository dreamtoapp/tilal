"use server";
import db from '@/lib/prisma';

export async function incrementPreviewCount(productId: string) {
  await db.product.update({
    where: { id: productId },
    data: { previewCount: { increment: 1 } },
  });
} 