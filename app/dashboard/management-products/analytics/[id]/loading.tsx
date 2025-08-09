import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsLoading() {
    return (
        <div className="container mx-auto py-8" dir="rtl">
            {/* Header: Product Info and Actions */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-1 shadow-sm w-full md:w-96">
                    <Skeleton className="h-10 w-10 rounded" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <div className="flex gap-2">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-3 w-12" />
                            <Skeleton className="h-3 w-14" />
                        </div>
                    </div>
                    <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
            </div>
            {/* Controls: Date Range Picker and Chart Type Switcher */}
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                </div>
            </div>
            <Skeleton className="h-4 w-64 mb-2 mx-auto md:mx-0" />
            <Skeleton className="h-8 w-40 mb-6" />
            {/* Stats Cards and Chart */}
            <div className="min-h-[300px] rounded-xl bg-card p-6 shadow mb-8">
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="rounded-md border border-border p-4">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-8 w-20" />
                        </div>
                    ))}
                </div>
                <Skeleton className="h-64 w-full rounded" />
            </div>
            {/* Order History Table */}
            <div className="mt-8 overflow-x-auto rounded-xl bg-card p-6 shadow">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="w-full">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex gap-4 mb-2">
                            {[...Array(6)].map((_, j) => (
                                <Skeleton key={j} className="h-4 w-24" />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            {/* Ratings Section */}
            <div className="mt-8 rounded-xl bg-card p-6 shadow">
                <Skeleton className="h-6 w-32 mb-4" />
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="mb-3">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                ))}
            </div>
        </div>
    );
} 