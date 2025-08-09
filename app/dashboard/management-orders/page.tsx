
import { getOrderCounts } from './actions/get-order-counts';
import { fetchOrdersAction } from './actions/getAllOrders';
import OrderManagementView from './components/OrderManagementView';

export default async function OrdersManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const statusFilter = resolvedSearchParams.status || undefined;

  // Fetch orders data and counts in parallel
  const [filteredOrders, orderCounts] = await Promise.all([
    fetchOrdersAction({
      status: statusFilter,
      page: 1,
      pageSize: 12, // Match infinite scroll page size
    }),
    getOrderCounts()
  ]);

  return (
    <div className="space-y-6">
      {/* Simplified Order Management View - No Analytics */}
      <OrderManagementView
        initialOrders={filteredOrders ?? []}
        statusFilter={statusFilter}
        orderCounts={orderCounts}
      />
    </div>
  );
}

