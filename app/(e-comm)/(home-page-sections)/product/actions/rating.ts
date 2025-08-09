'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { auth } from '@/auth';
import { ORDER_STATUS } from '@/constant/order-status';
import db from '@/lib/prisma';

// Validation schema for rating submission
const ratingSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(3).max(500),
});

// Type for the response
type RatingResponse = {
  success: boolean;
  message: string;
  isPurchaseVerified?: boolean;
};

/**
 * Verify if a user has purchased a product
 */
export async function verifyUserPurchase(productId: string): Promise<boolean> {
  try {
    const session = await auth();
    if (!session?.user?.id) return false;

    // Find orders by this user that contain this product and are delivered
    const orders = await db.order.findMany({
      where: {
        customerId: session.user.id,
        status: ORDER_STATUS.DELIVERED, // Only count completed orders
      },
      include: {
        items: {
          where: {
            productId: productId,
          },
        },
      },
    });

    // Check if any order contains the product
    return orders.some((order) => order.items.length > 0);
  } catch (error) {
    console.error('Error verifying purchase:', error);
    return false;
  }
}

/**
 * Submit a product rating
 */
export async function submitProductRating(formData: {
  productId: string;
  rating: number;
  comment: string;
}): Promise<RatingResponse> {
  try {
    // Validate input
    const validatedData = ratingSchema.parse(formData);

    // Get current user
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول لإضافة تقييم',
      };
    }

    // Verify purchase (optional - can be enabled/disabled)
    const hasPurchased = await verifyUserPurchase(validatedData.productId);

    // Check if the product exists
    const product = await db.product.findUnique({
      where: { id: validatedData.productId },
    });

    if (!product) {
      return {
        success: false,
        message: 'المنتج غير موجود',
      };
    }

    // Check if the user has already reviewed this product
    const existingReview = await db.review.findFirst({
      where: {
        userId: session.user.id,
        productId: validatedData.productId,
      },
    });

    if (existingReview) {
      // Update the existing review
      await db.review.update({
        where: { id: existingReview.id },
        data: {
          rating: validatedData.rating,
          comment: validatedData.comment,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create a new review
      await db.review.create({
        data: {
          userId: session.user.id,
          productId: validatedData.productId,
          rating: validatedData.rating,
          comment: validatedData.comment,
          isVerified: hasPurchased,
        },
      });
    }

    // Update the product's average rating
    await updateProductRating(validatedData.productId);

    // Get the product to find its slug
    const productWithSlug = await db.product.findUnique({
      where: { id: validatedData.productId },
      select: { slug: true },
    });

    // Revalidate the product page and any pages that show this product
    if (productWithSlug?.slug) {
      revalidatePath(`/product/${productWithSlug.slug}`);
    } else {
      revalidatePath(`/product/${validatedData.productId}`);
    }
    revalidatePath('/');

    return {
      success: true,
      message: existingReview ? 'تم تحديث تقييمك بنجاح' : 'تم إضافة تقييمك بنجاح',
      isPurchaseVerified: hasPurchased,
    };
  } catch (error) {
    console.error('Error submitting rating:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'بيانات غير صالحة، يرجى التحقق من المدخلات',
      };
    }

    return {
      success: false,
      message: 'حدث خطأ أثناء إضافة التقييم',
    };
  }
}

/**
 * Get reviews for a specific product
 */
export async function getProductReviews(productId: string) {
  try {
    const reviews = await db.review.findMany({
      where: {
        productId: productId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return [];
  }
}

/**
 * Get reviews by a specific user
 */
export async function getUserReviews(userId: string) {
  try {
    const reviews = await db.review.findMany({
      where: {
        userId: userId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return [];
  }
}

/**
 * Update a product's average rating based on all reviews
 */
async function updateProductRating(productId: string): Promise<void> {
  try {
    // Get all reviews for this product
    const reviews = await db.review.findMany({
      where: {
        productId: productId,
      },
      select: {
        rating: true,
      },
    });

    // Calculate the average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    // Update the product
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        rating: averageRating,
        reviewCount: reviews.length,
      },
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
}
