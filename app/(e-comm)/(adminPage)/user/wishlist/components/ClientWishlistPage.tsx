"use client";
import { useState, Suspense } from "react";
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import WishlistStatistics from './WishlistStatistics';
import WishlistProductCard from './WishlistProductCard';
import EmptyWishlist from './EmptyWishlist';

export default function ClientWishlistPage({ initialProducts }: { initialProducts: any[] }) {
    const [products, setProducts] = useState(initialProducts);
    const handleRemove = (id: string) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };
    return (
        <div className='container mx-auto max-w-7xl py-8 px-4'>
            {/* Enhanced Header */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-feature-products/10 border border-feature-products/20">
                            <Heart className="w-8 h-8 text-feature-products" />
                        </div>
                        <div>
                            <h1 className='text-3xl lg:text-4xl font-bold text-foreground'>قائمة المفضلة</h1>
                            <p className="text-muted-foreground mt-1">المنتجات التي أعجبتك</p>
                        </div>
                    </div>
                    {products.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-feature-products/10 text-feature-products border-feature-products/20">
                                {products.length} منتج
                            </Badge>
                        </div>
                    )}
                </div>
                {/* Statistics */}
                {products.length > 0 && <WishlistStatistics products={products} />}
            </div>
            {/* Main Content */}
            <Suspense fallback={<></>}>
                {products.length === 0 ? (
                    <EmptyWishlist />
                ) : (
                    <div className="space-y-6">
                        {/* Products Grid */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">منتجاتك المفضلة ({products.length})</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product, index) => (
                                    <WishlistProductCard key={product.id} product={product} index={index} onRemove={handleRemove} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Suspense>
        </div>
    );
} 