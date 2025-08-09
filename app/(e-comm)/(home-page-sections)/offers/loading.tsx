import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function OffersLoading() {
  return (
    <div className="container mx-auto bg-background px-4 py-8 text-foreground">
      {/* Hero Section Skeleton */}
      <div className="mb-12 text-center">
        <Skeleton className="h-12 w-64 mx-auto mb-3" />
        <Skeleton className="h-6 w-96 mx-auto" />
        <div className="mt-4">
          <Skeleton className="h-8 w-32 mx-auto" />
        </div>
      </div>

      {/* Featured Offer Skeleton */}
      <div className="mb-12">
        <Skeleton className="h-8 w-48 mb-4" />
        <Card className="col-span-full md:col-span-2">
          <div className="relative aspect-video">
            <Skeleton className="absolute inset-0" />
          </div>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64 mb-3" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <div className="relative aspect-video">
              <Skeleton className="absolute inset-0" />
            </div>
            <CardContent className="p-4">
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-4 w-48 mb-3" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 