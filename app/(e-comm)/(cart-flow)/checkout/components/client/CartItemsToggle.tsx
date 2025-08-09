'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '../../../../../../lib/formatCurrency';

interface CartItem {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
        image?: string;
    } | null;
}

interface CartItemsToggleProps {
    items: CartItem[];
}

export default function CartItemsToggle({ items }: CartItemsToggleProps) {
    const [showItems, setShowItems] = useState(false);

    return (
        <>
            {/* Cart Items Toggle */}
            <Button
                variant="outline"
                className="w-full justify-between h-10"
                onClick={() => setShowItems(!showItems)}
            >
                <span>{showItems ? 'إخفاء المنتجات' : 'عرض المنتجات'}</span>
                {showItems ? (
                    <ChevronUp className="h-4 w-4" />
                ) : (
                    <ChevronDown className="h-4 w-4" />
                )}
            </Button>

            {/* Cart Items List */}
            {showItems && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 pt-2"
                >
                    {items.map((item, idx) => (
                        <div
                            // Prefer a composite key for uniqueness
                            key={
                                item.id && item.product?.id
                                    ? `${item.id}-${item.product.id}`
                                    : item.id || item.product?.id || idx
                            }
                            className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-feature-commerce-soft rounded flex items-center justify-center">
                                    <Package className="h-4 w-4 text-feature-commerce" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">
                                        {item.product?.name || 'منتج غير معروف'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        الكمية: {item.quantity}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-sm">
                                    {formatCurrency((item.product?.price || 0) * (item.quantity || 1))}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatCurrency(item.product?.price || 0)} × {item.quantity}
                                </p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            )}
        </>
    );
} 