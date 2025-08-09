"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useCheckIsLogin } from '@/hooks/use-check-islogin';
import { useCartStore } from '../cart-controller/cartStore';
import { useRouter } from 'next/navigation';
import CartQuantityControls from '../cart-controller/CartQuantityControls';
import CartPageSkeleton from './CartPageSkeleton';
import EmptyCart from './EmptyCart';
import CartProgressIndicator from './CartProgressIndicator';
import OrderSummary from './OrderSummary';
import { Badge } from "@/components/ui/badge";

// Types
type GuestCartItem = { product: any; quantity: number };
type ServerCartItem = { id: string; product: any; quantity: number };

// Type guard
function isServerItem(item: ServerCartItem | GuestCartItem): item is ServerCartItem {
    return (item as ServerCartItem).id !== undefined;
}

// Cart Item Component
function CartItem({ item }: { item: ServerCartItem | GuestCartItem }) {
    return (
        <div
            key={isServerItem(item) ? item.id : item.product?.id}
            className="flex flex-col sm:flex-row gap-4 p-4 bg-feature-commerce-soft/30 rounded-lg border border-feature-commerce/20 hover:border-feature-commerce/40 transition-colors"
        >
            {/* Product Info */}
            <div className="flex gap-4 flex-1">
                <Image
                    src={item.product?.imageUrl || '/fallback/product-fallback.avif'}
                    alt={item.product?.name || 'صورة المنتج'}
                    width={96}
                    height={96}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border border-border flex-shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-2">
                    <div>
                        <h3 className="font-semibold text-base sm:text-lg leading-tight line-clamp-2 text-foreground" title={item.product?.name}>
                            {item.product?.name}
                        </h3>
                    </div>

                    {/* Price Info */}
                    <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                            {item.product?.price?.toLocaleString()} ر.س × {item.quantity}
                        </div>
                        <Badge variant="outline" className="font-bold  border-green-600 text-primary text-sm text-green-600">
                            {((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()} ر.س
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-end sm:justify-center sm:items-start">
                <CartQuantityControls
                    productId={item.product?.id}
                    size="sm"
                />
            </div>
        </div>
    );
}

// Cart Items List Component
function CartItemsList({ items }: { items: (ServerCartItem | GuestCartItem)[] }) {
    return (
        <Card className="shadow-lg border-l-4 border-feature-commerce">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <ShoppingCart className="h-5 w-5 text-feature-commerce icon-enhanced" />
                        سلة التسوق ({items.length} منتج)
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {items.map((item) => (
                    <CartItem key={isServerItem(item) ? item.id : item.product?.id} item={item} />
                ))}
            </CardContent>
        </Card>
    );
}

// Main Cart Page View Component
interface PlatformSettings {
    taxPercentage: number;
    shippingFee: number;
    minShipping: number;
}

interface CartPageViewProps {
    platformSettings: PlatformSettings;
}

export default function CartPageView({ platformSettings }: CartPageViewProps) {
    const { isAuthenticated, isLoading } = useCheckIsLogin();
    const { cart } = useCartStore();
    const router = useRouter();

    // Cart calculations using platform settings
    const items = Object.values(cart);
    const subtotal = items.reduce((sum, item) => sum + ((item.product?.price || 0) * (item.quantity || 1)), 0);
    const shipping = subtotal >= platformSettings.minShipping ? 0 : platformSettings.shippingFee;
    const tax = subtotal * (platformSettings.taxPercentage / 100);
    const total = subtotal + shipping + tax;

    // Simple checkout handler
    const handleCheckout = () => {
        if (isAuthenticated) {
            router.push('/checkout');
        }
    };

    if (isLoading) {
        return <CartPageSkeleton />;
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            <CartProgressIndicator />

            {items.length === 0 ? (
                <EmptyCart />
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* Order Summary - First on mobile, 4/12 on desktop */}
                    <div className="xl:col-span-4 order-1 xl:order-2">
                        <OrderSummary
                            items={items}
                            subtotal={subtotal}
                            shipping={shipping}
                            tax={tax}
                            total={total}
                            taxPercentage={platformSettings.taxPercentage}
                            onCheckout={handleCheckout}
                            showLoginDialog={false}
                            setShowLoginDialog={() => { }}
                        />
                    </div>

                    {/* Cart Items - Second on mobile, 8/12 on desktop */}
                    <div className="xl:col-span-8 space-y-6 order-2 xl:order-1">
                        <CartItemsList items={items} />
                    </div>
                </div>
            )}
        </div>
    );
} 