"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function DriverPageLoading() {
    return (
        <div className="flex flex-col gap-4 p-4">
            {/* Simulate ActiveTrip card */}
            <div className="rounded-xl border bg-card text-card-foreground shadow p-4 flex flex-col gap-3 max-w-md mx-auto">
                <div className="flex items-center gap-3 mb-2">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-2 rounded" />
                        <Skeleton className="h-4 w-24 rounded" />
                    </div>
                    <Skeleton className="h-7 w-16 rounded" />
                </div>
                <Skeleton className="h-4 w-full rounded mb-2" />
                <Skeleton className="h-3 w-3/4 rounded mb-2" />
                <div className="flex gap-2 mt-2">
                    <Skeleton className="h-10 w-24 rounded" />
                    <Skeleton className="h-10 w-24 rounded" />
                    <Skeleton className="h-10 w-24 rounded" />
                </div>
            </div>
            {/* Simulate NoActiveOrder state */}
            <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
                <div className="bg-card rounded-xl shadow-lg p-8 flex flex-col items-center max-w-md w-full border border-border">
                    <Skeleton className="h-16 w-16 rounded-full mb-4" />
                    <Skeleton className="h-6 w-48 mb-2 rounded" />
                    <Skeleton className="h-4 w-64 mb-2 rounded" />
                    <Skeleton className="h-4 w-40 mb-2 rounded" />
                    <Skeleton className="h-4 w-32 mb-2 rounded" />
                </div>
            </div>
        </div>
    );
} 