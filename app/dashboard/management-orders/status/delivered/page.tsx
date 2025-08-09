// app/dashboard/orders-management/status/delivered/page.tsx
import { Metadata } from 'next';
import { Icon } from '@/components/icons/Icon';

import { ORDER_STATUS } from '@/constant/order-status';

import {
  fetchAnalytics,
  fetchOrders,
} from './actions/get-delevired-order';
import DeliveredOrdersView from './components/DeliveredOrdersView';

export const metadata: Metadata = {
  title: 'الطلبات المسلمة | لوحة التحكم',
  description: 'إدارة الطلبات التي تم تسليمها بنجاح',
};

interface PageProps {
  params: Promise<Record<string, never>>;
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    dateRange?: string;
  }>;
}

export default async function DeliveredOrdersPage({
  params,
  searchParams
}: PageProps) {
  // Resolve promises in parallel
  const [_, resolvedSearchParams] = await Promise.all([
    params, // Resolve even if unused
    searchParams
  ]);

  // Destructure and validate parameters
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1)
  const pageSize = Math.max(10, Number(resolvedSearchParams.pageSize) || 10)
  const dateRange = (
    resolvedSearchParams.dateRange || 'all'
  ) as 'all' | 'today' | 'week' | 'month' | 'year';

  try {
    // Parallel data fetching
    const [orders, analytics] = await Promise.all([
      fetchOrders({
        status: ORDER_STATUS.DELIVERED,
        page: currentPage,
        pageSize,
        dateRange,
      }),
      fetchAnalytics(),
    ]);

    return (
      <div className="font-cairo relative flex flex-col space-y-6 p-4" dir="rtl">
        {/* Clean Header Card */}
        <div className="bg-muted/30 rounded-lg shadow-sm border-0 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-foreground">
                    الطلبات المسلمة
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    إدارة الطلبات التي تم تسليمها بنجاح
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium bg-green-50 text-green-800 border border-green-200">
                <Icon name="CheckCircle" className="w-4 h-4" />
                تم التسليم: {analytics}
              </div>
            </div>
          </div>
        </div>

        <DeliveredOrdersView
          orders={orders.orders}
          deliveredCount={analytics}
          currentPage={currentPage}
          pageSize={pageSize}
          dateRange={dateRange}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading delivered orders:', error);
    return (
      <div className="font-cairo relative flex flex-col space-y-6 p-4" dir="rtl">
        {/* Clean Header Card */}
        <div className="bg-muted/30 rounded-lg shadow-sm border-0 p-6">
          <div className="flex items-center gap-3">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-foreground">
                الطلبات المسلمة
              </h2>
              <p className="text-sm text-muted-foreground">
                إدارة الطلبات التي تم تسليمها بنجاح
              </p>
            </div>
          </div>
        </div>

        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-destructive mb-2">
            حدث خطأ أثناء تحميل الطلبات
          </h3>
          <p className="text-destructive/80">
            يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالدعم الفني.
          </p>
        </div>
      </div>
    );
  }
}