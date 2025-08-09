'use client';

import { useState } from 'react';
import { Plus, Package, Search, Check } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

import { addProductsToOffer } from '../actions/manage-products';

interface Product {
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
}

interface ProductSelectorProps {
    offerId: string;
    offerName: string;
    availableProducts: Product[];
    assignedProductIds: string[];
}

export function ProductSelector({
    offerId,
    offerName,
    availableProducts,
    assignedProductIds
}: ProductSelectorProps) {
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Filter products that are not already assigned
    const unassignedProducts = availableProducts.filter(
        product => !assignedProductIds.includes(product.id)
    );

    // Filter products based on search term
    const filteredProducts = unassignedProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.categoryAssignments?.[0]?.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleProductToggle = (productId: string) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleAddProducts = async () => {
        if (selectedProducts.length === 0) return;

        setIsLoading(true);
        try {
            await addProductsToOffer(offerId, selectedProducts);
            setSelectedProducts([]);
            // The page will refresh automatically due to revalidatePath
        } catch (error) {
            console.error('Error adding products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="shadow-lg border-l-4 border-l-feature-products card-hover-effect">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Plus className="h-5 w-5 text-feature-products icon-enhanced" />
                    إضافة منتجات إلى: {offerName}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    اختر المنتجات التي تريد إضافتها إلى هذه المجموعة
                </p>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="البحث في المنتجات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-feature-products/30 focus:border-feature-products focus:ring-feature-products/20"
                    />
                </div>

                {/* Selected Products Count */}
                {selectedProducts.length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-feature-products-soft rounded-lg border border-feature-products/20">
                        <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-feature-products" />
                            <span className="text-sm font-medium text-feature-products">
                                تم اختيار {selectedProducts.length} منتج
                            </span>
                        </div>
                        <Button
                            onClick={handleAddProducts}
                            disabled={isLoading}
                            className="btn-add"
                            size="sm"
                        >
                            {isLoading ? 'جاري الإضافة...' : 'إضافة المحددة'}
                        </Button>
                    </div>
                )}

                <Separator />

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">
                            {searchTerm ? 'لا توجد منتجات تطابق البحث' : 'جميع المنتجات مضافة بالفعل'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className={`
                  relative p-4 border rounded-lg cursor-pointer transition-all duration-200
                  ${selectedProducts.includes(product.id)
                                        ? 'border-feature-products bg-feature-products-soft shadow-md'
                                        : 'border-border hover:border-feature-products/50 hover:shadow-sm'
                                    }
                `}
                                onClick={() => handleProductToggle(product.id)}
                            >
                                {/* Checkbox */}
                                <div className="absolute top-2 right-2 z-10">
                                    <Checkbox
                                        checked={selectedProducts.includes(product.id)}
                                        onChange={() => handleProductToggle(product.id)}
                                        className="data-[state=checked]:bg-feature-products data-[state=checked]:border-feature-products"
                                    />
                                </div>

                                {/* Product Image */}
                                <div className="relative h-32 w-full mb-3 overflow-hidden rounded-md">
                                    {product.images && product.images.length > 0 ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full bg-muted">
                                            <Package className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm line-clamp-2 text-foreground">
                                        {product.name}
                                    </h4>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-feature-commerce">
                                            {product.price.toLocaleString()} ريال
                                        </span>

                                    </div>

                                    {product.categoryAssignments && product.categoryAssignments.length > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            {product.categoryAssignments[0].category.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 