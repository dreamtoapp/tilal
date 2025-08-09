"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function DriverAnalyticsLoading() {
    return (
        <div className="flex flex-col gap-4 p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold text-center mb-2">إحصائيات السائق</h1>
            <div className="grid grid-cols-3 gap-2">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="rounded-lg p-3 flex flex-col items-center bg-muted">
                        <Skeleton className="h-7 w-7 rounded-full mb-1" />
                        <Skeleton className="h-5 w-8 rounded mb-1" />
                        <Skeleton className="h-3 w-12 rounded" />
                    </div>
                ))}
            </div>
            <div className="bg-background rounded-lg p-4 shadow mt-2">
                <Skeleton className="h-5 w-32 rounded mb-4" />
                <div className="flex items-end gap-2 h-24">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center justify-end">
                            <Skeleton className="rounded w-6" style={{ height: `${20 + i * 8}px` }} />
                            <Skeleton className="h-2 w-8 rounded mt-1" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-background rounded-lg p-4 shadow mt-2">
                <Skeleton className="h-5 w-32 rounded mb-4" />
                <ul className="flex flex-col gap-2">
                    {[...Array(3)].map((_, i) => (
                        <li key={i} className="flex items-center gap-2 p-2 rounded-lg bg-accent">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-3 w-12 rounded" />
                            <Skeleton className="h-3 w-16 rounded" />
                            <Skeleton className="h-3 w-14 rounded" />
                            <Skeleton className="ml-auto h-3 w-10 rounded" />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
} 