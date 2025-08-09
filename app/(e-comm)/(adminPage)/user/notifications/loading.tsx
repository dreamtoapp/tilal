import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <div className="max-w-2xl mx-auto p-4 space-y-4">
            <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-32" />
            </div>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-20" />
                ))}
            </div>
            {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2 p-4 border rounded-lg">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                </div>
            ))}
        </div>
    );
} 