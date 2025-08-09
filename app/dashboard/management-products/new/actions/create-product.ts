'use server';
import { revalidatePath } from 'next/cache';
import { revalidateTag } from 'next/cache';
import db from '@/lib/prisma';
import { Slugify } from '../../../../../utils/slug';

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  supplierId: string;
  categoryIds: string[];
  published?: boolean;
  outOfStock?: boolean;
  requiresShipping?: boolean;
  hasQualityGuarantee?: boolean;
  manageInventory?: boolean;
}

export async function createProduct(data: CreateProductInput) {
  // Validate categories
  if (!data.categoryIds || data.categoryIds.length === 0) {
    return { success: false, message: "يجب اختيار صنف واحد على الأقل للمنتج." };
  }

  try {
    // Generate a base slug from the product name
    const baseSlug = Slugify(data.name);
    
    // Find existing products with similar slugs to ensure uniqueness
    const existingProducts = await db.product.findMany({
      where: {
        slug: {
          startsWith: baseSlug
        }
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

    // Create the product
    const newProduct = await db.product.create({
      data: {
        name: data.name,
        slug: uniqueSlug,
        price: data.price,
        details: data.description,
        supplierId: data.supplierId,
        published: data.published ?? false,
        outOfStock: data.outOfStock ?? false,
        requiresShipping: data.requiresShipping ?? true,
        hasQualityGuarantee: data.hasQualityGuarantee ?? true,
        manageInventory: data.manageInventory ?? true,
      },
    });

    revalidateTag('products');

    // Link product to categories
    await db.categoryProduct.createMany({
      data: data.categoryIds.map(categoryId => ({
        productId: newProduct.id,
        categoryId,
      })),
    });

    revalidatePath('/dashboard/management-products');
    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/products-control');

    return { success: true, message: 'تم إنشاء المنتج بنجاح' };
  } catch (error: unknown) {
    console.error('Error creating product:', error);
    let userFriendlyMessage = "حدث خطأ غير متوقع أثناء إنشاء المنتج. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.";
    if (error instanceof Error && (error as any)?.code === 'P2002') {
      userFriendlyMessage = "يوجد منتج آخر بنفس الاسم أو البيانات الفريدة.";
    }
    return { success: false, message: userFriendlyMessage };
  }
}
