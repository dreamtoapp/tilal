// app/dashboard/orders-management/status/canceled/page.tsx

import { Metadata } from 'next';

import { ORDER_STATUS } from '@/constant/order-status';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';

import {
  fetchAnalytics,
  fetchOrders,
} from './actions/get-canceld-order';
import CanceledOrdersView from './components/CanceledOrdersView';

export const metadata: Metadata = {
  title: 'الطلبات الملغية | لوحة التحكم',
  description: 'إدارة الطلبات التي تم إلغاؤها',
};

// Reusable PageHeader component
function PageHeader({ analytics }: { analytics?: number }) {
  return (
    <Card className="border-feature-commerce shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon name="XCircle" className="h-6 w-6 text-red-600" />
            <span className="text-2xl font-bold">الطلبات الملغية</span>
          </div>
          {analytics !== undefined && (
            <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">
              {analytics} طلب ملغي
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

// Reusable ErrorCard component
function ErrorCard() {
  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="text-center py-8">
        <h3 className="text-xl font-semibold text-destructive mb-2">حدث خطأ أثناء تحميل الطلبات</h3>
        <p className="text-destructive/80">يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالدعم الفني.</p>
      </CardContent>
    </Card>
  );
}

export default async function CanceledOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string; reason?: string }>;
}) {
  const searchParamsData = await searchParams;
  const currentPage = Number(searchParamsData.page ?? "1") || 1;
  const pageSize = Number(searchParamsData.pageSize ?? "10") || 10;
  const reasonFilter = searchParamsData.reason || "";

  try {
    const [orders, analytics] = await Promise.all([
      fetchOrders({
        status: ORDER_STATUS.CANCELED,
        page: currentPage,
        pageSize: pageSize,
        reason: reasonFilter,
      }),
      fetchAnalytics(),
    ]);

    return (
      <div className="font-cairo space-y-6 p-6" dir="rtl">
        <PageHeader analytics={analytics} />
        <CanceledOrdersView
          orders={orders.orders}
          canceledCount={analytics}
          currentPage={currentPage}
          pageSize={pageSize}
          reasonFilter={reasonFilter}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading canceled orders:', error);

    return (
      <div className="font-cairo space-y-6 p-6" dir="rtl">
        <PageHeader />
        <ErrorCard />
      </div>
    );
  }
}
