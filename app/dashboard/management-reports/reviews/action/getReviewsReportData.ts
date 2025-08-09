'use server';
import db from '@/lib/prisma';
import { Prisma } from '@prisma/client'; // Keep Prisma import for RatingWhereInput if it becomes valid

export interface ReviewReportKpi {
  label: string;
  value: string | number;
}

export interface ReviewReportDataItem {
  id: string;
  productName: string | null;
  userName: string | null;
  rating: number;
  comment: string | null;
  createdAt: Date;
}

export interface RatingDistributionChartItem {
  name: string; // e.g., "5 Stars", "4 Stars"
  count: number;
}

export interface GetReviewsReportDataParams {
  from?: string;
  to?: string;
}

export async function getReviewsReportData({ from, to }: GetReviewsReportDataParams) {
  try {
    const dateFilter: Prisma.ReviewWhereInput = {}; // Use ReviewWhereInput
    if (from && to) {
      dateFilter.createdAt = {
        gte: new Date(from),
        lte: new Date(new Date(to).setDate(new Date(to).getDate() + 1)),
      };
    } else if (from) {
      dateFilter.createdAt = { gte: new Date(from) };
    } else if (to) {
      dateFilter.createdAt = { lte: new Date(new Date(to).setDate(new Date(to).getDate() + 1)) };
    }

    const reviews = await db.review.findMany({ // Use db.review
      where: dateFilter,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { name: true } },
        user: { select: { name: true } },
      },
    });

    const reportItems: ReviewReportDataItem[] = reviews.map((r) => ({ // r should be correctly typed now
      id: r.id,
      productName: r.product?.name || 'منتج غير معروف',
      userName: r.user?.name || 'مستخدم غير معروف',
      rating: r.rating,
      comment: r.comment ?? '', // Ensure comment is string, default to empty if null
      createdAt: r.createdAt,
    }));

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews)
      : 0;
    const positiveReviews = reviews.filter(r => r.rating >= 4).length;
    // const neutralReviews = reviews.filter(r => r.rating === 3).length; 
    const negativeReviews = reviews.filter(r => r.rating <= 2).length;

    const kpis: ReviewReportKpi[] = [
      { label: 'إجمالي التقييمات', value: totalReviews },
      { label: 'متوسط التقييم', value: averageRating.toFixed(1) + ' / 5' },
      { label: 'تقييمات إيجابية (4-5 نجوم)', value: positiveReviews },
      { label: 'تقييمات سلبية (1-2 نجوم)', value: negativeReviews },
    ];

    const ratingDistribution: RatingDistributionChartItem[] = [
      { name: '5 نجوم', count: reviews.filter(r => r.rating === 5).length },
      { name: '4 نجوم', count: reviews.filter(r => r.rating === 4).length },
      { name: '3 نجوم', count: reviews.filter(r => r.rating === 3).length },
      { name: '2 نجوم', count: reviews.filter(r => r.rating === 2).length },
      { name: '1 نجمة', count: reviews.filter(r => r.rating === 1).length }
    ];

    return {
      kpis,
      reviews: reportItems,
      ratingDistributionChart: ratingDistribution,
    };
  } catch (error) {
    console.error("Error fetching reviews report data:", error);
    // Return a generic error, specific model check is no longer needed if db.review is used
    return {
      kpis: [],
      reviews: [],
      ratingDistributionChart: [],
      error: "فشل في جلب بيانات تقرير التقييمات. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.",
    };
  }
}
