import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function PendingOrdersLoading() {
    return (
        <div className="container mx-auto py-4 space-y-4" dir="rtl">
            {/* Header Section Skeleton */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* BackButton Skeleton */}
                    <Skeleton className="h-10 w-20" />
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-1" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-6" />
                            <Skeleton className="h-8 w-48" />
                        </div>
                    </div>
                </div>
                {/* Status Badge Skeleton */}
                <Skeleton className="h-8 w-24" />
            </div>

            {/* Tabs Skeleton */}
            <div className="w-full">
                <div className="grid w-full grid-cols-2 mb-4 h-10 bg-muted rounded-md p-1">
                    <Skeleton className="h-8 rounded-sm" />
                    <Skeleton className="h-8 rounded-sm" />
                </div>

                {/* Tab Content Skeleton */}
                <div className="space-y-4">
                    {/* Status Overview Card Skeleton */}
                    <Card className="shadow-lg border-l-4 border-l-yellow-500">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5" />
                                <Skeleton className="h-6 w-64" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-20" />
                                                <Skeleton className="h-8 w-12" />
                                            </div>
                                            <Skeleton className="h-8 w-8 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Search and Controls Skeleton */}
                    <Card className="shadow-md">
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                                    <Skeleton className="h-10 w-full sm:w-64" />
                                    <Skeleton className="h-10 w-32" />
                                    <Skeleton className="h-10 w-32" />
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton className="h-10 w-10" />
                                    <Skeleton className="h-10 w-10" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Orders Grid Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i} className="shadow-lg border-l-4 border-l-yellow-500">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-5 w-5" />
                                            <Skeleton className="h-5 w-24" />
                                        </div>
                                        <Skeleton className="h-6 w-16" />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <Skeleton className="h-6 w-20" />
                                        <Skeleton className="h-9 w-24" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination Skeleton */}
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <Skeleton className="h-10 w-20" />
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-10 w-10" />
                            ))}
                        </div>
                        <Skeleton className="h-10 w-20" />
                    </div>
                </div>
            </div>
        </div>
    );
} 