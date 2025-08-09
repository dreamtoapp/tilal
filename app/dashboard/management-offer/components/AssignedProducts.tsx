'use client';

import { useState } from 'react';
import { Package, Trash2, Eye, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

import { removeProductFromOffer } from '../actions/manage-products';
import Link from '@/components/link';

interface AssignedProduct {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        images: string[];
        categoryAssignments: Array<{
            category: {
                name: string;
            };
        }>;
    };
}

interface AssignedProductsProps {
    offerId: string;
    offerName: string;
    assignedProducts: AssignedProduct[];
    hasDiscount: boolean;
    discountPercentage?: number | null;
}

export function AssignedProducts({
    offerId,
    offerName,
    assignedProducts,
    hasDiscount,
    discountPercentage
}: AssignedProductsProps) {
    const [removingProductId, setRemovingProductId] = useState<string | null>(null);

    const handleRemoveProduct = async (productId: string) => {
        setRemovingProductId(productId);
        try {
            await removeProductFromOffer(offerId, productId);
            // The page will refresh automatically due to revalidatePath
        } catch (error) {
            console.error('Error removing product:', error);
        } finally {
            setRemovingProductId(null);
        }
    };

    const calculateDiscountedPrice = (originalPrice: number) => {
        if (!hasDiscount || !discountPercentage) return originalPrice;
        return originalPrice - (originalPrice * discountPercentage / 100);
    };

    return (
        <Card className="shadow-lg border-l-4 border-l-feature-commerce card-hover-effect">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Package className="h-5 w-5 text-feature-commerce icon-enhanced" />
                    المنتجات في المجموعة: {offerName}
                </CardTitle>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        إجمالي المنتجات: {assignedProducts.length}
                    </p>
                    {hasDiscount && discountPercentage && (
                        <Badge className="bg-feature-commerce text-white">
                            خصم {discountPercentage}%
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {assignedProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                            لا توجد منتجات في هذه المجموعة
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            ابدأ بإضافة منتجات من القسم أدناه
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assignedProducts.map(({ product }) => {
                            const originalPrice = product.price;
                            const discountedPrice = calculateDiscountedPrice(originalPrice);
                            const isRemoving = removingProductId === product.id;

                            return (
                                <div
                                    key={product.id}
                                    className="relative group border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-feature-commerce/50"
                                >
                                    {/* Product Image */}
                                    <div className="relative h-40 w-full mb-4 overflow-hidden rounded-md">
                                        {product.images && product.images.length > 0 ? (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full bg-muted">
                                                <Package className="h-12 w-12 text-muted-foreground" />
                                            </div>
                                        )}

                                        {/* Discount Badge */}
                                        {hasDiscount && discountPercentage && (
                                            <div className="absolute top-2 left-2 bg-feature-commerce text-white px-2 py-1 rounded-md text-xs font-medium shadow-lg">
                                                -{discountPercentage}%
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-base line-clamp-2 text-foreground group-hover:text-feature-commerce transition-colors">
                                            {product.name}
                                        </h4>

                                        {/* Price */}
                                        <div className="space-y-1">
                                            {hasDiscount && discountPercentage ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold text-feature-commerce">
                                                        {discountedPrice.toLocaleString()} ريال
                                                    </span>
                                                    <span className="text-sm text-muted-foreground line-through">
                                                        {originalPrice.toLocaleString()} ريال
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-lg font-bold text-feature-commerce">
                                                    {originalPrice.toLocaleString()} ريال
                                                </span>
                                            )}
                                        </div>

                                        {/* Category */}
                                        {product.categoryAssignments && product.categoryAssignments.length > 0 && (
                                            <p className="text-sm text-muted-foreground">
                                                {product.categoryAssignments[0].category.name}
                                            </p>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 pt-2">
                                            <Link
                                                href={`/dashboard/management-products/view/${product.id}`}
                                                className="flex-1"
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="btn-view-outline w-full"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    عرض
                                                </Button>
                                            </Link>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="btn-delete"
                                                        disabled={isRemoving}
                                                    >
                                                        {isRemoving ? (
                                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="flex items-center gap-2">
                                                            <AlertTriangle className="h-5 w-5 text-destructive" />
                                                            حذف المنتج من المجموعة
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            هل أنت متأكد من حذف &quot;{product.name}&quot; من مجموعة &quot;{offerName}&quot;؟
                                                            <br />
                                                            <span className="text-xs text-muted-foreground mt-2 block">
                                                                لن يتم حذف المنتج نفسه، فقط إزالته من هذه المجموعة.
                                                            </span>
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleRemoveProduct(product.id)}
                                                            className="btn-delete"
                                                        >
                                                            حذف من المجموعة
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 