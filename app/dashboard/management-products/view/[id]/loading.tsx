import { Skeleton } from '@/components/ui/skeleton';

export default function ProductViewLoading() {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6" dir="rtl">
            <div className="mb-6 flex items-center justify-between">
                <Skeleton className="h-8 w-48 md:w-64" />
                <Skeleton className="h-10 w-40" />
            </div>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 items-start">
                {/* Left Column: Main Image & Gallery */}
                <div className="md:col-span-1 grid gap-4">
                    <Skeleton className="aspect-square w-full h-64 rounded-lg" />
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-2">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="aspect-square w-full h-20 rounded-md" />
                        ))}
                    </div>
                </div>
                {/* Middle Column: Product Info */}
                <div className="md:col-span-1 grid gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-40 mb-2" />
                        <Skeleton className="h-4 w-24 mb-1" />
                        <div className="flex items-center gap-2 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-5 w-5 rounded-full" />
                            ))}
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="flex gap-2 mb-3">
                            {[...Array(2)].map((_, i) => (
                                <Skeleton key={i} className="h-6 w-16 rounded" />
                            ))}
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                    <Skeleton className="h-5 w-24 my-2" />
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-4 w-32" />
                        ))}
                    </div>
                </div>
                {/* Right Column: Price & Stock */}
                <div className="md:col-span-1 grid gap-6">
                    <div className="rounded-lg border bg-card p-6 shadow-lg space-y-4">
                        <Skeleton className="h-8 w-24 mb-2" />
                        <Skeleton className="h-4 w-16 mb-2" />
                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-4 w-28" />
                            ))}
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            </div>
        </div>
    );
} 