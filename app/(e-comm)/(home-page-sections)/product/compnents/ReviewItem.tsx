import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import RatingDisplay from '../../../(adminPage)/user/ratings/components/RatingDisplay';

interface ReviewItemProps {
  review: any;
}

export default function ReviewItem({ review }: ReviewItemProps) {
  return (
    <div className='border-b border-border pb-6 last:border-0'>
      <div className='flex items-start gap-4'>
        <div className='relative h-10 w-10 overflow-hidden rounded-full bg-muted'>
          {review.user?.image ? (
            <Image
              src={review.user.image}
              alt={review.user.name || 'مستخدم'}
              fill
              className='object-cover'
            />
          ) : (
            <span className='flex h-full w-full items-center justify-center text-xl font-medium'>
              {(review.user?.name || 'م')[0]}
            </span>
          )}
        </div>
        <div className='flex-1'>
          <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h4 className='font-medium'>{review.user?.name || 'مستخدم'}</h4>
              <div className='mt-1 flex items-center gap-2'>
                <RatingDisplay rating={review.rating} showCount={false} size='sm' />
                {review.isVerified && (
                  <Badge
                    variant='outline'
                    className='border-green-300 bg-green-100 text-green-800'
                  >
                    مشتري مؤكد
                  </Badge>
                )}
              </div>
            </div>
            <div className='text-xs text-muted-foreground'>
              {new Date(review.createdAt).toLocaleDateString('ar-SA')}
            </div>
          </div>
          <p className='mt-3 text-muted-foreground'>{review.comment}</p>
        </div>
      </div>
    </div>
  );
} 