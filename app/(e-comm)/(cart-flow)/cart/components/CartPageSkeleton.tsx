import { Skeleton } from '@/components/ui/skeleton';

export default function CartPageSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-center gap-2 mb-8 text-sm">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-24 h-6 rounded" />
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-24 h-6 rounded" />
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-24 h-6 rounded" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Cart Items Skeleton */}
        <div className="xl:col-span-8 space-y-6">
          <div className="shadow-lg rounded-xl p-6 bg-card">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-40 rounded" />
              <Skeleton className="h-8 w-24 rounded" />
            </div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 bg-feature-commerce-soft/30 rounded-lg border border-feature-commerce/20">
                  <Skeleton className="w-24 h-24 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-32 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-6 w-20 rounded" />
                  </div>
                  <div className="flex flex-col gap-2 justify-center items-end">
                    <Skeleton className="h-10 w-32 rounded" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Order Summary Skeleton */}
        <div className="xl:col-span-4">
          <div className="sticky top-4">
            <div className="shadow-lg rounded-xl p-6 space-y-6 bg-card">
              <Skeleton className="h-6 w-32 rounded mb-4" />
              <Skeleton className="h-4 w-40 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-8 w-40 rounded mt-4" />
              <Skeleton className="h-12 w-full rounded mt-4" />
              <Skeleton className="h-12 w-full rounded" />
            </div>
          </div>
        </div>
      </div>
      <div className="h-20 xl:hidden" />
    </div>
  );
} 