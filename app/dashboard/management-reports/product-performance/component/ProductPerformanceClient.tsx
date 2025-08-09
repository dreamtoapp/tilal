'use client';
import { useState, useEffect } from 'react'; // Added useEffect
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import Image from 'next/image';
import { Icon } from '@/components/icons/Icon';

// Define a specific type for the product performance data used in the table
interface ProductPerformanceData {
  id: string;
  name: string;
  imageUrl: string | null;
  supplierName?: string | null;
  price: number;
  quantitySold: number;
  revenue: number;
  orderCount: number;
  outOfStock: boolean;
  published: boolean;
}

// Define a type for the possible values in KPIs
type KpiValue = string | number | ProductPerformanceData | null | undefined;

interface ProductPerformanceProps {
  products: ProductPerformanceData[];
  kpis: { label: string; value: KpiValue }[];
  chartData: { name: string; quantitySold: number; revenue: number }[];
  initialFrom?: string;
  initialTo?: string;
}

export default function ProductPerformanceClient({
  products,
  kpis,
  chartData,
  initialFrom,
  initialTo,
}: ProductPerformanceProps) {
  const [from, setFrom] = useState(initialFrom || '');
  const [to, setTo] = useState(initialTo || '');

  const [quantityBarColor, setQuantityBarColor] = useState('#2563eb'); // Default blue
  const [revenueBarColor, setRevenueBarColor] = useState('#38bdf8');   // Default sky blue

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.ceil(products.length / pageSize);
  const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Helper to get HSL string from a CSS variable
  function getResolvedColor(variableName: string, fallbackColor: string): string {
    if (typeof window === 'undefined') return fallbackColor;
    const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    if (value) return `hsl(${value.replace(/\s+/g, ', ')})`;
    return fallbackColor;
  }

  useEffect(() => {
    setQuantityBarColor(getResolvedColor('--chart-1', '#2563eb'));
    setRevenueBarColor(getResolvedColor('--chart-2', '#38bdf8'));
  }, []);

  // Reset to first page if filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [from, to, pageSize, products]);

  // For now, just reload with new query params (server action)
  const handleFilter = () => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    window.location.search = params.toString();
  };

  // Helper: Format numbers/currency for Arabic display
  const formatValue = (label: string, value: KpiValue) => {
    if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
      // Special case: revenue
      if (label.includes('إيراد')) {
        return (
          Number(value).toLocaleString('ar-EG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) + ' ر.س'
        );
      }
      return Number(value).toLocaleString('ar-EG');
    }
    // Check if it's our specific ProductPerformanceData object type
    if (typeof value === 'object' && value !== null && 'id' in value && 'name' in value && 'price' in value) {
      // It looks like a ProductPerformanceData object, return its name
      return value.name;
    }
    // Return value if it's string, null, or undefined (React handles these)
    if (typeof value === 'string' || value === null || typeof value === 'undefined') {
      return value;
    }
    // Fallback for any other unexpected type (though KpiValue should cover it)
    return '-';
  };

  return (
    <div className='space-y-8'>
      <div className="flex justify-between items-center mb-6">
        <h1 className='text-2xl font-bold text-foreground'>تقرير أداء المنتجات</h1>
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
                <div className='text-2xl font-bold text-primary'>
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
          <div className='mb-4 text-lg font-semibold text-card-foreground'>مخطط المبيعات حسب المنتج (يومي)</div>
          {chartData.length > 0 ? (
            <div className='h-96 w-full flex flex-col'>
              <ResponsiveContainer width='100%' height={350}>
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip formatter={(value: number) => value.toLocaleString('ar-EG')} />
                  <Legend />
                  <Line type='monotone' dataKey='quantitySold' stroke={quantityBarColor} name='الكمية المباعة' activeDot={{ r: 6 }} dot={{ r: 3 }} />
                  <Line type='monotone' dataKey='revenue' stroke={revenueBarColor} name='الإيرادات (ر.س)' activeDot={{ r: 6 }} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-2 text-xs text-muted-foreground text-center">عرض الأداء اليومي للمنتجات</div>
            </div>
          ) : (
            <div className="h-80 w-full flex items-center justify-center text-muted-foreground">
              لا توجد بيانات لعرضها في الرسم البياني.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Table */}
      <Card>
        <CardContent className='overflow-x-auto py-4'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المنتج</TableHead>
                <TableHead>المورد</TableHead>
                <TableHead>السعر</TableHead>
                <TableHead>الكمية المباعة</TableHead>
                <TableHead>الإيرادات</TableHead>
                <TableHead>عدد الطلبات</TableHead>
                <TableHead>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.length > 0 ? paginatedProducts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      {p.imageUrl && (
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          width={40}
                          height={40}
                          className='rounded border border-border object-cover' // Use border-border
                        />
                      )}
                      <span>{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{p.supplierName || '-'}</TableCell>
                  <TableCell>{p.price.toLocaleString('ar-EG')} ر.س</TableCell>
                  <TableCell>{p.quantitySold.toLocaleString('ar-EG')}</TableCell>
                  <TableCell>{p.revenue.toLocaleString('ar-EG')} ر.س</TableCell>
                  <TableCell>{p.orderCount.toLocaleString('ar-EG')}</TableCell>
                  <TableCell>
                    {p.outOfStock ? (
                      <span className='font-semibold text-destructive-foreground'>غير متوفر</span>
                    ) : p.published ? (
                      <span className='font-semibold text-success-foreground'>متاح</span>
                    ) : (
                      <span className='text-muted-foreground'>غير منشور</span>
                    )}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-4">
                    لا توجد منتجات لعرضها في الفترة المحددة.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* Pagination Controls */}
          {products.length > pageSize && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-4">
              <div className="flex items-center gap-2">
                <label className="text-sm">عدد العناصر في الصفحة:</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={pageSize}
                  onChange={e => setPageSize(Number(e.target.value))}
                >
                  {[10, 20, 50, 100].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1 justify-center">
                <button
                  className="p-1 disabled:opacity-50"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="الصفحة السابقة"
                >
                  <Icon name="chevron-left" className="w-5 h-5 rtl:rotate-180" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`px-2 py-1 rounded text-sm font-bold ${page === currentPage ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="p-1 disabled:opacity-50"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="الصفحة التالية"
                >
                  <Icon name="chevron-right" className="w-5 h-5 rtl:rotate-180" />
                </button>
              </div>
              <div className="text-xs text-muted-foreground text-center md:text-right">
                عرض {Math.min((currentPage - 1) * pageSize + 1, products.length)}
                -{Math.min(currentPage * pageSize, products.length)} من {products.length} منتج
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
