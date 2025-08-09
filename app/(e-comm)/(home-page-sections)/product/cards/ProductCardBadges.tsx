'use client';
import { Product } from '@/types/databaseTypes';

interface ProductCardBadgesProps {
    product: Product;
}

export default function ProductCardBadges({ product }: ProductCardBadgesProps) {
    const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price;
    const discountPercentage = isOnSale && product.compareAtPrice
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0;

    if (!isOnSale) return null;

    return (
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
            {isOnSale && (
                <span className="rounded-lg bg-destructive px-2.5 py-1 text-[10px] font-bold text-destructive-foreground shadow-sm">
                    -{discountPercentage}%
                </span>
            )}
        </div>
    );
} 