import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

// app/dashboard/analytics/page.tsx
import { getOverallAnalytics } from '../actions/getOverallAnalytics';
import OverallAnalyticsDashboard from './OverallAnalyticsDashboard';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const from = typeof params.from === 'string' ? params.from : undefined;
  const to = typeof params.to === 'string' ? params.to : undefined;

  try {
    const analyticsData = await getOverallAnalytics(from, to);

    // Add type guard to ensure data exists
    if (!analyticsData) {
      throw new Error('No analytics data found');
    }

    return (
      <div className="container mx-auto py-8 px-4 md:px-6" dir="rtl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-primary md:text-3xl text-center flex-grow">
            لوحة تحكم التحليلات العامة
          </h1>
        </div>
        <Suspense fallback={<DashboardSkeleton />}>
          <OverallAnalyticsDashboard initialData={analyticsData} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Failed to load analytics:', error);
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 text-center" dir="rtl">
        <h1 className="text-2xl font-bold text-primary md:text-3xl mb-6">
          لوحة تحكم التحليلات العامة
        </h1>
        <p className="text-destructive">
          حدث خطأ أثناء تحميل بيانات التحليلات. يرجى المحاولة مرة أخرى.
        </p>
      </div>
    );
  }
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-48 rounded-lg" />
        <Skeleton className="h-48 rounded-lg" />
      </div>
    </div>
  );
}