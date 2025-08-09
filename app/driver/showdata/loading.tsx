"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShowDataLoading() {
    return (
        <div className="flex min-h-screen flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-7 w-48 rounded" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                </div>
            </div>
            {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-xl border bg-card text-card-foreground shadow p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1">
                            <Skeleton className="h-4 w-32 mb-2 rounded" />
                            <Skeleton className="h-3 w-24 rounded" />
                        </div>
                        <Skeleton className="h-6 w-12 rounded" />
                    </div>
                    <Skeleton className="h-3 w-full rounded" />
                    <div className="flex gap-2 mt-2">
                        <Skeleton className="h-8 w-20 rounded" />
                        <Skeleton className="h-8 w-20 rounded" />
                        <Skeleton className="h-8 w-20 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
} 