'use client';
import { useCallback } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

interface AnalyticsOrder {
  orderId: string;
  date: string;
  customer: string;
  quantity: number;
  status: string;
  price: number;
}

interface AnalyticsData {
  productName: string;
  totalSales: number; // This is actually totalRevenue from the source
  totalOrders: number;
  totalCustomers: number;
  totalProfit?: number; // Added
  averageProfitMargin?: number; // Added
  bestSeller: string;
  salesByMonth: { month: string; orders: number; sales: number; revenue: number }[]; // sales here is monthly revenue
  orderHistory: AnalyticsOrder[];
}

interface Company {
  fullName: string;
  address: string;
  phoneNumber: string;
  email: string;
  taxNumber: string;
  website: string;
  logo: string;
}

interface ExportAnalyticsPdfButtonProps {
  data: AnalyticsData;
  fileName?: string;
  className?: string;
  company?: Company;
}

/**
 * ExportAnalyticsPdfButton - A lightweight CSV export alternative to PDF export
 *
 * This component exports analytics data as CSV instead of PDF to reduce bundle size.
 * The jspdf library was removed to improve initial load performance.
 */
export default function ExportAnalyticsPdfButton({
  data,
  fileName = 'تقرير-تحليلات-المنتج',
  className = '',
}: ExportAnalyticsPdfButtonProps) {
  const handleExport = useCallback(() => {
    try {
      // Create CSV content
      let csvContent = 'data:text/csv;charset=utf-8,';

      // Add header
      csvContent += 'تقرير تحليلات المنتج\n';
      csvContent += `اسم المنتج: ${data.productName}\n\n`;

      // Add summary data
      csvContent += 'إجمالي الإيرادات,إجمالي الربح,هامش الربح (%),إجمالي الطلبات,إجمالي العملاء\n';
      csvContent += `${data.totalSales.toFixed(2)},${(data.totalProfit ?? 0).toFixed(2)},${(data.averageProfitMargin ?? 0).toFixed(2)}%,${data.totalOrders},${data.totalCustomers}\n\n`;
      // Note: data.bestSeller is not included in this summary line for brevity, can be added if needed.

      // Add sales by month
      csvContent += 'الشهر,عدد الطلبات,الإيرادات (ر.س)\n'; // Simplified: 'sales' and 'revenue' in salesByMonth are the same (monthly revenue)
      data.salesByMonth.forEach((row) => {
        // Assuming row.sales is the monthly revenue. row.orders might not be available from getAnalytics.ts yet.
        csvContent += `${row.month},${row.orders || 0},${row.sales.toFixed(2)}\n`;
      });

      // Add order history if exists
      if (data.orderHistory && data.orderHistory.length > 0) {
        csvContent += '\nرقم الطلب,التاريخ,العميل,الكمية,الحالة,السعر (ر.س)\n';
        data.orderHistory.forEach((order) => {
          csvContent += `${order.orderId},${order.date},${order.customer},${order.quantity},${order.status},${order.price}\n`;
        });
      }

      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${fileName}.csv`);
      document.body.appendChild(link);

      // Trigger download
      link.click();
      document.body.removeChild(link);

      toast.success('تم تصدير البيانات بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء تصدير البيانات');
    }
  }, [data, fileName]);

  return (
    <Button onClick={handleExport} className={className} variant='outline'>
      <span className='ml-1'>تصدير البيانات</span>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='h-5 w-5'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M19.5 14.25v4.125c0 .621-.504 1.125-1.125 1.125H5.625A1.125 1.125 0 0 1 4.5 18.375V14.25m15 0L12 19.5m7.5-5.25L12 19.5m0 0l-7.5-5.25M12 19.5V4.5'
        />
      </svg>
    </Button>
  );
}
