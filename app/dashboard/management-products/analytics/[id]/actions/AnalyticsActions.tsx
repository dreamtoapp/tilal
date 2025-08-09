'use client';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/databaseTypes';
import { Icon } from '@/components/icons/Icon';

// Re-define or import necessary types (consider moving to shared file if used elsewhere)
interface SalesByMonthData {
    month: string;
    sales: number;
    orders?: number;
    revenue?: number;
}

// Define OrderHistoryItem type (copied from ClientAnalyticsDashboard)
interface OrderHistoryItem {
    id: string; // Assuming OrderItem ID
    quantity: number;
    price?: number;
    orderId: string;
    order?: {
        createdAt?: string | Date;
        customerName?: string | null;
        status?: string;
        orderNumber?: string;
    } | null;
}

interface AnalyticsData {
    product: Product;
    totalSales: number;
    totalOrders: number;
    totalCustomers?: number;
    salesByMonth: SalesByMonthData[];
    orderHistory: OrderHistoryItem[]; // Use specific type
    // Add other fields if present
}

export default function AnalyticsActions({ analytics, id }: { analytics: AnalyticsData; id: string }) {
    const handlePrint = () => {
        if (typeof window !== 'undefined') window.print();
    };
    const handleExport = () => {
        if (!analytics) return;
        const csvRows = [
            ['الشهر', 'المبيعات'],
            ...analytics.salesByMonth.map((row: SalesByMonthData) => [row.month, row.sales]),
        ];
        const csv = csvRows.map((r) => r.join(',')).join('\n');
        if (typeof window !== 'undefined') {
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `analytics_${id}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        }
    };
    return (
        <div className='flex gap-2'>
            <Button variant='outline' onClick={handlePrint} title='طباعة التحليلات'>
                <Icon name="Printer" size="sm" className="mr-1" />
                <span className='sr-only'>طباعة</span>
            </Button>
            <Button variant='outline' onClick={handleExport} title='تصدير التحليلات'>
                <Icon name="FileDown" size="sm" className="mr-1" />
                <span className='sr-only'>تصدير</span>
            </Button>
        </div>
    );
} 