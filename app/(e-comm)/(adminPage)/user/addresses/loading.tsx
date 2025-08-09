import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AddressesLoading() {
    return (
        <div className="min-h-screen bg-muted/30 py-1 sm:py-2">
            <div className="container mx-auto px-2 sm:px-3 max-w-4xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-7 w-44 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-32 rounded-md" />
                </div>

                {/* Address Cards */}
                <div className="grid gap-4">
                    {[1, 2].map((i) => (
                        <Card key={i} className="shadow-lg border-l-4 border-l-feature-users">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <Skeleton className="h-5 w-5 rounded-full" />
                                        <Skeleton className="h-6 w-20" />
                                        <Skeleton className="h-5 w-16 rounded-md" /> {/* badge skeleton */}
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-4 w-2/3" />
                                    <Skeleton className="h-4 w-1/4" />
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                    <Skeleton className="h-9 w-full rounded-md" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
} 