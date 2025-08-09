'use server';

import { auth } from '@/auth';
import db from '@/lib/prisma';
import { RatingType } from '@/constant/enums';
import { ORDER_STATUS } from '@/constant/order-status';
import { revalidatePath } from 'next/cache';

// Types for API responses
export type RatingResponse = {
  success: boolean;
  message: string;
  data?: any;
};

export type RateableProduct = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  orderId: string;
  orderDate: Date;
};

export type DeliveredOrder = {
  id: string;
  driverName: string;
  deliveryDate: Date;
  orderTotal: number;
  deliveredAt: string;
  driverId?: string;
};

/**
 * Get user's rateable products from completed orders
 */
export async function getUserRateableProducts(): Promise<RateableProduct[]> {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    // Get delivered orders with products that haven't been rated yet
    const orders = await db.order.findMany({
      where: {
        customerId: session.user.id,
        status: ORDER_STATUS.DELIVERED,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        deliveredAt: 'desc',
      },
    });

    // Get already rated products to exclude them
    const existingReviews = await db.review.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        productId: true,
      },
    });

    const ratedProductIds = new Set(existingReviews.map(r => r.productId));

    // Extract unique products that haven't been rated
    const rateableProducts: RateableProduct[] = [];
    const seenProductIds = new Set<string>();

    for (const order of orders) {
      for (const item of order.items) {
        // Add null check for item.product
        if (item.product && !ratedProductIds.has(item.product.id) && !seenProductIds.has(item.product.id)) {
          seenProductIds.add(item.product.id);
          rateableProducts.push({
            id: item.product.id,
            name: item.product.name,
            imageUrl: item.product.imageUrl || '/fallback/product-fallback.avif',
            price: item.product.price,
            orderId: order.id,
            orderDate: order.createdAt,
          });
        }
      }
    }

    return rateableProducts;
  } catch (error) {
    console.error('Error fetching rateable products:', error);
    return [];
  }
}

/**
 * Get user's delivered orders for driver rating
 */
export async function getUserDeliveredOrders(): Promise<DeliveredOrder[]> {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    // Get delivered orders that haven't been rated for delivery yet
    const orders = await db.order.findMany({
      where: {
        customerId: session.user.id,
        status: ORDER_STATUS.DELIVERED,
      },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        deliveredAt: 'desc',
      },
    });

    // Get already rated orders for delivery to exclude them
    const existingDeliveryRatings = await db.orderRating.findMany({
      where: {
        userId: session.user.id,
        type: RatingType.DELIVERY,
      },
      select: {
        orderId: true,
      },
    });

    const ratedOrderIds = new Set(existingDeliveryRatings.map(r => r.orderId));

    // Filter out already rated orders and format the response
    const deliveredOrders: DeliveredOrder[] = orders
      .filter(order => !ratedOrderIds.has(order.id))
      .map(order => ({
        id: order.id,
        driverName: order.driver?.name || 'غير محدد',
        deliveryDate: order.deliveredAt || order.updatedAt,
        orderTotal: order.amount,
        deliveredAt: getRelativeTime(order.deliveredAt || order.updatedAt),
        driverId: order.driver?.id,
      }));

    return deliveredOrders;
  } catch (error) {
    console.error('Error fetching delivered orders:', error);
    return [];
  }
}

/**
 * Submit a product rating
 */
export async function submitProductRating(data: {
  productId: string;
  rating: number;
  comment: string;
}): Promise<RatingResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول لإضافة تقييم',
      };
    }

    // Validate inputs
    if (!data.productId || data.rating < 1 || data.rating > 5 || data.comment.length < 3) {
      return {
        success: false,
        message: 'بيانات غير صالحة',
      };
    }

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      return {
        success: false,
        message: 'المنتج غير موجود',
      };
    }

    // Check if already reviewed
    const existingReview = await db.review.findFirst({
      where: {
        userId: session.user.id,
        productId: data.productId,
      },
    });

    if (existingReview) {
      return {
        success: false,
        message: 'لقد قمت بتقييم هذا المنتج من قبل',
      };
    }

    // Verify purchase
    const hasPurchased = await verifyUserPurchase(data.productId, session.user.id);

    // Create the review
    const review = await db.review.create({
      data: {
        userId: session.user.id,
        productId: data.productId,
        rating: data.rating,
        comment: data.comment,
        isVerified: hasPurchased,
      },
    });

    // Update product rating
    await updateProductRating(data.productId);

    // Revalidate pages
    revalidatePath('/user/ratings');
    revalidatePath('/');

    return {
      success: true,
      message: 'تم إضافة تقييمك بنجاح',
      data: review,
    };
  } catch (error) {
    console.error('Error submitting product rating:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إضافة التقييم',
    };
  }
}

/**
 * Submit a driver rating
 */
