import { Skeleton } from '@/components/ui/skeleton';
import ProductCardSkeleton from '@/app/(e-comm)/(home-page-sections)/product/cards/ProductCardSkeleton';

function CategorySkeleton() {
  return (
    <div className="mx-auto w-full bg-transparent shadow-sm rounded-xl">
      <div className="p-4">
        <div className="flex items-center justify-between pb-3">
          <div className="space-y-0.5">
            <Skeleton className="h-8 w-40 rounded" />
            <Skeleton className="h-4 w-64 rounded" />
          </div>
          <Skeleton className="h-6 w-24 rounded" />
        </div>
        <div className="w-full py-3 overflow-x-auto">
          <div className="flex gap-5 pb-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="relative h-44 w-72 rounded-xl shadow-md bg-muted flex-shrink-0">
                <Skeleton className="absolute inset-0 h-full w-full rounded-xl" />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <Skeleton className="h-6 w-32 mb-2 rounded" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-2 w-32 rounded-full bg-primary/30 mt-2" />
        </div>
      </div>
    </div>
  );
}

function PromotionSkeleton() {
  return (
    <section className="my-8">
      <Skeleton className="mb-4 h-8 w-48 rounded" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border shadow-sm bg-card">
            <Skeleton className="aspect-video w-full rounded-t-xl" />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-6 w-32 rounded" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-48 mb-3 rounded" />
              <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
      <div className="mt-8 flex w-full flex-col items-center py-6">
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className='container mx-auto flex flex-col gap-8 bg-background text-foreground px-4 sm:px-6 lg:px-8'>
      <section className="space-y-6" aria-label="Product categories">
        <CategorySkeleton />
      </section>
      <section className="space-y-6" aria-label="Featured promotions">
        <PromotionSkeleton />
      </section>
      <section className="space-y-6" aria-label="Featured products">
        <ProductGridSkeleton />
      </section>
    </div>
  );
}
