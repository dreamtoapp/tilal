import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const MobileHeaderSkeleton = React.memo(function MobileHeaderSkeleton() {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 flex h-14 md:h-20 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6 shadow-2xl">
            {/* Logo skeleton (center) */}
            <div className="flex justify-center flex-1">
                <Skeleton className="h-[30px] w-[120px] md:h-[40px] md:w-[160px] rounded-full" />
            </div>
            {/* Actions group skeleton (right) */}
            <div className="flex items-center gap-2 bg-secondary rounded-lg px-4">
                {/* SearchBar skeleton */}
                <Skeleton className="h-9 w-32 rounded-xl" />
                {/* Notification skeleton */}
                <Skeleton className="h-10 w-10 rounded-lg" />
                {/* User menu/login skeleton */}
                <Skeleton className="h-10 w-10 rounded-full" />
            </div>
        </header>
    );
});

export default MobileHeaderSkeleton; 