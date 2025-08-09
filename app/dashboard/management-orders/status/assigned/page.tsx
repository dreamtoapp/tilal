// Assigned Orders Page
import { Icon } from '@/components/icons/Icon';
import AssignedOrdersView from './components/AssignedOrdersView';
import { fetchDriversWithAssignedOrders } from './actions/get-drivers-with-orders';

export default async function AssignedOrdersPage() {
    const drivers = await fetchDriversWithAssignedOrders();
    return (
        <div className="container mx-auto py-4 space-y-4" dir="rtl">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-feature-analytics rounded-full"></div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Icon name="UserCheck" className="h-6 w-6 text-feature-analytics" />
                    إدارة الطلبات المُخصصة للسائقين
                </h1>
            </div>
            <AssignedOrdersView drivers={drivers} />
        </div>
    );
} 