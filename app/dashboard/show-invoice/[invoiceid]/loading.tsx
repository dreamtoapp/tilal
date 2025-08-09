import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Icon } from '@/components/icons/Icon';

function Loading() {
  return (
    <div className="font-cairo p-4 bg-background min-h-screen" dir="rtl">
      <div className="mx-auto max-w-4xl space-y-4">
        {/* Header Section Skeleton */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-32" /> {/* BackButton */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon name="Receipt" className="h-6 w-6 text-feature-commerce" />
                <Skeleton className="h-8 w-64" /> {/* Title */}
              </div>
              <Skeleton className="h-4 w-48" /> {/* Subtitle */}
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Skeleton className="h-10 w-36" /> {/* Email Button */}
              <Skeleton className="h-10 w-32" /> {/* Driver Button */}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Customer Information Card Skeleton */}
          <Card className="shadow-lg border-l-4 border-l-feature-users lg:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Icon name="User" className="h-5 w-5 text-feature-users" />
                معلومات العميل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Items Card Skeleton */}
          <Card className="shadow-lg border-l-4 border-l-feature-products lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Icon name="Package" className="h-5 w-5 text-feature-products" />
                عناصر الطلب
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Mobile Cards Skeleton */}
              <div className="block lg:hidden space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="border border-muted">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-6 w-12 rounded-full" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-px w-full" />
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop Table Skeleton */}
              <div className="hidden lg:block">
                <div className="overflow-hidden rounded-lg border border-border">
                  <div className="bg-muted/50 border-b border-border p-4">
                    <div className="grid grid-cols-4 gap-4">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-12" />
                      <Skeleton className="h-5 w-12" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="border-b border-border last:border-b-0 p-4">
                      <div className="grid grid-cols-4 gap-4 items-center">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-6 w-8 rounded-full" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary Card Skeleton */}
          <Card className="shadow-lg border-l-4 border-l-feature-analytics lg:col-span-3">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Icon name="Calculator" className="h-5 w-5 text-feature-analytics" />
                ملخص الفاتورة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className={`flex items-center gap-3 p-4 rounded-lg ${index === 2 ? 'bg-feature-analytics-soft border border-feature-analytics md:col-span-2 lg:col-span-1' : 'bg-muted/30'}`}>
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className={`h-6 w-24 ${index === 2 ? 'h-8 w-28' : ''}`} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Loading;
