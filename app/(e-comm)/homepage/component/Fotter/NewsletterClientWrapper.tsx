"use client";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@/components/icons/Icon";

// Enhanced loading component that matches the actual newsletter layout
function NewsletterSkeleton() {
    return (
        <div className="space-y-4" role="status" aria-label="تحميل نموذج النشرة الإخبارية">
            <div className="text-center md:text-right space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-2">
                    <div className="h-4 w-4 md:h-5 md:w-5 bg-primary/20 rounded animate-pulse" />
                    <Skeleton className="h-5 md:h-6 w-48" />
                </div>
                <Skeleton className="h-4 w-full max-w-xs mx-auto md:mx-0" />
                <Skeleton className="h-4 w-3/4 max-w-xs mx-auto md:mx-0" />
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <Skeleton className="h-9 w-full rounded-md" />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Icon name="Mail" className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-3 w-3/4 mx-auto" />
            </div>

            <span className="sr-only">جاري تحميل نموذج التسجيل في النشرة الإخبارية...</span>
        </div>
    );
}

// Dynamic import with optimized loading and error boundary
const Newsletter = dynamic(() => import("./Newsletter"), {
    ssr: false,
    loading: () => <NewsletterSkeleton />,
});

export default function NewsletterClientWrapper() {
    return (
        <div className="newsletter-wrapper">
            {/* Progressive enhancement - Newsletter will load when JavaScript is available */}
            <Newsletter />
        </div>
    );
} 