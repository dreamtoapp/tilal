'use server';
import { revalidatePath, revalidateTag } from 'next/cache';

import db from '@/lib/prisma'; // Adjusted path
import { Slugify } from '../../../../../utils/slug';
 

export interface UpdateProductInput {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  size?: string;
  supplierId?: string;
  categoryIds?: string[];
  published?: boolean;
  outOfStock?: boolean;
  requiresShipping?: boolean;
  hasQualityGuarantee?: boolean;
  manageInventory?: boolean;
  slug?: string;
}

export async function updateProduct(data: UpdateProductInput) {
  const { id, categoryIds, description, ...update } = data;

  try {
    // Prepare update data - map description to details field
    let updateData = {
      ...update,
      ...(description && { details: description }),
    };

    // If name is being updated, generate a new unique slug
    if (data.name) {
      const baseSlug = Slugify(data.name);
      
      // Find existing products with similar slugs (excluding current product)
      const existingProducts = await db.product.findMany({
        where: {
          AND: [
            { slug: { startsWith: baseSlug } },
            { id: { not: id } }
          ]
        },
        select: { slug: true }
      });
      
      // Generate a unique slug
      let uniqueSlug = baseSlug;
      let counter = 1;
      const existingSlugs = existingProducts.map(p => p.slug);
      
      while (existingSlugs.includes(uniqueSlug)) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      updateData = { ...updateData, slug: uniqueSlug };
    }

    // Update the product fields
    await db.product.update({
      where: { id },
      data: updateData,
    });
    revalidateTag('products');

    // If categoryIds are provided, update the relations
    if (categoryIds) {
      // Remove old relations
      await db.categoryProduct.deleteMany({ where: { productId: id } });
      // Add new relations
      await db.categoryProduct.createMany({
        data: categoryIds.map(categoryId => ({
          productId: id,
          categoryId,
        })),
      });
    }

    revalidatePath('/dashboard/management-products');
    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/products-control');
    revalidatePath('/');

    return { success: true, message: 'تم تحديث المنتج بنجاح' };
  } catch (error: unknown) {
    console.error('Error updating product:', error);
    let userFriendlyMessage = "حدث خطأ غير متوقع أثناء تحديث المنتج. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.";
    if (error instanceof Error && (error as any)?.code === 'P2002') {
      userFriendlyMessage = "يوجد منتج آخر بنفس الاسم أو البيانات الفريدة.";
    }
    return { success: false, message: userFriendlyMessage };
  }
}
