'use client';
import {
    useEffect,
    useRef,
    useState,
} from 'react';

import { useRouter } from 'next/navigation';

import { fetchCompany } from '@/app/dashboard/management/settings/actions/fetchCompany';
import { Button } from '@/components/ui/button';
import ExportAnalyticsPdfButton from '@/components/ui/ExportAnalyticsPdfButton';
import {
    AnalyticsData,
    OrderHistoryItem,
    SalesByMonthData,
} from '@/types/analytics';
import { Company } from '@/types/databaseTypes';

import AnalyticsChart from './AnalyticsChart';
import ChartTypeSwitcher from './ChartTypeSwitcher';
import ClientAnalyticsActions from './ClientAnalyticsActions';
import DateRangePicker from './DateRangePicker';
import ProductInfo from './ProductInfo';
import ProductOrderHistoryTable from './ProductOrderHistoryTable';
import ProductRatingsSection from './ProductRatingsSection';

export default function ClientAnalyticsDashboard({
    analytics,
    id,
    initialChartType = 'bar',
    initialFrom,
    initialTo,
}: {
    analytics: AnalyticsData;
    id: string;
    initialChartType?: string;
    initialFrom?: string;
    initialTo?: string;
}) {
    const router = useRouter();
    const [chartType, setChartType] = useState(initialChartType);
    const [currentFromDate, setCurrentFromDate] = useState(initialFrom || analytics.activityStartDate || '');
    const [currentToDate, setCurrentToDate] = useState(initialTo || analytics.activityEndDate || '');
    const analyticsRef = useRef<HTMLDivElement>(null);
    const [company, setCompany] = useState<Company | null>(null);

    useEffect(() => {
        fetchCompany().then(setCompany);
    }, []);

    const handleDateRangeChange = (newFrom: string, newTo: string) => {
        setCurrentFromDate(newFrom);
        setCurrentToDate(newTo);
        const params = new URLSearchParams();
        if (newFrom) params.set('from', newFrom);
        if (newTo) params.set('to', newTo);
        params.set('chartType', chartType);
        router.push(`/dashboard/products-control/analytics/${id}?${params.toString()}`);
    };

    const handleApplyFullRange = () => {
        if (analytics.activityStartDate && analytics.activityEndDate) {
            handleDateRangeChange(analytics.activityStartDate, analytics.activityEndDate);
        }
    };

    const displayTotalProfit = analytics.totalProfit ?? 0;
    const displayAverageProfitMargin = analytics.averageProfitMargin ?? 0;

    return (
        <>
            <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <ProductInfo product={{
                    id: analytics.product.id,
                    name: analytics.product.name,
                    imageUrl: analytics.product.imageUrl ?? undefined,
                    price: analytics.product.price,
                    category: analytics.product.type,
                    // supplierId: analytics.product.supplierId ?? undefined,
                    outOfStock: analytics.product.outOfStock,
                }} />
                <div className='flex gap-2'>
                    <ExportAnalyticsPdfButton
                        data={{
                            productName: analytics.product.name || '',
                            totalSales: analytics.totalRevenue || 0,
                            totalOrders: analytics.totalOrders || 0,
                            totalCustomers: analytics.totalCustomers || 0,
                            totalProfit: displayTotalProfit,
                            averageProfitMargin: displayAverageProfitMargin,
                            bestSeller: analytics.product.name || '',
                            salesByMonth:
                                analytics.salesByMonth?.map((m: SalesByMonthData) => ({
                                    month: m.month,
                                    orders: m.orders || 0,
                                    sales: m.sales,
                                    revenue: m.sales,
                                })) || [],
                            orderHistory:
                                analytics.orderHistory?.map((order: OrderHistoryItem) => ({
                                    orderId: order.id,
                                    date: order.order?.createdAt
                                        ? new Date(order.order.createdAt).toLocaleDateString('ar-EG')
                                        : '',
                                    customer: order.order?.customerName || '',
                                    quantity: order.quantity,
                                    status: order.order?.status || '',
                                    price: order.price || 0,
                                })) || [],
                        }}
                        fileName={`تقرير-تحليلات-المنتج-${analytics?.product?.name || ''}`}
                        company={company ?? undefined}
                    />
                    <ClientAnalyticsActions analytics={analytics} id={id} />
                </div>
            </div>
            <div ref={analyticsRef} dir='rtl'>
                <div className='mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <div className="flex items-center gap-2">
                        <DateRangePicker
                            valueFrom={currentFromDate}
                            valueTo={currentToDate}
                            onChange={handleDateRangeChange}
                        />
                        {analytics.activityStartDate && analytics.activityEndDate && (
                            <Button variant="outline" size="sm" onClick={handleApplyFullRange} title="عرض كامل نطاق نشاط المنتج">
                                عرض الكل
                            </Button>
                        )}
                    </div>
                    <ChartTypeSwitcher type={chartType} onTypeChange={setChartType} />
                </div>
                {analytics.activityStartDate && analytics.activityEndDate && (
                    <p className="mb-2 text-xs text-muted-foreground text-center md:text-right">
                        نطاق نشاط المنتج: {analytics.activityStartDate} إلى {analytics.activityEndDate}
                    </p>
                )}
                <h1 className='mb-6 text-2xl font-bold text-primary'>تحليلات المنتج</h1>
                {analytics ? (
                    <>
                        <div className='min-h-[300px] rounded-xl bg-card p-6 shadow'>
                            <div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5'>
                                <div className='rounded-md border border-border p-4'>
                                    <div className='mb-1 text-sm font-medium text-muted-foreground'>إجمالي الإيرادات</div>
                                    <div className='text-2xl font-bold text-primary'>
                                        {Number(analytics.totalRevenue).toLocaleString(undefined, {
                                            style: 'currency', currency: 'SAR',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </div>
                                </div>
                                <div className='rounded-md border border-border p-4'>
                                    <div className='mb-1 text-sm font-medium text-muted-foreground'>إجمالي الربح</div>
                                    <div className='text-2xl font-bold text-emerald-600'>
                                        {Number(displayTotalProfit).toLocaleString(undefined, {
                                            style: 'currency', currency: 'SAR',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </div>
                                </div>
                                <div className='rounded-md border border-border p-4'>
                                    <div className='mb-1 text-sm font-medium text-muted-foreground'>هامش الربح</div>
                                    <div className='text-2xl font-bold text-emerald-600'>{displayAverageProfitMargin.toFixed(1)}%</div>
                                </div>
                                <div className='rounded-md border border-border p-4'>
                                    <div className='mb-1 text-sm font-medium text-muted-foreground'>عدد الطلبات</div>
                                    <div className='text-2xl font-bold text-foreground'>{analytics.totalOrders}</div>
                                </div>
                                <div className='rounded-md border border-border p-4'>
                                    <div className='mb-1 text-sm font-medium text-muted-foreground'>عدد العملاء</div>
                                    <div className='text-2xl font-bold text-foreground'>{analytics.totalCustomers}</div>
                                </div>
                            </div>
                            <AnalyticsChart salesByMonth={analytics.salesByMonth} chartType={chartType} />
                        </div>
                        <ProductOrderHistoryTable
                            data={
                                analytics.orderHistory?.map((order: OrderHistoryItem) => ({
                                    date: order.order?.createdAt
                                        ? new Date(order.order.createdAt).toLocaleDateString('ar-EG')
                                        : '',
                                    orderId: order.orderId,
                                    orderNumber: order.order?.orderNumber || '',
                                    customer: order.order?.customerName || '',
                                    quantity: order.quantity,
                                    price: order.price || 0,
                                })) || []
                            }
                        />
                        {analytics.reviews && (
                            <ProductRatingsSection
                                reviewsData={analytics.reviews}
                            />
                        )}
                    </>
                ) : (
                    <div className='flex min-h-[300px] flex-col items-center justify-center rounded-xl bg-card p-6 text-muted-foreground shadow'>
                        لا توجد بيانات تحليلات متاحة لهذا المنتج.
                    </div>
                )}
            </div>
        </>
    );
} 