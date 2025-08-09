import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Link from '@/components/link';
import WishlistRemoveButtonWrapper from './WishlistRemoveButtonWrapper';
import RatingDisplay from '../../ratings/components/RatingDisplay';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export default function WishlistProductCard({ product, index, onRemove }: { product: any; index: number; onRemove?: (id: string) => void }) {
    const isOutOfStock = !product.inStock;
    return (
        <Card
            className="group relative overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={product.imageUrl || '/fallback/product-fallback.avif'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    draggable={false}
                />
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">غير متوفر</span>
                    </div>
                )}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
                    {product.isNew && (
                        <Badge className="bg-feature-analytics text-white border-0">جديد</Badge>
                    )}
                    {product.discount && (
                        <Badge className="bg-feature-suppliers text-white border-0">
                            خصم {product.discount}%
                        </Badge>
                    )}
                </div>
            </div>
            <CardContent className="p-4 space-y-3 flex flex-col items-center">
                <div className="w-full flex flex-col items-center gap-1">
                    <h3 className="font-bold text-lg text-center truncate w-full" title={product.name}>
                        <Link href={`/product/${product.slug}`} className="hover:text-feature-products transition-colors">
                            {product.name}
                        </Link>
                    </h3>
                    {product.supplier && (
                        <span className="text-xs text-muted-foreground text-center">بواسطة: {product.supplier.name}</span>
                    )}
                </div>
                <div className="flex items-center gap-2 justify-center w-full">
                    <span className="text-xl font-bold text-feature-products">{product.price.toLocaleString('ar-SA')} ر.س</span>
                    {product.oldPrice && (
                        <span className="text-xs line-through text-muted-foreground">{product.oldPrice.toLocaleString('ar-SA')} ر.س</span>
                    )}
                </div>
                {product.rating > 0 && (
                    <div className="w-full flex justify-center">
                        <span>
                            <span className="sr-only">تقييم المنتج</span>
                            <span aria-hidden="true">
                                <RatingDisplay rating={product.rating} showCount={false} size="sm" />
                            </span>
                        </span>
                    </div>
                )}
                <Badge
                    variant={isOutOfStock ? 'destructive' : 'default'}
                    className={`w-full justify-center mt-2 ${isOutOfStock ? 'bg-feature-suppliers/10 text-feature-suppliers border-feature-suppliers/20' : 'bg-feature-commerce/10 text-feature-commerce/20'}`}
                >
                    {isOutOfStock ? 'غير متوفر' : 'متوفر'}
                </Badge>
                {/* Product page link button */}
                <div className="flex justify-center w-full mt-2">
                    <Button asChild variant="outline" size="sm" className="w-full flex items-center justify-center gap-2" aria-label="عرض المنتج">
                        <Link href={`/product/${product.slug}`}>
                            <Eye className="w-4 h-4" />
                            <span>عرض المنتج</span>
                        </Link>
                    </Button>
                </div>
                {/* Remove button at the bottom, centered */}
                <div className="flex flex-col items-center w-full mt-4">
                    <WishlistRemoveButtonWrapper
                        productId={product.id}
                        onRemove={onRemove}
                        aria-label="إزالة من المفضلة"
                    />
                </div>
            </CardContent>
        </Card>
    );
} 