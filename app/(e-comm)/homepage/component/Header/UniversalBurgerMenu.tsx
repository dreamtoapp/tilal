"use client";

import { useState } from 'react';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Icon } from '@/components/icons/Icon';

interface UniversalNavItem {
    href: string;
    label: string;
    icon: string;
    description?: string;
}

// Universal Navigation Items - NO AUTH CHECKS - Available for ALL users
const universalNavItems: UniversalNavItem[] = [
    // Main Shopping
    {
        href: "/",
        label: "الرئيسية",
        icon: "Home",
        description: "العودة للصفحة الرئيسية"
    },
    {
        href: "/categories",
        label: "التصنيفات",
        icon: "Grid3x3",
        description: "تصفح جميع الفئات"
    },

    {
        href: "/offers",
        label: "العروض",
        icon: "Tag",
        description: "أحدث العروض والخصومات"
    },
    {
        href: "/bestsellers",
        label: "الأكثر مبيعاً",
        icon: "TrendingUp",
        description: "المنتجات الأكثر طلباً"
    },

    // Support & Info
    {
        href: "/contact",
        label: "اتصل بنا",
        icon: "Phone",
        description: "تواصل مع فريق الدعم"
    },
    {
        href: "/about",
        label: "حول الموقع",
        icon: "Info",
        description: "معلومات عن شركتنا"
    },
    {
        href: "/policies/privacy",
        label: "سياسة الخصوصية",
        icon: "Shield",
        description: "شروط الاستخدام والخصوصية"
    },
    {
        href: "/policies/terms",
        label: "الشروط والأحكام",
        icon: "File",
        description: "الشروط والأحكام الخاصة بالموقع"
    },
    {
        href: "/policies/refund",
        label: "سياسة الاسترجاع",
        icon: "Undo",
        description: "سياسة الاسترجاع والاستبدال"
    },

];

export default function UniversalBurgerMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11 text-foreground hover:bg-accent hover:text-primary transition-all duration-200 shrink-0"
                    aria-label="فتح القائمة الرئيسية"
                >
                    <Icon name="Menu" className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-80 sm:w-96 overflow-y-auto border-0 bg-background/95 backdrop-blur-xl"
                dir="rtl"
            >
                <SheetHeader className="text-right mb-8 pb-4 border-b border-border/20">
                    <SheetTitle className="text-lg font-semibold text-foreground flex items-center gap-3">
                        <Icon name="Menu" className="h-5 w-5 text-muted-foreground" />
                        القائمة الرئيسية
                    </SheetTitle>
                </SheetHeader>

                {/* Navigation Items */}
                <div className="space-y-1">
                    {universalNavItems.map((item, index) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group flex items-center gap-4 p-1 rounded-lg transition-all duration-200 hover:bg-accent/50 active:bg-accent/70"
                            onClick={() => setIsOpen(false)}
                            style={{ animationDelay: `${index * 30}ms` }}
                        >
                            <div className="p-2 rounded-md bg-muted/30 group-hover:bg-muted/50 transition-colors duration-200">
                                <Icon name={item.icon} className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                            </div>
                            <div className="flex-1 text-right min-w-0">
                                <div className="font-medium text-foreground group-hover:text-foreground transition-colors duration-200 truncate text-sm">
                                    {item.label}
                                </div>
                                {item.description && (
                                    <div className="text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors duration-200 truncate">
                                        {item.description}
                                    </div>
                                )}
                            </div>
                            <Icon
                                name="ChevronLeft"
                                className="w-3 h-3 text-muted-foreground/50 group-hover:text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5"
                            />
                        </Link>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-12 pt-6 border-t border-border/10">
                    <div className="text-center text-xs text-muted-foreground/60">
                        <p className="flex items-center justify-center gap-1.5">
                            <Icon name="Heart" className="w-3 h-3 text-red-400/60" />
                            صُنع بحب في
                            <Link
                                href="https://dreamto.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary/70 hover:text-primary hover:underline transition-colors duration-200"
                            >
                                dreamto.app
                            </Link>
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
} 