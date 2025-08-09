import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AssignDriverLoading() {
    return (
        <div className="font-cairo p-4 bg-background min-h-screen" dir="rtl">
            <div className="max-w-7xl mx-auto space-y-4">

                {/* Header */}
                <div className="flex flex-col gap-4">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-72" />
                            <Skeleton className="h-4 w-96" />
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                </div>

                {/* Driver Statistics */}
                <div className="grid gap-4 md:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="border-l-4 border-l-muted-foreground/20">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-5 w-5 rounded" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-24" />
                                        <Skeleton className="h-6 w-12" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-4">

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Order Summary */}
                        <Card className="border-l-4 border-l-muted-foreground/20">
                            <CardHeader className="pb-4">
                                <Skeleton className="h-5 w-32" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Smart Suggestions */}
                        <Card className="border-l-4 border-l-muted-foreground/20">
                            <CardHeader className="pb-4">
                                <Skeleton className="h-5 w-28" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="space-y-1 flex-1">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Driver Selection */}
                    <div className="lg:col-span-3">
                        <Card className="border-l-4 border-l-muted-foreground/20">
                            <CardHeader className="pb-4">
                                <Skeleton className="h-5 w-40" />
                            </CardHeader>
                            <CardContent>
                                {/* Filters */}
                                <div className="mb-6 space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Skeleton className="h-10 w-full sm:w-64" />
                                        <Skeleton className="h-10 w-full sm:w-32" />
                                        <Skeleton className="h-10 w-full sm:w-32" />
                                    </div>
                                </div>

                                {/* Driver Grid */}
                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <Card key={i} className="border-l-4 border-l-muted-foreground/20">
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-3">
                                                    <Skeleton className="h-12 w-12 rounded-full" />
                                                    <div className="flex-1 space-y-2">
                                                        <Skeleton className="h-4 w-24" />
                                                        <div className="flex items-center gap-1">
                                                            <Skeleton className="h-3 w-12" />
                                                            <Skeleton className="h-3 w-8" />
                                                        </div>
                                                        <Skeleton className="h-3 w-16" />
                                                    </div>
                                                </div>
                                                <div className="mt-4 space-y-2">
                                                    <div className="flex justify-between">
                                                        <Skeleton className="h-3 w-12" />
                                                        <Skeleton className="h-3 w-16" />
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <Skeleton className="h-3 w-16" />
                                                        <Skeleton className="h-3 w-12" />
                                                    </div>
                                                </div>
                                                <Skeleton className="h-9 w-full mt-4" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
} 