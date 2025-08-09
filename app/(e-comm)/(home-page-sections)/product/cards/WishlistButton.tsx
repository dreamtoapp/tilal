'use client';

import {
  startTransition,
  useEffect,
  useState,
} from 'react';

import { Icon } from '@/components/icons/Icon';
import { toast } from 'sonner';

import {
  addToWishlist,
  isProductInWishlist,
  removeFromWishlist,
} from '@/app/(e-comm)/(home-page-sections)/product/actions/wishlist';
import { getCachedWishlist, setCachedWishlist } from '@/lib/cache/wishlist';
import {
  cn,
} from '@/lib/utils';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showBackground?: boolean;
}

export default function WishlistButton({
  productId,
  className,
  size = 'md',
  showBackground = true,
}: WishlistButtonProps) {
  // Remove context usage, use only local state and server actions
  const cached = getCachedWishlist(productId);
  const [isInWishlist, setIsInWishlist] = useState<boolean>(cached ?? false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(cached === undefined);
  const [hydrated, setHydrated] = useState(typeof window !== 'undefined');
  useEffect(() => setHydrated(true), []);

  const bgSize = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }[size];

  useEffect(() => {
    if (cached !== undefined) return; // already cached
    const checkWishlist = async () => {
      try {
        const result = await isProductInWishlist(productId);
        setIsInWishlist(result);
        setCachedWishlist(productId, result);
      } catch (error) {
        console.error('Error checking wishlist:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    checkWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleToggleWishlist = () => {
    if (isLoading) return;
    startTransition(() => {
      setIsLoading(true);
      const action = isInWishlist ? removeFromWishlist : addToWishlist;
      action(productId)
        .then((result: any) => {
          if (result.success) {
            setIsInWishlist(!isInWishlist);
            setCachedWishlist(productId, !isInWishlist);
          } else {
            toast.error(result.message || 'حدث خطأ');
          }
        })
        .catch((err: any) => {
          console.error(err);
          toast.error('حدث خطأ أثناء تحديث المفضلة');
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  };

  // Determine visual state: during initial fetch show outline (not filled)
  const renderFilled = hydrated && isInWishlist;

  return (
    <button
      data-analytics-id="wishlist-toggle"
      data-analytics-product-id={productId}
      onClick={handleToggleWishlist}
      disabled={isLoading || isInitializing}
      className={cn(
        'relative flex items-center justify-center rounded-full transition-all duration-200',
        bgSize,
        isLoading && 'opacity-70',
        className,
      )}
      aria-label={isInWishlist ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
    >
      {showBackground && (
        <div
          className={cn(
            'absolute inset-0 -z-10 rounded-full bg-card shadow-sm backdrop-blur-sm',
            isInWishlist && 'bg-destructive/10',
          )}
        />
      )}
      <span className="flex h-full w-full items-center justify-center">
        <Icon
          name="Heart"
          size={size}
          variant={renderFilled ? 'destructive' : 'muted'}
          animation={isLoading ? 'pulse' : renderFilled ? 'bounce' : 'none'}
          className={cn(
            'transition-all duration-200',
            renderFilled ? 'fill-current stroke-current drop-shadow-lg text-destructive' : 'stroke-current text-muted-foreground',
            'hover:bg-card/90'
          )}
          aria-label={isInWishlist ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          suppressHydrationWarning
        />
      </span>
    </button>
  );
}
