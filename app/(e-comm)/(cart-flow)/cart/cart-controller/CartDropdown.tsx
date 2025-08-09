"use client";
import Image from 'next/image';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useCartStore } from './cartStore';
import { Icon } from '@/components/icons/Icon';
import { useSession } from 'next-auth/react';

import CartQuantityControls from './CartQuantityControls';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog';

interface CartPreviewProps {
    closePopover?: () => void;
    hideHeader?: boolean;
}

// Cart preview using Zustand store for instant updates
export default function CartPreview({ closePopover, hideHeader = false }: CartPreviewProps) {
    const { cart, getTotalPrice, clearCart } = useCartStore();
    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated' && !!session?.user;
    const items = Object.values(cart);
    const total = getTotalPrice();
    const isEmpty = items.length === 0;



    return (
        <Card className="shadow-lg border-l-4 border-feature-commerce card-hover-effect card-border-glow max-h-[calc(100vh-100px)] w-full flex flex-col h-full">
            {!hideHeader && (
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between gap-2">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Icon name="ShoppingBag" className="h-5 w-5 text-feature-commerce icon-enhanced" />
                            سلة التسوق
                        </CardTitle>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:bg-destructive/10"
                                    aria-label="افراغ السلة"
                                    disabled={isEmpty}
                                >
                                    <Icon name="Trash2" className="h-5 w-5" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>تأكيد إفراغ السلة</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        هل أنت متأكد أنك تريد إفراغ السلة؟ لا يمكن التراجع عن هذا الإجراء.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => clearCart()} className="bg-destructive text-white hover:bg-destructive/90">افراغ السلة</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardHeader>
            )}
            <CardContent className="flex-1 flex flex-col min-h-0">
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center text-center py-10">
                        <div className="mb-4 rounded-full bg-feature-commerce-soft p-4 text-feature-commerce">
                            <Icon name="ShoppingBag" className="h-10 w-10 icon-enhanced" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">سلتك فارغة!</h3>
                        <p className="mt-1 text-sm text-muted-foreground">لم تقم بإضافة أي منتجات بعد.</p>
                        <Button asChild className="mt-6 w-full btn-view-outline" onClick={closePopover}>
                            <Link href="/">
                                ابدأ التسوق
                                <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col min-h-0 gap-4">
                        <ScrollArea className="flex-1 min-h-0 max-h-full pr-1 overflow-y-auto">
                            {items.map((item) => {
                                const lineTotal = item.product.price * item.quantity;
                                return (
                                    <div
                                        key={item.product.id}
                                        className="flex items-center gap-3 py-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                                    >
                                        {/* Product Image */}
                                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border shadow-sm">
                                            <Image
                                                src={item.product.imageUrl || '/fallback/product-fallback.avif'}
                                                alt={item.product.name || ''}
                                                fill
                                                className="object-cover max-h-16"
                                                sizes="64px"
                                            />
                                        </div>
                                        {/* Details: name + prices + qty controls */}
                                        <div className="flex-1 overflow-hidden pr-1">
                                            <h4 className="truncate text-sm font-medium text-foreground mb-1">
                                                {item.product.name}
                                            </h4>
                                            <p className="text-xs flex items-center justify-between mb-1">
                                                <span className="text-muted-foreground">
                                                    {item.product.price?.toLocaleString()} ر.س
                                                </span>
                                                <span className="font-bold text-foreground whitespace-nowrap">
                                                    {lineTotal.toLocaleString()} ر.س
                                                </span>
                                            </p>
                                            {/* Quantity controls + delete */}
                                            <div className="flex items-center gap-4 mt-2">
                                                <CartQuantityControls
                                                    productId={item.product.id}
                                                    size="sm"
                                                    variant="dropdown"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </ScrollArea>
                        <Separator className="my-2" />
                        {/* Sub-total and footer always visible */}
                        <div className="flex items-center justify-between px-1 text-lg font-bold">
                            <span>المجموع الفرعي</span>
                            <span className="text-feature-commerce">
                                {total.toLocaleString()} ر.س
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">الشحن والضرائب تحسب عند إتمام الطلب.</p>
                        <div className="flex gap-3">
                            <Button asChild variant="outline" className="flex-1 btn-view-outline" onClick={closePopover}>
                                <Link href="/cart">عرض السلة</Link>
                            </Button>
                            {isAuthenticated ? (
                                <Button asChild className="flex-1 btn-save" onClick={closePopover}>
                                    <Link href="/checkout">إتمام الطلب</Link>
                                </Button>
                            ) : (
                                <Button
                                    asChild
                                    className="flex-1 btn-save opacity-60 cursor-not-allowed"
                                    disabled
                                    title="يجب تسجيل الدخول لإتمام الطلب"
                                >
                                    <Link href="/auth/login">تسجيل الدخول</Link>
                                </Button>
                            )}
                        </div>
                        {!isAuthenticated && (
                            <p className="text-xs text-muted-foreground text-center">
                                سجل دخولك لإتمام الطلب وحفظ سلة التسوق
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}