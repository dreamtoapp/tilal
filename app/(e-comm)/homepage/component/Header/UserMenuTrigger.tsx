"use client";

import Link from '@/components/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/constant/enums';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { signOut } from 'next-auth/react';
import { useCartStore } from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/cartStore';
import { Icon } from '@/components/icons/Icon';
import { usePusherConnectionStatus } from '@/app/(e-comm)/(adminPage)/user/notifications/components/RealtimeNotificationListener';
import PushNotificationSetup from '@/app/components/PushNotificationSetup';

interface UserMenuTriggerProps {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: UserRole;
    } | null;
    alerts?: any[];
}

interface UserStats {
    totalOrders: number;
    totalSpent: number;
    loyaltyPoints: number;
    memberSince: string;
    wishlistCount: number;
    reviewsCount: number;
}

export default function UserMenuTrigger({ user, alerts }: UserMenuTriggerProps) {
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const name = user?.name;
    const image = user?.image;
    const isConnected = usePusherConnectionStatus();

    // User-specific navigation items only (removed universal navigation)
    const userNavItems = user ? [
        {
            href: `/user/profile?id=${user.id ?? ''}`,
            label: "الملف الشخصي",
            icon: "User",
            description: "إدارة معلوماتك الشخصية"
        },
        {
            href: `/user/purchase-history`,
            label: "طلباتي",
            icon: "ShoppingBag",
            description: "تصفح مشترياتك",
            badge: userStats?.totalOrders && userStats.totalOrders > 0 ? userStats.totalOrders.toString() : undefined
        },
        // {
        //     href: `/user/wishlist/${user.id ?? ''}`,
        //     label: "المفضلة",
        //     icon: "Heart",
        //     description: "المنتجات المحفوظة",
        //     badge: userStats?.wishlistCount && userStats?.wishlistCount > 0 ? userStats.wishlistCount.toString() : undefined
        // },
        {
            href: `/user/statement/${user.id ?? ''}`,
            label: "الحركات المالية",
            icon: "CreditCard",
            description: "تاريخ المعاملات"
        },
        {
            href: `/user/ratings`,
            label: "تقييماتي",
            icon: "Star",
            description: "إدارة التقييمات",
            badge: userStats?.reviewsCount && userStats.reviewsCount > 0 ? userStats.reviewsCount.toString() : undefined
        },
        // {
        //     href: `/user/notifications`,
        //     label: "الإشعارات",
        //     icon: "Bell",
        //     description: "إدارة التنبيهات"
        // }
    ] : [];

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            // Clear cart on logout
            const { clearCart } = useCartStore.getState();
            clearCart();
            console.log('🛒 Cart cleared on logout');

            await signOut({
                callbackUrl: '/',
                redirect: true
            });
        } catch (error) {
            console.error('خطأ في تسجيل الخروج:', error);
            setIsLoggingOut(false);
        }
    };

    const loadUserStats = async () => {
        // Simple caching: only fetch once
        if (!userStats && !isLoading && !hasFetched) {
            setIsLoading(true);
            try {
                const res = await fetch('/api/user/stats');
                const data = await res.json();
                setUserStats(data);
                setHasFetched(true);
            } catch (error) {
                console.error('Error loading user stats:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (!user) {
        return (
            <Button asChild size="sm" className="h-8 px-3 text-sm font-medium">
                <Link href="/auth/login">
                    <Icon name="User" className="w-4 h-4 mr-2" />
                    تسجيل الدخول
                </Link>
            </Button>
        );
    }

    return (
        <DropdownMenu onOpenChange={(open) => {
            if (open) {
                loadUserStats();
            }
        }}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-accent transition-colors duration-200"
                >
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border border-border/50">
                        <AvatarImage
                            src={image || "/fallback/fallback.avif"}
                            alt={name || "User"}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                            {name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    {/* Notification alerts dot */}
                    {alerts && alerts.length > 0 && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-background animate-pulse" />
                    )}
                    {/* Real-time connection status dot */}
                    <span className={`absolute top-0 right-0 h-2.5 w-2.5 rounded-full border border-background transition-colors duration-300 ${isConnected
                        ? 'bg-green-500 shadow-sm shadow-green-500/50'
                        : 'bg-yellow-500 shadow-sm shadow-yellow-500/50'
                        }`}
                        title={isConnected ? 'الإشعارات الفورية متصلة' : 'الإشعارات الفورية منقطعة'}
                    />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-72 p-0 bg-background/95 backdrop-blur-md border border-border/50 shadow-xl max-h-[85vh] overflow-y-auto"
                sideOffset={8}
            >
                {/* Compact User Info Header */}
                <div className="p-3 border-b border-border/30 bg-muted/20">
                    <div className="flex items-center gap-2.5">
                        <div className="relative">
                            <Avatar className="h-10 w-10 border border-border">
                                <AvatarImage
                                    src={image || "/fallback/fallback.avif"}
                                    alt={name || "User"}
                                    className="object-cover"
                                />
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                                    {name?.[0]?.toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            {/* Connection status dot for dropdown avatar */}
                            <span className={`absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background transition-colors duration-300 ${isConnected
                                ? 'bg-green-500'
                                : 'bg-yellow-500'
                                }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <DropdownMenuLabel className="text-sm font-semibold text-foreground p-0 truncate leading-tight">
                                {name || "المستخدم"}
                            </DropdownMenuLabel>
                            <p className="text-xs text-muted-foreground truncate">
                                {user.email || "حساب شخصي"}
                            </p>
                            {/* Compact connection status */}
                            <div className="flex items-center gap-1 mt-0.5">
                                <span className={`h-1 w-1 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                <span className="text-[10px] text-muted-foreground/60">
                                    {isConnected ? 'متصل' : 'منقطع'}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Add PushNotificationSetup button here */}
                    <div className="mt-3">
                        <PushNotificationSetup />
                    </div>
                </div>

                {/* Enhanced Analytics - Professional UI */}
                {userStats && (
                    <div className="mt-3 px-2">
                        <div className="flex items-center justify-around text-[11px] font-medium">
                            <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <span className="text-blue-600 font-semibold tabular-nums">{userStats.totalOrders}</span>
                                <span className="text-muted-foreground">طلبات</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                                <span className="text-pink-600 font-semibold tabular-nums">{userStats.wishlistCount}</span>
                                <span className="text-muted-foreground">مفضلة</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                <span className="text-amber-600 font-semibold tabular-nums">{userStats.reviewsCount}</span>
                                <span className="text-muted-foreground">تقييم</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Scrollable Navigation Items */}
                <div className="py-1 max-h-72 overflow-y-auto">
                    {userNavItems.map((item, index) => (
                        <DropdownMenuItem key={index} asChild className="p-0 mx-1">
                            <Link
                                href={item.href}
                                className="flex items-center gap-2.5 px-2 py-3 rounded-md hover:bg-accent/50 transition-colors duration-200 cursor-pointer group"
                            >
                                <div className="p-1 rounded bg-muted/30 group-hover:bg-muted/50 transition-colors">
                                    <Icon name={item.icon} className="w-3.5 h-3.5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-xs text-foreground truncate">
                                        {item.label}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground/60 truncate leading-tight">
                                        {item.description}
                                    </div>
                                </div>
                                {item.badge && (
                                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5 min-w-0">
                                        {item.badge}
                                    </Badge>
                                )}
                                <Icon name="ChevronLeft" className="w-2.5 h-2.5 text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors" />
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </div>

                <DropdownMenuSeparator className="mx-2" />

                {/* Compact Logout */}
                <div className="p-1">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                className="flex items-center gap-2.5 px-2 py-2 mx-1 rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer group"
                                onSelect={(e) => e.preventDefault()}
                            >
                                <div className="p-1 rounded bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
                                    <Icon name="LogOut" className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-xs">تسجيل الخروج</div>
                                    <div className="text-[10px] opacity-60 leading-tight">إنهاء الجلسة</div>
                                </div>
                                <Icon name="ChevronLeft" className="w-2.5 h-2.5 opacity-40 group-hover:opacity-60 transition-opacity" />
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-md">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-right flex items-center gap-2">
                                    <Icon name="LogOut" className="w-5 h-5 text-destructive" />
                                    تأكيد تسجيل الخروج
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-right">
                                    هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-2">
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="bg-destructive hover:bg-destructive/90"
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                                            جاري الخروج...
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="LogOut" className="w-4 h-4 ml-2" />
                                            تسجيل الخروج
                                        </>
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 