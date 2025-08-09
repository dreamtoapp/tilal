'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import db from '@/lib/prisma';

/**
 * Check if a product is in the user's wishlist
 */
export async function isProductInWishlist(productId: string): Promise<boolean> {
  try {
    const session = await auth();
    if (!session?.user?.id) return false;

    const wishlistItem = await db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    return !!wishlistItem;
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
}

/**
 * Add a product to the user's wishlist
 */
export async function addToWishlist(productId: string): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول لإضافة المنتج إلى المفضلة',
      };
    }

    // Check if the product exists
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return {
        success: false,
        message: 'المنتج غير موجود',
      };
    }

    // Check if the product is already in the wishlist
    const existingWishlistItem = await db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existingWishlistItem) {
      return {
        success: false,
        message: 'المنتج موجود بالفعل في المفضلة',
      };
    }

    // Add the product to the wishlist
    await db.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId,
      },
    });

    // Revalidate paths
    revalidatePath(`/product/${product.slug}`);
    revalidatePath('/user/wishlist');

    return {
      success: true,
      message: 'تمت إضافة المنتج إلى المفضلة',
    };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إضافة المنتج إلى المفضلة',
    };
  }
}

/**
 * Remove a product from the user's wishlist
 */
export async function removeFromWishlist(productId: string): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول لإزالة المنتج من المفضلة',
      };
    }

    // Check if the product is in the wishlist
    const wishlistItem = await db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (!wishlistItem) {
      return {
        success: false,
        message: 'المنتج غير موجود في المفضلة',
      };
    }

    // Get the product for its slug
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { slug: true },
    });

    // Remove the product from the wishlist
    await db.wishlistItem.delete({
      where: {
        id: wishlistItem.id,
      },
    });

    // Revalidate paths
    if (product?.slug) {
      revalidatePath(`/product/${product.slug}`);
    }
    revalidatePath('/user/wishlist');

    return {
      success: true,
      message: 'تمت إزالة المنتج من المفضلة',
    };
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إزالة المنتج من المفضلة',
    };
  }
}

/**
 * Get all products in the user's wishlist (detailed info for wishlist page)
 */
export async function getUserWishlist() {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    const wishlistItems = await db.wishlistItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          include: {
            supplier: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return wishlistItems.map((item) => ({
      ...item.product,
      details: item.product.details ?? null,
      size: item.product.size ?? null,
      inStock: !item.product.outOfStock,
      imageUrl: item.product.imageUrl || '/fallback/product-fallback.avif',
    }));
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
}

/**
 * Get all products in a specific user's wishlist (for admin or dynamic routes)
 */
export async function getWishlistByUserId(userId: string) {
  if (!userId) return [];
  const wishlistItems = await db.wishlistItem.findMany({
    where: { userId },
    include: {
      product: { include: { supplier: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return wishlistItems.map((item) => ({
    ...item.product,
    details: item.product.details ?? null,
    size: item.product.size ?? null,
    inStock: !item.product.outOfStock,
    imageUrl: item.product.imageUrl || '/fallback/product-fallback.avif',
  }));
} 