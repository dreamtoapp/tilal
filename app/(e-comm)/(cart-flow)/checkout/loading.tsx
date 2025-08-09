import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, ArrowRight } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-muted/20">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div>
                            <Skeleton className="h-8 w-40 mb-2" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                    </div>
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Skeleton className="h-4 w-16" />
                        <ArrowRight className="h-3 w-3" />
                        <Skeleton className="h-4 w-20" />
                        <ArrowRight className="h-3 w-3" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - User Info Card Skeleton */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-lg border-l-4 border-feature-users card-hover-effect card-border-glow mb-8">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Skeleton className="h-5 w-5 rounded-full" />
                                    <Skeleton className="h-6 w-32" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-4 w-36" />
                                <div className="mt-4 flex flex-col gap-2">
                                    <Skeleton className="h-8 w-48 rounded" />
                                    <Skeleton className="h-10 w-56 rounded" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Right Column - Order Summary Skeleton */}
                    <div className="lg:col-span-1">
                        <div className="lg:sticky lg:top-6 space-y-6">
                            <Card className="shadow-lg border-l-4 border-feature-commerce">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <ShoppingCart className="h-5 w-5 text-feature-commerce" />
                                        <Skeleton className="h-6 w-32" />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-4 w-36" />
                                </CardContent>
                            </Card>
                            {/* Trust Indicators Skeleton */}
                            <Card className="shadow-sm mt-6">
                                <CardContent className="p-4 space-y-3">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-36" />
                                    <Skeleton className="h-4 w-28" />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
                {/* Mobile Summary Skeleton */}
                <div className="lg:hidden mt-8">
                    <Card className="shadow-lg border-l-4 border-feature-commerce">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ShoppingCart className="h-5 w-5 text-feature-commerce" />
                                <Skeleton className="h-5 w-32" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-4 w-24" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 