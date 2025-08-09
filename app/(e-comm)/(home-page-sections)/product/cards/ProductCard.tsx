'use client';
import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { Product } from '@/types/databaseTypes';
import ProductCardMedia from './ProductCardMedia';
import ProductCardActions from './ProductCardActions';
import { useRouter } from 'next/navigation';
import { Eye, MessageCircle, Star } from 'lucide-react';
import Link from '@/components/link';


interface ProductCardProps {
    product: Product;
    quantity: number;
    isInCart: boolean;
    className?: string;
    index?: number; // For analytics tracking
    priority?: boolean;
}

const ProductCard = memo(({
    product,
    quantity,
    isInCart,
    index,
    priority
}: ProductCardProps) => {
    const router = useRouter();
    const [currentCartState, setCurrentCartState] = useState(isInCart);

    // Memoized calculations for performance
    const stockInfo = useMemo(() => {
        const isOutOfStock = product.outOfStock
        const lowStock = !isOutOfStock && product.manageInventory && (product.stockQuantity ?? 0) > 0 && (product.stockQuantity ?? 0) <= 3;
        return { isOutOfStock, lowStock };
    }, [product.outOfStock, product.manageInventory, product.stockQuantity]);

    // Memoized pricing calculations
    const pricingInfo = useMemo(() => {
        const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
        const discountPercentage = hasDiscount && product.compareAtPrice
            ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
            : 0;
        return { hasDiscount, discountPercentage };
    }, [product.compareAtPrice, product.price]);

    // Sync internal cart state with prop changes
    useEffect(() => {
        setCurrentCartState(isInCart);
    }, [isInCart]);

    // Analytics tracking
    const trackProductView = useCallback(() => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'view_item', {
                currency: 'USD',
                value: product.price,
                items: [{
                    item_id: product.id,
                    item_name: product.name,
                    item_category: product.type,
                    price: product.price,
                    quantity: 1,
                    index: index
                }]
            });
        }
    }, [product, index]);

    // Keyboard navigation handler
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            trackProductView();
            router.push(`/product/${product.slug}`);
        }
    }, [router, product.slug, trackProductView]);

    // Structured data for SEO
    const structuredData = useMemo(() => ({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.details,
        "image": product.imageUrl,
        "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "USD",
            "availability": stockInfo.isOutOfStock ? "OutOfStock" : "InStock"
        }
    }), [product, stockInfo.isOutOfStock]);

    return (
        <>
            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <Card
                className={`group  relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/95 shadow-xl border-none min-h-[220px] sm:min-h-[320px] w-full max-w-sm mx-auto flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 card-hover-effect card-border-glow`}
                tabIndex={0}
                onKeyDown={handleKeyDown}
            >
                {/* Media Section */}
                <ProductCardMedia
                    product={product}
                    inCart={currentCartState}
                    isOutOfStock={stockInfo.isOutOfStock}
                    lowStock={stockInfo.lowStock}
                    stockQuantity={product.stockQuantity}
                    priority={priority}
                />
                {/* Content Section */}
                <div className="flex-1 flex flex-col p-3 sm:p-5 gap-3">
                    {/* Product Name & Type */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm leading-tight text-foreground group-hover:text-feature-products transition-colors duration-200 line-clamp-2" title={product.name}>
                                {product.name}
                            </h3>
                        </div>
                        {/* Price Section */}
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-feature-commerce">
                                {product.price.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}
                            </span>
                            {pricingInfo.hasDiscount && (
                                <span className="text-sm line-through text-muted-foreground">
                                    {product.compareAtPrice?.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR' })}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Footer: Compact, expert UI/UX */}
                    <div className="pt-2 text-center flex flex-row justify-between items-center">
                        <div className="flex items-center justify-center gap-4 text-sm">
                            {/* Rating: show only if exists */}
                            {typeof product.rating === 'number' && product.rating > 0 && (
                                <span className="flex items-center gap-1 text-yellow-500">
                                    <Star className="w-4 h-4 fill-current" fill="currentColor" />
                                    <span className="text-foreground font-medium">{product.rating}</span>
                                </span>
                            )}
                            {/* Comments: only if reviewCount > 0 */}
                            {product.reviewCount > 0 && (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <MessageCircle className="w-4 h-4" />
                                    {product.reviewCount}
                                </span>
                            )}
                            {/* Preview count */}
                            <span className="flex items-center gap-1 text-primary">
                                <Eye className="w-4 h-4" />
                                {product.previewCount}
                            </span>
                            {/* Details link as button with icon */}

                        </div>
                        <Link href={`/product/${product.slug}`} className="inline-flex items-center gap-1 rounded-md border border-primary text-primary px-3 py-1 text-xs font-semibold shadow-sm bg-transparent hover:bg-primary/10 transition-colors focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none">
                            <Icon name="Package" className="w-4 h-4 text-green-600" />
                            <span>صفحة المنتج</span>
                        </Link>
                    </div>
                    {/* Actions */}
                    <ProductCardActions
                        product={product}
                        quantity={quantity}
                        isOutOfStock={stockInfo.isOutOfStock}
                    />
                </div>
            </Card>
        </>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;