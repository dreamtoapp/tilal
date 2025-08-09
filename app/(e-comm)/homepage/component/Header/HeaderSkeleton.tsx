import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const HeaderSkeleton = React.memo(function HeaderSkeleton() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border/60 shadow-2xl shadow-black/20 dark:shadow-white/10 transition-all duration-300">
            <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                {/* Logo skeleton */}
                <span className="flex items-center">
                    <Skeleton className="h-[40px] w-[160px] rounded-full" />
                </span>
                {/* Actions group skeleton */}
                <div className="flex items-center gap-4 md:gap-6 bg-secondary rounded-lg px-4">
                    {/* SearchBar skeleton */}
                    <Skeleton className="h-11 w-72 md:w-96 rounded-xl" />
                    {/* Wishlist skeleton */}
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    {/* Cart skeleton */}
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    {/* Notification skeleton */}
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    {/* User menu/login skeleton */}
                    <Skeleton className="h-12 w-12 rounded-full" />
                </div>
            </nav>
        </header>
    );
});

export default HeaderSkeleton; 