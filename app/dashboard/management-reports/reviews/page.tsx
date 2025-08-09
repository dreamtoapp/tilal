import { PageProps } from '@/types/commonTypes';

import { getReviewsReportData } from './action/getReviewsReportData';
import ReviewsReportClient from './component/ReviewsReportClient';

export const dynamic = 'force-dynamic'; // Required

export default async function ReviewsReportPage({ searchParams }: PageProps<Record<string, never>, { from?: string; to?: string }>) {
  try {
    const resolvedSearchParams = await searchParams;
    const from = resolvedSearchParams?.from;
    const to = resolvedSearchParams?.to;

    // Fetch report data
    const data = await getReviewsReportData({ from, to });

    return (
      <div className='rtl mx-auto max-w-7xl px-4 py-10 text-right md:px-6'>
        <div className="flex justify-between items-center mb-8">
          <h1 className='text-3xl font-bold text-foreground'>تقرير التقييمات والمراجعات</h1>
        </div>
        <ReviewsReportClient {...data} initialFrom={from} initialTo={to} />
      </div>
    );
  } catch (error) {
    console.error('Error loading reviews report:', error);

    return (
      <div className='rtl mx-auto max-w-7xl px-4 py-10 text-right md:px-6'>
        <div className="flex justify-between items-center mb-8">
          <h1 className='text-3xl font-bold text-foreground'>تقرير التقييمات والمراجعات</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-red-700 mb-2">
            حدث خطأ أثناء تحميل التقرير
          </h3>
          <p className="text-red-600">
            يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالدعم الفني.
          </p>
        </div>
      </div>
    );
  }
}