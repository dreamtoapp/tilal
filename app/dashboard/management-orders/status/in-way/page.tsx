// app/dashboard/orders-management/status/in-way/page.tsx

import { Metadata } from 'next';
import { Icon } from '@/components/icons/Icon';

import { ORDER_STATUS } from '@/constant/order-status';

import {
  fetchAnalytics,
  fetchOrders,
} from './actions/get-inWay-order';
import InWayOrdersView from './components/InWayOrdersView';
import SyncActiveTripButton from './components/SyncActiveTripButton';

export const metadata: Metadata = {
  title: 'الطلبات في الطريق | لوحة التحكم',
  description: 'إدارة الطلبات التي في طريقها للتسليم',
};

// Page Header Component
interface PageHeaderProps {
  analytics?: number;
  showActions?: boolean;
}

function PageHeader({ analytics, showActions = false }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2 min-h-[80px] md:min-h-[60px]">
      <div className="space-y-1">
        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
          <Icon name="Truck" className="h-6 w-6 text-feature-commerce" />
          الطلبات في الطريق
        </h2>
        <p className="text-muted-foreground">إدارة الطلبات التي في طريقها للتسليم</p>
      </div>

      {showActions && analytics !== undefined && (
        <div className="flex items-center gap-3 flex-shrink-0">
          <SyncActiveTripButton />
          <div className="flex items-center gap-2">
            <Icon name="Truck" className="h-5 w-5 text-feature-commerce" />
            <span className="rounded-lg bg-feature-commerce-soft border border-feature-commerce px-4 py-2 text-feature-commerce font-semibold text-sm shadow-sm whitespace-nowrap">
              في الطريق: <span className="font-bold">{analytics}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Error State Component
function ErrorState() {
  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
      <h3 className="text-xl font-semibold text-destructive mb-2">حدث خطأ أثناء تحميل الطلبات</h3>
      <p className="text-destructive/80">يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالدعم الفني.</p>
    </div>
  );
}

// Page Layout Wrapper
interface PageLayoutProps {
  children: React.ReactNode;
}

function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="font-cairo relative flex flex-col space-y-4 p-4 bg-background" dir="rtl">
      {children}
    </div>
  );
}

// Main Content Component
interface MainContentProps {
  orders: any[];
  analytics: number;
  currentPage: number;
  pageSize: number;
  driverId: string;
}

function MainContent({ orders, analytics, currentPage, pageSize, driverId }: MainContentProps) {
  return (
    <>
      <PageHeader analytics={analytics} showActions={true} />
      <InWayOrdersView
        orders={orders}
        inWayCount={analytics}
        currentPage={currentPage}
        pageSize={pageSize}
        selectedDriverId={driverId}
      />
    </>
  );
}

// Main Page Component
export default async function InWayOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string; driverId?: string }>;
}) {
  const awaitedSearchParams = await searchParams;
  const currentPage = Number(awaitedSearchParams.page) || 1;
  const pageSize = Number(awaitedSearchParams.pageSize) || 10;
  const driverId = awaitedSearchParams.driverId || 'all';

  try {
    const [orders, analytics] = await Promise.all([
      fetchOrders({
        status: ORDER_STATUS.IN_TRANSIT,
        driverId: driverId !== 'all' ? driverId : undefined,
      }),
      fetchAnalytics(),
    ]);

    return (
      <PageLayout>
        <MainContent
          orders={orders.orders}
          analytics={analytics}
          currentPage={currentPage}
          pageSize={pageSize}
          driverId={driverId}
        />
      </PageLayout>
    );
  } catch (error) {
    console.error('Error loading in-way orders:', error);

    return (
      <PageLayout>
        <PageHeader showActions={false} />
        <ErrorState />
      </PageLayout>
    );
  }
}
