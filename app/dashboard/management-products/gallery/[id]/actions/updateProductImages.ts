'use server';

import { revalidatePath } from 'next/cache';
import db from '@/lib/prisma';

export interface UpdateProductImagesInput {
  productId: string;
  mainImageUrl?: string;
  galleryImages?: string[];
}

export async function updateProductMainImage(productId: string, mainImageUrl: string) {
  try {
    await db.product.update({
      where: { id: productId },
      data: { imageUrl: mainImageUrl },
    });

    // Revalidate relevant paths
    revalidatePath('/dashboard/management-products');
    revalidatePath(`/dashboard/management-products/gallery/${productId}`);
    revalidatePath('/product');

    return { success: true, message: 'تم تحديث الصورة الرئيسية بنجاح' };
  } catch (error) {
    console.error('Error updating main image:', error);
    return { success: false, message: 'حدث خطأ أثناء تحديث الصورة الرئيسية' };
  }
}

export async function updateProductGallery(productId: string, galleryImages: string[]) {
  try {
    await db.product.update({
      where: { id: productId },
      data: { images: galleryImages },
    });

    // Revalidate relevant paths
    revalidatePath('/dashboard/management-products');
    revalidatePath(`/dashboard/management-products/gallery/${productId}`);

    return { success: true, message: 'تم تحديث معرض الصور بنجاح' };
  } catch (error) {
    console.error('Error updating gallery:', error);
    return { success: false, message: 'حدث خطأ أثناء تحديث معرض الصور' };
  }
}

export async function setAsMainImageFromGallery(productId: string, imageUrl: string, allImages: string[]) {
  try {
    // Ensure the main image is in the gallery array
    const updatedGallery = allImages.includes(imageUrl) 
      ? allImages 
      : [imageUrl, ...allImages];

    await db.product.update({
      where: { id: productId },
      data: { 
        imageUrl: imageUrl,
        images: updatedGallery
      },
    });

    // Revalidate relevant paths
    revalidatePath('/dashboard/management-products');
    revalidatePath(`/dashboard/management-products/gallery/${productId}`);
    revalidatePath('/product');

    return { success: true, message: 'تم تعيين الصورة كصورة رئيسية بنجاح' };
  } catch (error) {
    console.error('Error setting main image:', error);
    return { success: false, message: 'حدث خطأ أثناء تعيين الصورة الرئيسية' };
  }
}

export async function removeImageFromGallery(productId: string, imageUrl: string, allImages: string[]) {
  try {
    const updatedGallery = allImages.filter(img => img !== imageUrl);
    
    // Get current product to check if we're deleting the main image
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { imageUrl: true }
    });

    const updateData: any = { images: updatedGallery };
    
    // If we're deleting the main image, set a new main image or null
    if (product?.imageUrl === imageUrl) {
      updateData.imageUrl = updatedGallery.length > 0 ? updatedGallery[0] : null;
    }

    await db.product.update({
      where: { id: productId },
      data: updateData,
    });

    // Revalidate relevant paths
    revalidatePath('/dashboard/management-products');
    revalidatePath(`/dashboard/management-products/gallery/${productId}`);
    revalidatePath('/product');

    return { success: true, message: 'تم حذف الصورة بنجاح' };
  } catch (error) {
    console.error('Error removing image:', error);
    return { success: false, message: 'حدث خطأ أثناء حذف الصورة' };
  }
} 