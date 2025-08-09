'use client';
import { Star } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils';

// Removed DUMMY_PRODUCT_RATINGS import
// import { DUMMY_PRODUCT_RATINGS } from '@/constant/DUMMY_PRODUCT_RATINGS';

// Define the expected prop type, matching ReviewsAnalytics from ClientAnalyticsDashboard
interface ReviewItem {
    id: string;
    user: string;
    rating: number;
    comment: string;
    createdAt: string; // Assuming ISO string date
}

interface ReviewsDataProps {
    list: ReviewItem[];
    average: number;
    count: number;
}

interface ProductRatingsSectionProps {
    reviewsData?: ReviewsDataProps; // Make it optional in case analytics doesn't return it
}

export default function ProductRatingsSection({ reviewsData }: ProductRatingsSectionProps) {
    // Use reviewsData if available, otherwise provide a fallback or handle empty state
    const ratings = reviewsData || { list: [], average: 0, count: 0 };

    const filledStarColor = "text-yellow-500 fill-yellow-500";
    const emptyStarColor = "text-muted-foreground fill-muted";

    if (!reviewsData || reviewsData.count === 0) {
        return (
            <div className='mt-8 rounded-xl bg-card p-6 shadow'>
                <h2 className='mb-4 flex items-center gap-2 text-xl font-bold text-primary'>
                    <Star className={iconVariants({ size: 'md', className: filledStarColor })} /> تقييمات العملاء
                </h2>
                <div className='rounded bg-muted p-3 text-center text-sm text-muted-foreground'>
                    لا توجد تقييمات متاحة بعد لهذا المنتج.
                </div>
            </div>
        );
    }

    return (
        <div className='mt-8 rounded-xl bg-card p-6 shadow'>
            <h2 className='mb-4 flex items-center gap-2 text-xl font-bold text-primary'>
                <Star className={iconVariants({ size: 'md', className: filledStarColor })} /> تقييمات العملاء ({ratings.count})
            </h2>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col items-start gap-1'>
                    <div className='flex items-center gap-1'>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                                key={i}
                                className={iconVariants({
                                    size: 'sm', // Slightly larger for average display
                                    className: i <= Math.round(ratings.average)
                                        ? filledStarColor
                                        : emptyStarColor
                                })}
                            />
                        ))}
                        <span className='ml-2 text-lg font-semibold text-foreground'>
                            {ratings.average.toFixed(1)} <span className="text-sm text-muted-foreground">من 5</span>
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">بناءً على {ratings.count} تقييمات</p>
                </div>
                <div className='mt-4 flex flex-col gap-3'>
                    {ratings.list.map((review) => (
                        <div key={review.id} className='rounded-lg border border-border bg-muted/30 p-4'>
                            <div className='mb-2 flex items-center justify-between'>
                                <div className="flex items-center gap-2">
                                    <span className='text-md font-semibold text-foreground'>{review.user}</span>
                                    <div className='flex items-center gap-0.5'>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star key={star} className={iconVariants({ size: 'xs', className: star <= review.rating ? filledStarColor : emptyStarColor })} />
                                        ))}
                                    </div>
                                </div>
                                <span className='text-xs text-muted-foreground'>
                                    {new Date(review.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                            <p className='text-sm text-foreground/90 whitespace-pre-wrap'>{review.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 