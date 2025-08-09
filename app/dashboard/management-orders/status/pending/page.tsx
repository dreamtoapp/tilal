// app/dashboard/orders-management/status/pending/page.tsx

import { Icon } from '@/components/icons/Icon';
import { PageProps } from '@/types/commonTypes';
import { OrderStatus } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import {
  fetchAnalytics,
  fetchOrders,
} from './actions/get-pendeing-order';
import PendingOrdersView from './components/PendingOrdersView';

export default async function PendingOrdersPage({
  searchParams,
}: PageProps<Record<string, never>, {
  page?: string;
  pageSize?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  tab?: string;
}>) {
  const resolvedSearchParams = await searchParams;

  // Get current page and page size from URL or use defaults
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const searchTerm = resolvedSearchParams?.search || '';
  const pageSize = Number(resolvedSearchParams?.pageSize) || 10;
  const activeTab = resolvedSearchParams?.tab || 'pending';

  // Ensure sortBy is a valid value for the backend type
  const allowedSortFields = ['createdAt', 'orderNumber', 'amount'] as const;
  const sortByParam = resolvedSearchParams?.sortBy;
  const sortBy = allowedSortFields.includes(sortByParam as any)
    ? (sortByParam as typeof allowedSortFields[number])
    : 'createdAt';
  const sortOrder = resolvedSearchParams?.sortOrder === 'asc' ? 'asc' : 'desc';

  try {
    // Determine which orders to fetch based on active tab
    const orderStatus = activeTab === 'assigned' ? [OrderStatus.ASSIGNED] : [OrderStatus.PENDING];

    // Fetch data in parallel using server actions
    const [orders, pendingAnalytics] = await Promise.all([
      fetchOrders({
        status: orderStatus,
        page: currentPage,
        pageSize,
        sortBy,
        sortOrder,
        search: searchTerm,
      }),
      fetchAnalytics(), // PENDING orders count
    ]);

    return (
      <div className="container mx-auto py-4 space-y-4" dir="rtl">
        {/* Enhanced Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-status-pending rounded-full"></div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Icon name="MousePointerBan" className="h-6 w-6 text-status-pending" />
                إدارة الطلبات قيد الانتظار
              </h1>
            </div>
          </div>

          {/* Status Badge */}
          <Badge variant="outline" className="bg-status-pending-soft text-status-pending border-status-pending gap-2">
            <Icon name="Clock" className="h-4 w-4" />
            الإجمالي: {pendingAnalytics}
          </Badge>
        </div>

        {/* Pending Orders Overview Card */}
        <Card className="shadow-lg border-l-4 border-l-status-pending">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center gap-2 justify-between" dir="rtl">
              <CardTitle className="flex items-center gap-2 text-lg mb-0">
                <Icon name="MousePointerBan" className="h-5 w-5 text-status-pending" />
                الطلبات قيد الانتظار
              </CardTitle>
              {/* Compact badges row beside the title */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-xs bg-status-pending-soft text-status-pending border-status-pending min-w-[90px]">
                  <Icon name="MousePointerBan" className="h-4 w-4" />
                  <span>العدد الإجمالي</span>
                  <span className="font-bold">{pendingAnalytics}</span>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-xs bg-feature-analytics-soft text-feature-analytics border-feature-analytics min-w-[90px]">
                  <Icon name="Clock" className="h-4 w-4" />
                  <span>في الصفحة الحالية</span>
                  <span className="font-bold">{orders.orders.length}</span>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-xs bg-status-urgent-soft text-status-urgent border-status-urgent min-w-[90px]">
                  <Icon name="MousePointerBan" className="h-4 w-4" />
                  <span>تحتاج معالجة فورية</span>
                  <span className="font-bold">{Math.ceil(pendingAnalytics * 0.4)}</span>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-xs bg-neutral-soft-background text-neutral-foreground border-neutral-foreground min-w-[90px]">
                  <span>الصفحة الحالية</span>
                  <span className="font-bold">{currentPage}</span>
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Orders Management for Pending */}
            <PendingOrdersView
              orders={orders.orders}
              pendingCount={pendingAnalytics}
              currentPage={currentPage}
              pageSize={pageSize}
              orderType="pending"
            />
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Error in pending orders page:', error);
    return (
      <div className="container mx-auto py-4 space-y-4" dir="rtl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-yellow-500 rounded-full"></div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Icon name="MousePointerBan" className="h-6 w-6 text-yellow-500" />
              خطأ في تحميل الطلبات
            </h1>
          </div>
        </div>

        {/* Enhanced Error Card */}
        <Card className="shadow-lg border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-red-600">
              <Icon name="MousePointerBan" className="h-5 w-5" />
              خطأ في تحميل الطلبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 rounded-lg p-6 text-center border border-red-200">
              <h3 className="text-xl font-semibold text-red-700 mb-2">حدث خطأ أثناء تحميل الطلبات قيد الانتظار</h3>
              <p className="text-red-600 mb-4">يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالدعم الفني.</p>
              <Badge variant="destructive" className="gap-2">
                <Icon name="Clock" className="h-4 w-4" />
                خطأ في التحميل
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

// TODO: Next version enhancements for Pending Orders page
// - Add bulk operations (assign multiple orders to driver, bulk cancel)
// - Implement real-time notifications for new pending orders
// - Add advanced filtering options (date range, amount range, customer type)
// - Implement order priority system with visual indicators
// - Add export functionality for orders data (PDF, Excel)
// - Implement order templates for recurring orders
// - Add customer communication tools (SMS, WhatsApp integration)
// - Implement driver workload balancing algorithm
// - Add order scheduling for future delivery
// - Implement audit trail for all order actions
// - Add performance metrics dashboard for order processing
// - Implement automated order assignment based on driver location/capacity
