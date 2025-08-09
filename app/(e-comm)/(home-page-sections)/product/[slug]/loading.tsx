import { Separator } from '@/components/ui/separator';

export default function Loading() {
    return (
        <div className="container py-8 animate-pulse">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Image Gallery Skeleton */}
                <div className="relative">
                    <div className="aspect-square w-full rounded-2xl bg-muted/40" />
                    <div className="flex gap-2 mt-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-16 w-16 rounded-md bg-muted/30" />
                        ))}
                    </div>
                </div>
                {/* Product Details Skeleton */}
                <div className="space-y-6">
                    <div>
                        <div className="h-7 w-2/3 rounded bg-muted/30 mb-2" />
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-5 w-24 rounded bg-muted/20" />
                            <div className="h-5 w-16 rounded bg-muted/20" />
                            <div className="h-5 w-16 rounded bg-muted/20" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <div className="h-8 w-32 rounded bg-muted/20" />
                        <div className="h-6 w-20 rounded bg-muted/10" />
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        <div className="h-4 w-3/4 rounded bg-muted/20" />
                        <div className="h-4 w-1/2 rounded bg-muted/20" />
                    </div>
                    <div className="pt-4 flex gap-2">
                        <div className="h-10 w-32 rounded bg-muted/30" />
                        <div className="h-10 w-10 rounded-full bg-muted/20" />
                    </div>
                    <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
                        <div className="h-5 w-5 rounded-full bg-muted/20" />
                        <div className="h-4 w-32 rounded bg-muted/20" />
                    </div>
                </div>
            </div>
            {/* Tabs Skeleton */}
            <div className="mt-12">
                <div className="flex gap-4 mb-4">
                    <div className="h-8 w-24 rounded bg-muted/20" />
                    <div className="h-8 w-24 rounded bg-muted/20" />
                </div>
                <div className="prose prose-sm max-w-none space-y-4">
                    <div className="h-5 w-1/2 rounded bg-muted/20" />
                    <div className="h-4 w-3/4 rounded bg-muted/10" />
                    <div className="h-4 w-2/3 rounded bg-muted/10" />
                    <div className="h-4 w-1/2 rounded bg-muted/10" />
                </div>
            </div>
        </div>
    );
} 