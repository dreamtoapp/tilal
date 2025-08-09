"use client";
import { Button } from '@/components/ui/button';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import CartPreview from './CartDropdown';
import { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from '@/components/icons/Icon';
import { useCartStore } from './cartStore';
import { X } from 'lucide-react';

// Cart icon with instant count from Zustand store and background server sync
export default function CartButtonWithBadge() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [mounted, setMounted] = useState(false);
    const { getTotalUniqueItems } = useCartStore();
    const totalItems = getTotalUniqueItems();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleClose = () => setIsOpen(false);

    const cartIcon = (
        <Button
            aria-label="عرض السلة"
            variant="ghost"
            className="relative flex items-center justify-center gap-2 rounded-full bg-feature-commerce-soft card-hover-effect transition-all duration-300 hover:scale-105 hover:bg-feature-commerce/20 w-12 h-12 shadow-lg"
        >
            <span className="absolute inset-0 rounded-full bg-feature-commerce/30 blur-md opacity-70 pointer-events-none animate-pulse" />
            <Icon
                name="ShoppingCart"
                className="h-6 w-6 text-foreground icon-enhanced group-hover:scale-110 transition-transform"
                aria-label="عرض السلة"
            />
            <AnimatePresence>
                {mounted && totalItems > 0 && (
                    <motion.span
                        key={totalItems}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1.1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-feature-commerce text-white text-[10px] font-bold shadow ring-1 ring-white dark:ring-gray-900 border border-feature-commerce animate-in fade-in zoom-in"
                        aria-live="polite"
                    >
                        {totalItems}
                    </motion.span>
                )}
            </AnimatePresence>
        </Button>
    );

    // Use Drawer for both mobile and desktop
    return (
        <div className="relative">
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>
                    {cartIcon}
                </DrawerTrigger>
                <DrawerContent className={isMobile ? 'w-full max-w-[95vw] h-[85vh] rounded-t-xl p-0 flex flex-col' : 'max-w-[480px] w-full p-0 flex flex-col'}>
                    <DrawerDescription>عرض وإدارة عناصر السلة الخاصة بك.</DrawerDescription>
                    <DrawerHeader className="p-4 border-b flex items-center justify-between">
                        <DrawerTitle>
                            <span className="text-lg font-semibold text-primary">عربة التسوق</span>
                        </DrawerTitle>
                        <button
                            onClick={handleClose}
                            aria-label="إغلاق"
                            className="ml-2 rounded-full p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </DrawerHeader>
                    <CartPreview closePopover={handleClose} hideHeader />
                </DrawerContent>
            </Drawer>
        </div>
    );
} 