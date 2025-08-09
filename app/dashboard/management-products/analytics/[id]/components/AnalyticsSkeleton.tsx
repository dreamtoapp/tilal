'use client';
export default function AnalyticsSkeleton() {
    return (
        <div className='flex min-h-[300px] animate-pulse flex-col gap-4 rounded-xl bg-white p-6 shadow'>
            <div className='mb-2 h-8 w-1/3 rounded bg-muted'></div>
            <div className='mb-2 h-6 w-1/4 rounded bg-muted'></div>
            <div className='h-40 w-full rounded bg-muted'></div>
        </div>
    );
} 