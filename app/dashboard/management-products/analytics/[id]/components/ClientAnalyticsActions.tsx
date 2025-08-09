'use client';
import { Printer, FileDown } from 'lucide-react';
import { iconVariants } from '@/lib/utils';
import { Button } from '@/components/ui/button';
// ProductType will come from AnalyticsData -> types/product
import { AnalyticsData, SalesByMonthData } from '@/types/analytics'; // Import shared types

// Local interface definitions are removed.

export default function ClientAnalyticsActions({ analytics, id }: { analytics: AnalyticsData; id: string }) {
    const handlePrint = () => {
        // Consider printing a specific element (e.g., the analyticsRef from parent)
        // instead of window.print() for better control.
        if (typeof window !== 'undefined') window.print();
    };
    const handleExport = () => {
        if (!analytics) return;
        // Update CSV export to include new metrics if desired, or keep it simple.
        // Current export is only salesByMonth (which is now revenueByMonth).
        const csvRows = [
            ['الشهر', 'الإيرادات'], // Changed label from المبيعات to الإيرادات
            ...analytics.salesByMonth.map((row: SalesByMonthData) => [row.month, row.sales.toFixed(2)]), // .sales is revenue
        ];
        // Example: Add more data to CSV
        csvRows.push([]); // Empty row separator
        csvRows.push(['ملخص عام']);
        csvRows.push(['إجمالي الإيرادات', analytics.totalRevenue.toFixed(2)]);
        csvRows.push(['إجمالي الربح', analytics.totalProfit.toFixed(2)]);
        csvRows.push(['هامش الربح (%)', analytics.averageProfitMargin.toFixed(2)]);
        csvRows.push(['إجمالي الطلبات الفريدة', analytics.totalOrders.toString()]);
        csvRows.push(['إجمالي العملاء الفريدين', analytics.totalCustomers.toString()]);

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
                <Printer className={iconVariants({ size: 'sm' })} /> {/* Use direct import + CVA */}
                <span className='sr-only'>طباعة</span>
            </Button>
            <Button variant='outline' onClick={handleExport} title='تصدير التحليلات'>
                <FileDown className={iconVariants({ size: 'sm' })} /> {/* Use direct import + CVA */}
                <span className='sr-only'>تصدير</span>
            </Button>
        </div>
    );
} 