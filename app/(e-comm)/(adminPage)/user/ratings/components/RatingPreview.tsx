'use client';

import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/utils';
import Link from '@/components/link';

interface RatingPreviewProps {
  productId: string;
  productSlug: string; // Changed to mandatory string
  rating: number;
  reviewCount: number;
  size?: 'sm' | 'md';
  className?: string;
  disableLink?: boolean;
}

export default function RatingPreview({
  productId,
  productSlug,
  rating,
  reviewCount,
  size = 'sm',
  className,
  disableLink = false,
}: RatingPreviewProps) {
  // Round rating to nearest 0.5
  const roundedRating = Math.round(rating * 2) / 2;

  // Icon size based on the size prop
  const iconSize = size === 'sm' ? 14 : 16;

  // Generate stars array
  const stars = Array.from({ length: 5 }, (_, i) => {
    const starValue = i + 1;

    // Full star
    if (starValue <= roundedRating) {
      return 'full';
    }

    // Half star
    if (starValue - 0.5 === roundedRating) {
      return 'half';
    }

    // Empty star
    return 'empty';
  });

  // Common content for both link and non-link versions
  const ratingContent = (
    <>
      <div className='flex'>
        {stars.map((type, index) => (
          <Icon
            key={index}
            name="Star"
            size={iconSize <= 16 ? 'xs' : 'sm'}
            className={cn(
              'transition-colors',
              type === 'full' && 'fill-amber-400 text-amber-400',
              type === 'half' && 'fill-amber-400 text-amber-400', // For half star, fill color is same, clip-path handles visual
              type === 'empty' && 'text-gray-300', // Use a neutral color for empty
            )}
            style={{
              clipPath: type === 'half' ? 'inset(0 50% 0 0)' : undefined, // Apply clip-path only for half stars
            }}
            aria-hidden='true'
          />
        ))}
      </div>

      {reviewCount > 0 && (
        <span className={cn('text-muted-foreground', size === 'sm' ? 'text-xs' : 'text-sm')}>
          ({reviewCount})
        </span>
      )}
    </>
  );

  // Common class names
  const commonClassNames = cn(
    'flex items-center gap-1 hover:opacity-80 transition-opacity',
    className,
  );

  // Return either a link or a div based on the disableLink prop
  return disableLink ? (
    <div
      className={commonClassNames}
      aria-label={`${rating} out of 5 stars based on ${reviewCount} reviews.`}
    >
      {ratingContent}
    </div>
  ) : (
    <Link
      href={`/product/${productSlug || productId}`}
      className={commonClassNames}
      aria-label={`${rating} out of 5 stars based on ${reviewCount} reviews. Click to see product details.`}
    >
      {ratingContent}
    </Link>
  );
}
