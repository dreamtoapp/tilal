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

interface KpiItem {
  label: string;
  value: number | string;
}

interface Transaction {
  type: string;
  amount: number;
  note: string;
  createdAt: Date;
}

interface FinanceReportProps {
  kpis: KpiItem[];
  trendData: { date: string; revenue: number; expenses: number }[];
  transactions: Transaction[];
  initialFrom?: string;
  initialTo?: string;
}

export default function FinanceReportClient({
  kpis,
  trendData,
  transactions,
  initialFrom,
  initialTo,
}: FinanceReportProps) {
  const [from, setFrom] = useState(initialFrom || '');
  const [to, setTo] = useState(initialTo || '');

  const [revenueLineColor, setRevenueLineColor] = useState('#22c55e'); // Default green
  const [expensesLineColor, setExpensesLineColor] = useState('#f59e42'); // Default orange

  // Pagination state for transactions
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const totalPages = Math.ceil(transactions.length / pageSize);
  const paginatedTransactions = transactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Helper to get HSL string from a CSS variable
  function getResolvedColor(variableName: string, fallbackColor: string): string {
    if (typeof window === 'undefined') return fallbackColor;
    const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    if (value) return `hsl(${value.replace(/\s+/g, ', ')})`;
    return fallbackColor;
  }

  useEffect(() => {
    setRevenueLineColor(getResolvedColor('--chart-1', '#22c55e')); // Example: use chart-1 for revenue
    setExpensesLineColor(getResolvedColor('--chart-2', '#f59e42')); // Example: use chart-2 for expenses
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [from, to, pageSize, transactions]);

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    window.location.search = params.toString();
  };

  const formatValue = (value: number | string) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    if (!isNaN(numericValue)) {
      return numericValue.toLocaleString('ar-EG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + ' ر.س';
    }
    return value.toString();
  };

  return (
    <div className='space-y-8'>
      <div className="flex justify-between items-center mb-6">
        <h1 className='text-2xl font-bold text-foreground'>التقارير المالية</h1>
      </div>

      {/* Filter Panel */}
      <Card> {/* Removed mb-4, space-y-8 on parent handles it */}
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
            <Card
              key={kpi.label}
              className='text-center bg-card shadow' // Use bg-card
            >
              <CardContent className='py-4'>
                <div className='mb-2 text-lg font-semibold text-card-foreground'>{kpi.label}</div>
                <div className='text-2xl font-bold text-primary'> {/* Use text-primary for value */}
                  {formatValue(kpi.value)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card><CardContent className="py-4 text-center text-muted-foreground">لا توجد بيانات KPI للعرض.</CardContent></Card>
      )}

      {/* Trends Chart */}
      <Card>
        <CardContent className='py-6'>
          <div className='mb-4 text-lg font-semibold text-card-foreground'>اتجاه الإيرادات والمصروفات (يومي)</div>
          {trendData.length > 0 ? (
            <div className='h-80 w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type='monotone' dataKey='revenue' stroke={revenueLineColor} name='الإيرادات (ر.س)' activeDot={{ r: 6 }} />
                  <Line type='monotone' dataKey='expenses' stroke={expensesLineColor} name='المصروفات (ر.س)' activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 w-full flex items-center justify-center text-muted-foreground">
              لا توجد بيانات لاتجاه الإيرادات والمصروفات.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent className='overflow-x-auto py-4'>
          <div className='mb-2 text-lg font-semibold'>جدول المعاملات المالية</div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>النوع</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>التاريخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map((t, idx) => (
                <TableRow key={idx}>
                  <TableCell>{t.type}</TableCell>
                  <TableCell>
                    {Number(t.amount).toLocaleString('ar-EG', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    ر.س
                  </TableCell>
                  <TableCell>{t.note}</TableCell>
                  <TableCell>{new Date(t.createdAt).toLocaleDateString('ar-EG')}</TableCell>
                </TableRow>
              ))}
              {paginatedTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className='text-center text-muted-foreground'>
                    لا توجد بيانات للمعاملات في الفترة المحددة.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* Pagination Controls */}
          {transactions.length > pageSize && (
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
                  {'<'}
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm rounded-md ${currentPage === page ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
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
                  {'>'}
                </button>
              </div>
              <div className="text-xs text-muted-foreground text-center md:text-right">
                عرض {Math.min((currentPage - 1) * pageSize + 1, transactions.length)}
                -{Math.min(currentPage * pageSize, transactions.length)} من {transactions.length} معاملة
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
