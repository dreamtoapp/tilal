"use client";
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { Icon } from '@/components/icons/Icon';
import type { Product } from '@/types/databaseTypes';
import ProductCardBadges from './ProductCardBadges';
// Compare feature is postponed; component temporarily disabled
// import CompareButton from './CompareButton';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import QuickViewModalContent from './QuickViewModalContent';

interface ProductCardMediaProps {
    product: Product;
    inCart: boolean;
    isOutOfStock: boolean;
    lowStock: boolean;
    stockQuantity?: number | null;
    priority?: boolean;
}

export default function ProductCardMedia({ product, inCart, isOutOfStock, lowStock, stockQuantity, priority }: ProductCardMediaProps) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const formatNum = (n: number) => n.toLocaleString('ar-EG');
    const ratingFormatted = product.rating ? formatNum(Number(product.rating.toFixed(1))) : null;

    // Optimized image source with fallback
    const imgSrc = useCallback(() => {
        if (imageError) return '/fallback/product-fallback.avif';
        return product.imageUrl || '/fallback/product-fallback.avif';
    }, [product.imageUrl, imageError]);

    const handleImageError = useCallback(() => {
        setImageError(true);
        setImageLoading(false);
    }, []);

    const handleImageLoad = useCallback(() => {
        setImageLoading(false);
    }, []);

    return (
        <div className="relative h-36 sm:h-48 w-full overflow-hidden rounded-t-2xl p-1 shadow-lg border  flex items-center justify-center">
            {/* Icon actions: wishlist and quick view, top-right */}
            <div className="absolute top-2 right-2 z-30 flex flex-col gap-2  rounded-xl p-1 ">
                {/* <WishlistButton productId={product.id} /> */}
                <Button
                    variant="secondary"
                    size="icon"
                    aria-label={`معاينة سريعة لـ ${product.name}`}
                    onClick={e => {
                        e.stopPropagation();
                        setOpen(true);
                        // Debug: confirm which product opens the modal
                    }}

                >
                    <Eye className="w-4 h-4 text-primary     hover:text-primary/80 transition-colors duration-300" />
                </Button>
            </div>
            {/* Loading state */}
            {imageLoading && (
                <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-t-2xl bg-gradient-to-r from-primary/20 via-muted/80 to-primary/20 animate-pulse [mask-image:linear-gradient(90deg,transparent,white,transparent)]" />
            )}

            {/* Product image with optimized loading */}
            <Image
                src={imgSrc()}
                alt={product.name}
                fill
                className={`object-cover w-full h-full rounded-t-2xl transition-all duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading={priority ? 'eager' : 'lazy'}
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJyBoZWlnaHQ9JzEwMCcgdmlld0JveD0nMCAwIDEwMCAxMDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsbD0nI2ZmZicvPjwvc3ZnPg=="
                onError={handleImageError}
                onLoad={handleImageLoad}
                priority={priority}
                quality={75}
                unoptimized={imageError} // Skip optimization for fallback images
            />

            {/* Image error fallback */}
            {imageError && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-muted/50">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Icon name="ImageOff" size="lg" />
                        <span className="text-xs">صورة غير متوفرة</span>
                    </div>
                </div>
            )}

            {/* In cart check */}
            {inCart && (
                <div className="absolute left-3 bottom-3 z-30 rounded-full bg-success p-2 text-success-foreground shadow-lg animate-in fade-in-0 zoom-in-95 duration-300">
                    <Icon name="Check" size="md" />
                </div>
            )}

            {/* Low stock badge */}
            {lowStock && (
                <div className="absolute top-3 left-3 z-30 flex items-center gap-1 rounded-lg bg-warning/90 px-2.5 py-1.5 text-warning-foreground shadow-md">
                    <Icon name="AlertTriangle" size="xs" />
                    <span className="text-[10px] font-semibold">متبقي {stockQuantity}</span>
                </div>
            )}

            {/* Out of stock overlay */}
            {isOutOfStock && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <span className="rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground">غير متوفر</span>
                </div>
            )}

            {/* QuickView Modal: Only rendered when open */}
            {open && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <QuickViewModalContent product={product} ratingFormatted={ratingFormatted} formatNum={formatNum} setOpen={setOpen} />
                </Dialog>
            )}
            {/* Sale / New badges */}
            <ProductCardBadges product={product} />
        </div>
    );
} 