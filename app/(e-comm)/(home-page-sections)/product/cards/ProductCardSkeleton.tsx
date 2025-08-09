'use client';
import { Card } from '@/components/ui/card';
import { memo } from 'react';

interface ProductCardSkeletonProps {
    className?: string;
    showActions?: boolean;
}

const ProductCardSkeleton = memo(({ className, showActions = true }: ProductCardSkeletonProps) => {
    return (
        <Card
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/95 shadow-xl border-none min-h-[220px] sm:min-h-[320px] w-full max-w-sm mx-auto flex flex-col animate-pulse ${className || ''}`}
            role="status"
            aria-label="تحميل معلومات المنتج"
        >
            {/* Media Section Skeleton */}
            <div className="relative h-36 sm:h-48 w-full overflow-hidden rounded-t-2xl p-1 shadow-lg border flex items-center justify-center bg-muted">
                {/* Quick view button (top-right) */}
                <div className="absolute top-2 right-2 z-30 flex flex-col gap-2 rounded-xl p-1">
                    <div className="w-8 h-8 bg-muted-foreground/20 rounded-full" />
                </div>
                {/* Badge (top-left) */}
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
                    <div className="w-12 h-5 bg-destructive/30 rounded-lg" />
                </div>
                {/* Image skeleton */}
                <div className="absolute inset-0 z-10 h-full w-full rounded-t-2xl bg-gradient-to-r from-primary/20 via-muted/80 to-primary/20 animate-pulse" />
            </div>

            {/* Content Section Skeleton */}
            <div className="flex-1 flex flex-col p-3 sm:p-5 gap-3">
                {/* Product Name & Price */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="h-5 bg-muted-foreground/20 rounded w-3/4" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-6 bg-muted-foreground/20 rounded w-20" />
                        <div className="h-4 bg-muted-foreground/10 rounded w-14" />
                    </div>
                </div>
                {/* Footer: rating, review, preview, details button */}
                <div className="pt-2 flex flex-row justify-between items-center">
                    <div className="flex items-center justify-center gap-4 text-sm">
                        {/* Rating */}
                        <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-yellow-200/40 rounded" />
                            <div className="h-4 w-8 bg-muted-foreground/20 rounded" />
                        </div>
                        {/* Review count */}
                        <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-muted-foreground/20 rounded" />
                            <div className="h-4 w-6 bg-muted-foreground/20 rounded" />
                        </div>
                        {/* Preview count */}
                        <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-primary/30 rounded" />
                            <div className="h-4 w-8 bg-muted-foreground/20 rounded" />
                        </div>
                    </div>
                    {/* Details button */}
                    <div className="inline-flex items-center gap-1 rounded-md border border-primary text-primary px-3 py-1 text-xs font-semibold shadow-sm bg-transparent">
                        <div className="w-4 h-4 bg-green-200/40 rounded" />
                        <div className="h-4 w-16 bg-muted-foreground/20 rounded" />
                    </div>
                </div>
                {/* Actions Section Skeleton */}
                {showActions && (
                    <div className="flex flex-col gap-3 mt-auto">
                        {/* Simulate add to cart button or quantity controls */}
                        <div className="w-full h-10 bg-muted-foreground/20 rounded-md" />
                    </div>
                )}
            </div>
            <span className="sr-only">جاري تحميل بيانات المنتج...</span>
        </Card>
    );
});

ProductCardSkeleton.displayName = 'ProductCardSkeleton';

export default ProductCardSkeleton; 