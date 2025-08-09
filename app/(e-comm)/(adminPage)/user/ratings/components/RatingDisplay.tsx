'use client';
import { iconVariants } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/icons/Icon';
import RatingPreview from './RatingPreview';

interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
  productId?: string;
  productSlug?: string;
}

export default function RatingDisplay({
  rating,
  reviewCount = 0,
  size = 'md',
  showCount = true,
  className,
  productId,
  productSlug,
}: RatingDisplayProps) {
  const safeRating = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 >= 0.5;
  const iconSize = {
    sm: 'xs' as const,
    md: 'sm' as const,
    lg: 'md' as const,
  }[size];
  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[size];
  if (productId && productSlug) {
    return (
      <RatingPreview
        productId={productId}
        productSlug={productSlug}
        rating={rating}
        reviewCount={showCount ? reviewCount : 0}
        size={size === 'lg' ? 'md' : 'sm'}
        className={className}
        disableLink={false}
      />
    );
  }
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className='flex'>
        {Array.from({ length: fullStars }).map((_, i) => (
          <Icon
            key={`full-${i}`}
            name="Star"
            size={iconSize}
            className={iconVariants({ size: iconSize, className: 'fill-amber-400 text-amber-400' })}
          />
        ))}
        {hasHalfStar && (
          <Icon
            key='half'
            name="StarHalf"
            size={iconSize}
            className={iconVariants({ size: iconSize, className: 'fill-amber-400 text-amber-400' })}
          />
        )}
        {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
          <Icon
            key={`empty-${i}`}
            name="Star"
            size={iconSize}
            className={iconVariants({ size: iconSize, className: 'text-gray-300' })}
          />
        ))}
      </div>
      {showCount && (
        <span className={cn('text-muted-foreground', textSize)}>
          {safeRating.toFixed(1)} ({reviewCount})
        </span>
      )}
    </div>
  );
}
