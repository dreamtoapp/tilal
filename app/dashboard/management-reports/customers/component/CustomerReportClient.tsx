'use client';
import { useState, useEffect } from 'react';
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
} from 'recharts';

// Define type for customer data used in the table
interface CustomerReportData {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  orderCount: number;
  totalSpend: number;
  createdAt: string | Date;
}

// Define type for KPI values (likely string or number here)
type KpiValue = string | number | null | undefined;

interface CustomerReportProps {
  customers: CustomerReportData[];
  kpis: { label: string; value: KpiValue }[];
  chartData: { name: string; orderCount: number; totalSpend: number }[];
  initialFrom?: string;
  initialTo?: string;
}

export default function CustomerReportClient({
  customers,
  kpis,
  chartData,
  initialFrom,
  initialTo,
}: CustomerReportProps) {
  const [from, setFrom] = useState(initialFrom || '');
  const [to, setTo] = useState(initialTo || '');
  const [tableSearchTerm, setTableSearchTerm] = useState('');

  const [chartFill1, setChartFill1] = useState('#22c55e'); // Default fallback
  const [chartFill2, setChartFill2] = useState('#38bdf8'); // Default fallback

  // Helper to get HSL string like "hsl(220, 70%, 50%)" from a CSS variable
  function getResolvedColor(variableName: string): string {
    if (typeof window === 'undefined') return '';
    const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    if (value) return `hsl(${value.replace(/\s+/g, ', ')})`;
    return '';
  }

  useEffect(() => {
    const color1 = getResolvedColor('--chart-1');
    const color2 = getResolvedColor('--chart-2');
    if (color1) setChartFill1(color1);
    if (color2) setChartFill2(color2);
  }, []);

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    window.location.search = params.toString();
  };

  // Helper: Format numbers/currency for Arabic display
  const formatValue = (label: string, value: KpiValue) => {
    if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
      if (label.includes('إنفاق')) {
        return (
          Number(value).toLocaleString('ar-EG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) + ' ر.س'
        );
      }
      return Number(value).toLocaleString('ar-EG');
    }
    // Return value if it's string, null, or undefined
    if (typeof value === 'string' || value === null || typeof value === 'undefined') {
      return value;
    }
    return '-'; // Fallback
  };

  // Define filteredTableCustomers inside the component to access props and state
  const filteredTableCustomers = customers.filter(customer => {
    const searchTermLower = tableSearchTerm.toLowerCase();
    return (
      (customer.name && customer.name.toLowerCase().includes(searchTermLower)) ||
      (customer.email && customer.email.toLowerCase().includes(searchTermLower)) ||
      (customer.phone && customer.phone.includes(searchTermLower)) // Phone might not need toLowerCase
    );
  });

  return (
    <div className='space-y-8'>
      <div className="flex justify-between items-center mb-6">
        <h1 className='text-2xl font-bold text-foreground'>تقرير العملاء</h1> {/* Added text-foreground for consistency */}
      </div>

      {/* Filter Panel */}
      <Card>
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
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5'> {/* Adjusted grid for potentially fewer KPIs */}
          {kpis.map((kpi) => (
            <Card
              key={kpi.label}
              className='bg-success-soft-bg text-center'
            >
              <CardContent className='py-4'>
                <div className='mb-2 text-lg font-semibold text-card-foreground'>{kpi.label}</div>
                <div className='text-2xl font-bold text-success-fg'>
                  {formatValue(kpi.label, kpi.value)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card><CardContent className="py-4 text-center text-muted-foreground">لا توجد بيانات KPI للعرض.</CardContent></Card>
      )}

      {/* Chart */}
      <Card>
        <CardContent className='py-6'>
          <div className='mb-4 text-lg font-semibold text-card-foreground'>أفضل العملاء (حسب عدد الطلبات)</div>
          {chartData.length > 0 ? (
            <div className='h-80 w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' angle={-25} textAnchor='end' height={60} interval={0} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='orderCount' fill={chartFill1} name='عدد الطلبات' />
                  <Bar dataKey='totalSpend' fill={chartFill2} name='إجمالي الإنفاق (ر.س)' />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 w-full flex items-center justify-center text-muted-foreground">
              لا توجد بيانات لعرضها في الرسم البياني.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Table */}
      <Card>
        <CardContent className='overflow-x-auto py-4 space-y-4'>
          <Input
            type="search"
            placeholder="ابحث في الجدول (بالاسم, الإيميل, الهاتف)..."
            value={tableSearchTerm}
            onChange={(e) => setTableSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          {filteredTableCustomers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>رقم الجوال</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>عدد الطلبات</TableHead>
                  <TableHead>إجمالي الإنفاق</TableHead>
                  <TableHead>تاريخ التسجيل</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTableCustomers.map((c: CustomerReportData) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.name || '-'}</TableCell>
                    <TableCell>{c.phone || '-'}</TableCell>
                    <TableCell>{c.email || '-'}</TableCell>
                    <TableCell>{c.orderCount.toLocaleString('ar-EG')}</TableCell>
                    <TableCell>
                      {Number(c.totalSpend).toLocaleString('ar-EG', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      ر.س
                    </TableCell>
                    <TableCell>{new Date(c.createdAt).toLocaleDateString('ar-EG')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              {customers.length === 0 ? 'لا يوجد عملاء لعرضهم في الفترة المحددة.' : 'لا يوجد عملاء يطابقون بحثك.'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
// filteredTableCustomers definition moved inside the component
