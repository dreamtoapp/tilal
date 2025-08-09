import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function OfferLoading() {
    return (
        <div className="container mx-auto bg-background px-4 py-8 text-foreground">
            <div className="mb-6">
                <Skeleton className="h-10 w-32 rounded" />
            </div>
            <Card className="shadow-lg border-l-4 border-feature-commerce card-hover-effect card-border-glow mt-6">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-6 w-32 rounded" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-6">
                        <Skeleton className="w-full md:w-1/3 h-48 md:h-64 rounded-lg" />
                        <div className="flex-1 flex flex-col gap-2">
                            <Skeleton className="h-8 w-40 rounded" />
                            <Skeleton className="h-4 w-64 rounded" />
                            <Skeleton className="h-4 w-80 rounded mt-2" />
                            <div className="flex items-center gap-4 mt-2">
                                <Skeleton className="h-6 w-20 rounded" />
                                <Skeleton className="h-6 w-20 rounded" />
                            </div>
                            <Skeleton className="h-4 w-24 mt-1 rounded" />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <h2 className="mt-12 mb-6 text-2xl font-bold">
                <Skeleton className="h-8 w-48 rounded" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="shadow-md border-l-4 border-feature-products card-hover-effect">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Skeleton className="h-10 w-10 rounded" />
                                <Skeleton className="h-5 w-24 rounded" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-32 rounded" />
                            <div className="mt-2 flex items-center gap-2">
                                <Skeleton className="h-4 w-12 rounded" />
                            </div>
                            <Skeleton className="h-8 w-20 mt-3 rounded" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 