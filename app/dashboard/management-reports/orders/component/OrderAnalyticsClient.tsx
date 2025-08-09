'use client';
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select

// Define structure for individual orders in the table
interface OrderData {
  id: string;
  orderNumber?: string | null;
  customer?: { name?: string | null } | null; // Assuming customer is nested
  status: string;
  amount: number;
  createdAt: string | Date; // Allow string or Date
}

// Define structure for the 'Highest Order' KPI value
interface HighestOrderData {
  amount: number;
  orderNumber: string;
  customer: string; // Assuming customer name is directly available here
}

// Define a type for the possible values in KPIs
type KpiValue = string | number | HighestOrderData | null | undefined;

interface OrderAnalyticsProps {
  orders: OrderData[];
  kpis: { label: string; value: KpiValue }[];
  statusChartData: { name: string; value: number }[];
  topProducts: { name: string; count: number }[];
  trendData: { date: string; orders: number; revenue: number }[];
  initialFrom?: string;
  initialTo?: string;
}

export default function OrderAnalyticsClient({
  orders, // Type is now OrderData[] from props interface
  kpis, // Type is now { label: string; value: KpiValue }[] from props interface
  statusChartData,
  topProducts,
  trendData,
  initialFrom,
  initialTo,
}: OrderAnalyticsProps) {
  const [from, setFrom] = useState(initialFrom || '');
  const [to, setTo] = useState(initialTo || '');

  const [statusPieColors, setStatusPieColors] = useState<string[]>(['#2563eb', '#22c55e', '#f59e42', '#f43f5e', '#a855f7', '#14b8a6']);
  const [orderTrendLineColor, setOrderTrendLineColor] = useState('#2563eb');
  const [revenueTrendLineColor, setRevenueTrendLineColor] = useState('#22c55e');
  const [topProductsBarColor, setTopProductsBarColor] = useState('#38bdf8');

  // Helper to get HSL string from a CSS variable
  function getResolvedColor(variableName: string, fallbackColor: string): string {
    if (typeof window === 'undefined') return fallbackColor;
    const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    if (value) return `hsl(${value.replace(/\s+/g, ', ')})`;
    return fallbackColor;
  }

  useEffect(() => {
    const chartColors = [
      getResolvedColor('--chart-1', '#2563eb'),
      getResolvedColor('--chart-2', '#22c55e'),
      getResolvedColor('--chart-3', '#f59e42'),
      getResolvedColor('--chart-4', '#f43f5e'),
      getResolvedColor('--chart-5', '#a855f7'),
      getResolvedColor('--accent', '#14b8a6'), // Using accent as a fallback for 6th color
    ].filter(Boolean);
    if (chartColors.length > 0) setStatusPieColors(chartColors);

    setOrderTrendLineColor(getResolvedColor('--chart-1', '#2563eb'));
    setRevenueTrendLineColor(getResolvedColor('--chart-2', '#22c55e'));
    setTopProductsBarColor(getResolvedColor('--chart-3', '#38bdf8'));
  }, []);

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    window.location.search = params.toString();
  };

  // Helper: Format numbers/currency for Arabic display
  const formatValue = (label: string, value: KpiValue) => {
    // Check specifically for HighestOrderData structure
    if (
      label === 'أعلى طلب' &&
      typeof value === 'object' && value !== null &&
      'amount' in value && 'orderNumber' in value && 'customer' in value
    ) {
      return (
        <div className='flex flex-col items-center gap-1 rtl:text-right text-card-foreground'>
          <span className='text-xl font-bold text-primary'> {/* Use text-primary */}
            {Number(value.amount).toLocaleString('ar-EG', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            ر.س
          </span>
          <span className='text-xs text-muted-foreground'> {/* Use text-muted-foreground */}
            رقم الطلب: <span dir='ltr'>{value.orderNumber}</span>
          </span>
          <span className='text-xs text-muted-foreground'>العميل: {value.customer}</span> {/* Use text-muted-foreground */}
        </div>
      );
    }
    if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
      if (label.includes('إيراد') || label.includes('قيمة')) {
        return (
          Number(value).toLocaleString('ar-EG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) + ' ر.س'
        );
      }
      return Number(value).toLocaleString('ar-EG');
    }
    // Return value if it's string, null, or undefined (React handles these)
    if (typeof value === 'string' || value === null || typeof value === 'undefined') {
      return value;
    }
    // Fallback for other unexpected types
    return '-';
  };

  // Pagination & Search State
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  // Filtered & paginated orders
  const filteredOrders = useMemo(() => {
    if (!search) return orders; // orders is OrderData[]
    const s = search.toLowerCase();
    // Explicitly type 'o' as OrderData for clarity within filter
    return orders.filter(
      (o: OrderData) =>
        o.orderNumber?.toString().toLowerCase().includes(s) ||
        o.customer?.name?.toLowerCase().includes(s), // Accessing nested optional property
    );
  }, [orders, search]);

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredOrders.slice(start, start + rowsPerPage);
  }, [filteredOrders, page, rowsPerPage]);

  // Reset page if filter changes
  useEffect(() => {
    setPage(1);
  }, [search, rowsPerPage]);

  // Prepare conditionally rendered chart content
  let trendChartContent;
  if (trendData.length > 0) {
    trendChartContent = (
      <div className='h-80 w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type='monotone' dataKey='orders' stroke={orderTrendLineColor} name='عدد الطلبات' activeDot={{ r: 6 }} />
            <Line type='monotone' dataKey='revenue' stroke={revenueTrendLineColor} name='الإيرادات (ر.س)' activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  } else {
    trendChartContent = (
      <div className="h-80 w-full flex items-center justify-center text-muted-foreground">
        لا توجد بيانات لاتجاه الطلبات والإيرادات.
      </div>
    );
  }

  let topProductsChartContent;
  if (topProducts.length > 0) {
    topProductsChartContent = (
      <div className='h-80 w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={topProducts} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' angle={-25} textAnchor='end' height={60} interval={0} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='count' fill={topProductsBarColor} name='الكمية' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  } else {
    topProductsChartContent = (
      <div className="h-80 w-full flex items-center justify-center text-muted-foreground">
        لا توجد بيانات لأفضل المنتجات.
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <div className="flex justify-between items-center mb-6">
        <h1 className='text-2xl font-bold text-foreground'>تحليلات الطلبات</h1>
      </div>

      {/* Filter Panel */}
      <Card> {/* Removed mb-4 */}
        <CardContent className='flex flex-col items-end gap-4 py-4 md:flex-row'>
          <div>
            <label className='mb-1 block text-sm font-medium'>من تاريخ</label>
            <Input type='date' value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className='mb-1 block text-sm font-medium'>إلى تاريخ</label>
            <Input type='date' value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <Button className='mt-4 md:mt-0' onClick={handleFilter}>
            تطبيق الفلتر
          </Button>
        </CardContent>
      </Card>

      {/* KPIs */}
      {kpis.length > 0 ? (
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          {kpis.map((kpi) => (
            <Card key={kpi.label} className='text-center bg-card shadow'>
              <CardContent className='py-4'>
                <div className='mb-2 text-lg font-semibold text-card-foreground'>{kpi.label}</div>
                {/* For regular KPIs, use text-primary. formatValue handles the complex "أعلى طلب" KPI styling. */}
                <div className={kpi.label !== 'أعلى طلب' ? 'text-2xl font-bold text-primary' : ''}>
                  {formatValue(kpi.label, kpi.value)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card><CardContent className="py-4 text-center text-muted-foreground">لا توجد بيانات KPI للعرض.</CardContent></Card>
      )}

      {/* Status Breakdown Chart */}
      <Card>
        <CardContent className='py-6'>
          <div className='mb-4 text-lg font-semibold'>توزيع حالات الطلبات</div>
          <div className='h-72 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={statusChartData}
                  dataKey='value'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  outerRadius={80}
                  label
                >
                  {statusChartData.map((_entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={statusPieColors[idx % statusPieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Order Trends Chart */}
      <Card>
        <CardContent className='py-6'>
          <div className='mb-4 text-lg font-semibold text-card-foreground'>اتجاه الطلبات والإيرادات (يومي)</div>
          {trendChartContent}
        </CardContent>
      </Card>

      {/* Top Products Chart */}
      <Card>
        <CardContent className='py-6'>
          <div className='mb-4 text-lg font-semibold text-card-foreground'>أفضل المنتجات (حسب الكمية)</div>
          {topProductsChartContent}
        </CardContent>
      </Card>

      {/* Orders Table Controls */}
      <Card className='mb-2'>
        <CardContent className='flex flex-col gap-2 py-2 md:flex-row md:items-center md:justify-between'>
          <div className='flex items-center gap-2'>
            <label className='font-medium'>بحث:</label>
            <Input
              className='w-40'
              type='text'
              placeholder='رقم الطلب أو اسم العميل'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label htmlFor="rowsPerPageSelect" className='font-medium text-sm'>عدد الصفوف:</label>
            <Select
              value={String(rowsPerPage)}
              onValueChange={(value) => setRowsPerPage(Number(value))}
            >
              <SelectTrigger id="rowsPerPageSelect" className="w-[80px]">
                <SelectValue placeholder="عدد الصفوف" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className='overflow-x-auto py-4'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الطلب</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>تاريخ الطلب</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.orderNumber || '—'}</TableCell>
                  <TableCell>{o.customer?.name ?? '-'}</TableCell>
                  <TableCell>{o.status}</TableCell>
                  <TableCell>
                    {Number(o.amount).toLocaleString('ar-EG', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    ر.س
                  </TableCell>
                  <TableCell>{new Date(o.createdAt).toLocaleDateString('ar-EG')}</TableCell>
                </TableRow>
              ))}
              {paginatedOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className='text-center text-muted-foreground py-4'> {/* Use text-muted-foreground and add padding */}
                    {orders.length === 0 ? 'لا توجد طلبات لعرضها في الفترة المحددة.' : 'لا توجد طلبات تطابق بحثك.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className='mt-2 flex items-center justify-center gap-2'>
        <Button variant='outline' size='sm' disabled={page === 1} onClick={() => setPage(page - 1)}>
          السابق
        </Button>
        <span className='mx-2'>
          صفحة {page} من {totalPages}
        </span>
        <Button
          variant='outline'
          size='sm'
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          التالي
        </Button>
      </div>
    </div>
  );
}