export async function submitDriverRating(data: {
  orderId: string;
  rating: number;
  comment: string;
}): Promise<RatingResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول لإضافة تقييم',
      };
    }

    // Validate inputs
    if (!data.orderId || data.rating < 1 || data.rating > 5 || data.comment.length < 3) {
      return {
        success: false,
        message: 'بيانات غير صالحة',
      };
    }

    // Check if order exists and belongs to user
    const order = await db.order.findFirst({
      where: {
        id: data.orderId,
        customerId: session.user.id,
        status: ORDER_STATUS.DELIVERED,
      },
    });

    if (!order) {
      return {
        success: false,
        message: 'الطلب غير موجود أو لم يتم توصيله بعد',
      };
    }

    // Check if already rated
    const existingRating = await db.orderRating.findFirst({
      where: {
        orderId: data.orderId,
        userId: session.user.id,
        type: RatingType.DELIVERY,
      },
    });

    if (existingRating) {
      return {
        success: false,
        message: 'لقد قمت بتقييم هذا السائق من قبل',
      };
    }

    // Create the rating
    const rating = await db.orderRating.create({
      data: {
        orderId: data.orderId,
        userId: session.user.id,
        rating: data.rating,
        comment: data.comment,
        type: RatingType.DELIVERY,
      },
    });

    // Revalidate pages
    revalidatePath('/user/ratings');

    return {
      success: true,
      message: 'تم إضافة تقييم السائق بنجاح',
      data: rating,
    };
  } catch (error) {
    console.error('Error submitting driver rating:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إضافة التقييم',
    };
  }
}

/**
 * Submit an app rating
 */
export async function submitAppRating(data: {
  feature: string;
  rating: number;
  comment: string;
}): Promise<RatingResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول لإضافة تقييم',
      };
    }

    // Validate inputs
    if (!data.feature || data.rating < 1 || data.rating > 5 || data.comment.length < 3) {
      return {
        success: false,
        message: 'بيانات غير صالحة',
      };
    }

    // For app ratings, we'll use a dummy order ID or create a special system
    // We can use the user's most recent order or create a system order
    let orderId = 'app-rating-system';

    // Try to get user's most recent order for context
    const recentOrder = await db.order.findFirst({
      where: {
        customerId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
      },
    });

    if (recentOrder) {
      orderId = recentOrder.id;
    }

    // Create the rating with feature info in comment
    const fullComment = `[${data.feature}] ${data.comment}`;

    const rating = await db.orderRating.create({
      data: {
        orderId: orderId,
        userId: session.user.id,
        rating: data.rating,
        comment: fullComment,
        type: RatingType.APP,
      },
    });

    // Revalidate pages
    revalidatePath('/user/ratings');

    return {
      success: true,
      message: 'تم إضافة تقييم المتجر بنجاح',
      data: rating,
    };
  } catch (error) {
    console.error('Error submitting app rating:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إضافة التقييم',
    };
  }
}

/**
 * Get user's driver ratings
 */
export async function getUserDriverRatings(userId: string) {
  try {
    const ratings = await db.orderRating.findMany({
      where: {
        userId: userId,
        type: RatingType.DELIVERY,
      },
      include: {
        order: {
          include: {
            driver: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ratings.map(rating => ({
      id: rating.id,
      orderId: rating.orderId,
      driverName: rating.order.driver?.name || 'غير محدد',
      rating: rating.rating,
      comment: rating.comment,
      createdAt: rating.createdAt,
      deliveryTime: getRelativeTime(rating.createdAt),
      orderTotal: rating.order.amount,
    }));
  } catch (error) {
    console.error('Error fetching driver ratings:', error);
    return [];
  }
}

/**
 * Get user's app ratings
 */
export async function getUserAppRatings(userId: string) {
  try {
    const ratings = await db.orderRating.findMany({
      where: {
        userId: userId,
        type: RatingType.APP,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ratings.map(rating => {
      // Extract feature from comment if it exists
      const commentMatch = rating.comment?.match(/^\[([^\]]+)\] (.+)$/);
      const feature = commentMatch ? commentMatch[1] : 'التجربة العامة';
      const actualComment = commentMatch ? commentMatch[2] : (rating.comment || '');

      return {
        id: rating.id,
        orderId: rating.orderId,
        rating: rating.rating,
        comment: actualComment,
        createdAt: rating.createdAt,
        category: feature,
      };
    });
  } catch (error) {
    console.error('Error fetching app ratings:', error);
    return [];
  }
}

// Helper functions

/**
 * Verify if user has purchased a product
 */
async function verifyUserPurchase(productId: string, userId: string): Promise<boolean> {
  try {
    const orders = await db.order.findMany({
      where: {
        customerId: userId,
        status: ORDER_STATUS.DELIVERED,
      },
      include: {
        items: {
          where: {
            productId: productId,
          },
        },
      },
    });

    return orders.some(order => order.items.length > 0);
  } catch (error) {
    console.error('Error verifying purchase:', error);
    return false;
  }
}

/**
 * Update product's average rating
 */
async function updateProductRating(productId: string): Promise<void> {
  try {
    const reviews = await db.review.findMany({
      where: {
        productId: productId,
      },
      select: {
        rating: true,
      },
    });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

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

/**
 * Get relative time string in Arabic
 */
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'اليوم';
  } else if (diffInDays === 1) {
    return 'أمس';
  } else if (diffInDays === 2) {
    return 'منذ يومين';
  } else if (diffInDays < 7) {
    return `منذ ${diffInDays} أيام`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? 'منذ أسبوع' : `منذ ${weeks} أسابيع`;
  } else {
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? 'منذ شهر' : `منذ ${months} شهور`;
  }
} 