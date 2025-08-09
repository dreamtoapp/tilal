'use client';
import './sales-report-print.css';

import {
  useEffect,
  useRef,
  useState,
} from 'react'; // Added useEffect

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';   // Import Label
import { Switch } from '@/components/ui/switch'; // Import Switch

import KpiCards from './KpiCards';
import SalesChart from './SalesChart';
import SalesLineChart from './SalesLineChart';
import SalesPieChart from './SalesPieChart';
import TopProductsTable from './TopProductsTable';

interface Kpi {
  label: string;
  value: string;
  icon: string;
}
interface SalesData {
  day: string;
  value: number;
}
interface Product {
  name: string;
  qty: number;
  unitPrice: number;
  total: number;
}
interface TopProductsTotals {
  totalTopQty: number;
  totalTopSales: number;
  totalAllQty: number;
  totalAllSales: number;
  remaining: number;
}

interface SalesReportClientProps {
  kpis: Kpi[];
  salesData: SalesData[];
  topProducts: Product[];
  allProducts: Product[];
  topProductsTotals: TopProductsTotals;
  initialFrom: string;
  initialTo: string;
  initialShowAll: boolean;
}

export default function SalesReportClient({
  kpis,
  salesData,
  topProducts,
  allProducts,
  topProductsTotals,
  initialFrom,
  initialTo,
  initialShowAll,
}: SalesReportClientProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [from, setFrom] = useState<string>(initialFrom);
  const [to, setTo] = useState<string>(initialTo);
  const [showAll, setShowAll] = useState(initialShowAll);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');

  const [barChartColor, setBarChartColor] = useState('#8884d8'); // Default Recharts color
  const [lineChartColor, setLineChartColor] = useState('#82ca9d'); // Default Recharts color
  const [pieChartColors, setPieChartColors] = useState<string[]>(['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']); // Default Recharts colors

  // Helper to get HSL string like "hsl(220, 70%, 50%)" from a CSS variable
  function getResolvedColor(variableName: string, fallbackColor: string): string {
    if (typeof window === 'undefined') return fallbackColor;
    const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    if (value) return `hsl(${value.replace(/\s+/g, ', ')})`;
    return fallbackColor;
  }

  useEffect(() => {
    setBarChartColor(getResolvedColor('--chart-1', '#8884d8'));
    setLineChartColor(getResolvedColor('--chart-2', '#82ca9d'));

    const resolvedPieColors = [
      getResolvedColor('--chart-1', '#0088FE'),
      getResolvedColor('--chart-2', '#00C49F'),
      getResolvedColor('--chart-3', '#FFBB28'),
      getResolvedColor('--chart-4', '#FF8042'),
      getResolvedColor('--chart-5', '#8884D8'),
    ].filter(Boolean); // Filter out empty strings if a variable isn't found or fallback failed
    if (resolvedPieColors.length > 0) setPieChartColors(resolvedPieColors);
  }, []);

  // UX: If user picks a date, or unchecks showAll, disable showAll
  function handleFromChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFrom(e.target.value);
    if (e.target.value) setShowAll(false);
  }
  function handleToChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTo(e.target.value);
    if (e.target.value) setShowAll(false);
  }
  function handleShowAllChange(checked: boolean) {
    setShowAll(checked);
    if (checked) { // If "Show All" is checked, clear date inputs
      setFrom('');
      setTo('');
    }
  }

  // Helper: Format current filter summary
  const filterSummary = showAll
    ? 'كل الفترات'
    : `من ${from.replace(/-/g, '/')} إلى ${to.replace(/-/g, '/')}`;

  // Print handler


  return (
    <form method='GET' className='mx-auto max-w-7xl space-y-8 px-4 py-10' dir='rtl'>
      <div className="flex justify-between items-center mb-8">
        <h1 className='text-3xl font-bold text-foreground'>تقرير المبيعات</h1>

      </div>



      <div ref={printRef} className='print:rounded print:bg-card print:p-8 print:shadow-none'>
        {/* Filter Panel */}
        <Card className='mb-4 border-border bg-card p-4 shadow'>
          <CardContent className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
            <div className='flex flex-1 flex-col gap-4 md:flex-row md:items-end'>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Switch
                  id="showAll"
                  name="showAll"
                  checked={showAll}
                  onCheckedChange={handleShowAllChange}
                />
                <Label htmlFor="showAll" className="font-medium">كل الفترات</Label>
              </div>
              <div className="space-y-1">
                <Label htmlFor="from" className='font-medium'>من:</Label>
                <Input
                  type='date'
                  id="from"
                  name='from'
                  value={from}
                  onChange={handleFromChange}
                  className='w-full md:w-40'
                  disabled={showAll}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="to" className='font-medium'>إلى:</Label>
                <Input
                  type='date'
                  id="to"
                  name='to'
                  value={to}
                  onChange={handleToChange}
                  className='w-full md:w-40'
                  disabled={showAll}
                />
              </div>
            </div>
            <Button type='submit' className='mt-4 md:mt-0'>
              تحديث
            </Button>
          </CardContent>
        </Card>

        {/* Filter summary */}
        <div className='mb-6 text-center text-lg font-medium text-primary'>
          الحالة الحالية: {filterSummary}
        </div>
        {/* KPI Cards */}
        <KpiCards kpis={kpis} />
        {/* Chart type toggle */}
        <div className='mt-8 mb-4 flex justify-center md:justify-end gap-2 print:hidden'> {/* Added mt-8 for spacing */}
          <Button
            type='button'
            variant={chartType === 'bar' ? 'default' : 'outline'}
            onClick={() => setChartType('bar')}
          >
            مخطط أعمدة
          </Button>
          <Button
            type='button'
            variant={chartType === 'line' ? 'default' : 'outline'}
            onClick={() => setChartType('line')}
          >
            مخطط خطي
          </Button>
          <Button
            type='button'
            variant={chartType === 'pie' ? 'default' : 'outline'}
            onClick={() => setChartType('pie')}
          >
            مخطط دائري
          </Button>
        </div>
        {/* Chart */}
        <div className='w-full'>
          {chartType === 'bar' && (
            <SalesChart salesData={salesData} filterSummary={filterSummary} barColor={barChartColor} />
          )}
          {chartType === 'line' && (
            <SalesLineChart salesData={salesData} filterSummary={filterSummary} lineColor={lineChartColor} />
          )}
          {chartType === 'pie' && (
            <SalesPieChart salesData={salesData} filterSummary={filterSummary} colors={pieChartColors} />
          )}
        </div>
        {/* Top Products Table */}
        <div>
          <h2 className='mb-2 text-lg font-bold'>المنتجات الأكثر مبيعًا</h2>
          <TopProductsTable
            products={topProducts}
            totals={topProductsTotals}
            allProducts={allProducts}
          />
        </div>
      </div>
    </form>
  );
}
