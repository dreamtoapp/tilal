import {
  TabsContent,
} from '@/components/ui/tabs';
import RateProductButton from './RateProductButton';
import EmptyReviews from './EmptyReviews';
import ReviewItem from './ReviewItem';

interface ReviewsTabProps {
  reviews: any[];
  session: any;
  product: any;
  mainImage: string;
}

export default function ReviewsTab({ reviews, session, product, mainImage }: ReviewsTabProps) {
  return (
    <TabsContent value='reviews' id='reviews' className='py-4'>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-medium'>تقييمات المنتج</h3>
          {session?.user && (
            <RateProductButton
              productId={product.id}
              productName={product.name}
              productImage={mainImage}
            />
          )}
        </div>
        {reviews.length === 0 ? (
          <EmptyReviews session={session} product={product} mainImage={mainImage} />
        ) : (
          <div className='space-y-6'>
            {reviews.map((review: any) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </TabsContent>
  );
} 