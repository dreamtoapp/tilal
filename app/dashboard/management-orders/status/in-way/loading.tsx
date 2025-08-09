import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';

export default function InWayOrdersLoading() {
    return (
        <div className="font-cairo relative flex flex-col space-y-4 p-4 bg-background min-h-screen" dir="rtl">
            {/* Back Button Skeleton */}
            <Skeleton className="w-24 h-10" />

            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Icon name="Truck" className="h-6 w-6 text-feature-commerce" />
                        <Skeleton className="h-8 w-48" />
                    </div>
                    <Skeleton className="h-5 w-72" />
                </div>

                <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-32" />
                    <div className="flex items-center gap-2">
                        <Icon name="Truck" className="h-5 w-5 text-feature-commerce" />
                        <Skeleton className="h-10 w-28" />
                    </div>
                </div>
            </div>

            {/* View Mode Toggle Skeleton */}
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-32 rounded-md" />
                </div>
            </div>

            {/* Sort Controls Skeleton */}
            <Card className="shadow-sm border">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                        <Skeleton className="h-9 w-24" />
                    </div>
                </CardContent>
            </Card>

            {/* Orders Cards Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[...Array(4)].map((_, index) => (
                    <Card key={index} className="shadow-lg border-l-4 border-l-feature-commerce rounded-lg overflow-hidden">
                        <CardHeader className="pb-3 bg-card border-b">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-6 w-32" />
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 p-4">
                            {/* Customer & Driver Information Skeleton */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 border-b pb-2">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="h-5 w-24" />
                                    </div>
                                    <div className="space-y-2 pr-4">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-4 w-8" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-3 w-3 rounded" />
                                            <Skeleton className="h-4 w-28" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 border-b pb-2">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="h-5 w-24" />
                                    </div>
                                    <div className="space-y-2 pr-4">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-3 w-3 rounded" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="border-t my-4" />

                            {/* Order Details Skeleton */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
                                    <Skeleton className="h-4 w-4" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-5 w-20" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
                                    <Skeleton className="h-4 w-4" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-4 w-18" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex items-center justify-between gap-3 pt-3 border-t bg-muted/30 p-4">
                            <Skeleton className="h-9 flex-1" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-9 w-9 rounded-md" />
                                <Skeleton className="h-9 w-9 rounded-md" />
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
} 