'use client';
import {
  useEffect,
  useState,
} from 'react';

import {
  useRouter,
  useSearchParams,
} from 'next/navigation';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  formatCurrency,
} from '@/lib/formatCurrency'; // Assuming you have this utility
import {
  OverallAnalyticsData as AnalyticsDataType,
} from '../actions/getOverallAnalytics'; // Import type
import DateRangePicker from '../../management-products/analytics/[id]/components/DateRangePicker';

interface OverallAnalyticsDashboardProps {
  initialData: AnalyticsDataType;
}

export default function OverallAnalyticsDashboard({ initialData }: OverallAnalyticsDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [analyticsData, setAnalyticsData] = useState(initialData);

  // Initialize date states from initialData or URL search params
  const initialFrom = searchParams.get('from') || initialData.dateRange.from;
  const initialTo = searchParams.get('to') || initialData.dateRange.to;

  const [currentFromDate, setCurrentFromDate] = useState(initialFrom);
  const [currentToDate, setCurrentToDate] = useState(initialTo);

  // Effect to update data if props change (e.g. due to server-side re-fetch after date change)
  useEffect(() => {
    setAnalyticsData(initialData);
    setCurrentFromDate(initialData.dateRange.from);
    setCurrentToDate(initialData.dateRange.to);
  }, [initialData]);


  const handleDateRangeChange = (newFrom: string, newTo: string) => {
    setCurrentFromDate(newFrom);
    setCurrentToDate(newTo);
    const params = new URLSearchParams();
    if (newFrom) params.set('from', newFrom);
    if (newTo) params.set('to', newTo);
    router.push(`/dashboard/analytics/overview?${params.toString()}`);
  };

  const { summary, salesTrend, topProductsByRevenue, topProductsByQuantity, lowStockProducts } = analyticsData;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>فلترة حسب التاريخ</CardTitle>
        </CardHeader>
        <CardContent>
          <DateRangePicker
            valueFrom={currentFromDate}
            valueTo={currentToDate}
            onChange={handleDateRangeChange}
          />
          <p className="text-xs text-muted-foreground mt-2">
            عرض البيانات من: {currentFromDate} إلى: {currentToDate}
          </p>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <SummaryCard title="إجمالي الإيرادات" value={formatCurrency(summary.totalRevenue)} />
        <SummaryCard title="إجمالي الطلبات" value={summary.totalOrders.toLocaleString('ar-EG')} />
        <SummaryCard title="متوسط قيمة الطلب" value={formatCurrency(summary.averageOrderValue)} />
        <SummaryCard title="إجمالي العملاء (الكلي)" value={summary.totalCustomers.toLocaleString('ar-EG')} />
        <SummaryCard title="العملاء الجدد (في الفترة)" value={summary.newCustomersInPeriod.toLocaleString('ar-EG')} />
      </div>

      {/* Sales Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>اتجاه المبيعات (الإيرادات اليومية)</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesTrend} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })} />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value: number) => [formatCurrency(value), "الإيرادات"]} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} name="الإيرادات" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Products & Low Stock Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProductListTable
          title="المنتجات الأكثر مبيعًا (حسب الإيرادات)"
          products={topProductsByRevenue.map((p: { id: string; name: string; totalRevenueSold: number; quantitySold: number }) => ({
            id: p.id, name: p.name, value: formatCurrency(p.totalRevenueSold)
          }))}
          valueLabel="الإيرادات"
        />
        <ProductListTable
          title="المنتجات الأكثر مبيعًا (حسب الكمية)"
          products={topProductsByQuantity.map((p: { id: string; name: string; quantitySold: number; totalRevenueSold: number }) => ({
            id: p.id, name: p.name, value: p.quantitySold.toLocaleString('ar-EG') + ' وحدة'
          }))}
          valueLabel="الكمية المباعة"
        />
        <LowStockTable title="منتجات ذات مخزون منخفض" products={lowStockProducts} />
      </div>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: string | number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold text-primary">{value}</div> {/* Changed from text-2xl to text-xl */}
      </CardContent>
    </Card>
  );
}

interface ProductListItem { id: string; name: string; value: string; }
function ProductListTable({ title, products, valueLabel }: { title: string; products: ProductListItem[]; valueLabel: string; }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم المنتج</TableHead>
              <TableHead className="text-left">{valueLabel}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-left">{product.value}</TableCell>
              </TableRow>
            ))}
            {products.length === 0 && <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">لا توجد بيانات</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function LowStockTable({ title, products }: { title: string; products: Array<{ id: string; name: string; stockQuantity: number | null }> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم المنتج</TableHead>
              <TableHead className="text-left">الكمية المتبقية</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-left">{product.stockQuantity?.toLocaleString('ar-EG') ?? 'N/A'}</TableCell>
              </TableRow>
            ))}
            {products.length === 0 && <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">لا توجد منتجات بمخزون منخفض</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
