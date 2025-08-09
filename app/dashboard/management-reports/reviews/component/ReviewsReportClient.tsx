'use client';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Icon } from '@/components/icons/Icon';

import {
  RatingDistributionChartItem,
  ReviewReportDataItem,
  ReviewReportKpi,
} from '../action/getReviewsReportData';

interface ReviewsReportClientProps {
  kpis: ReviewReportKpi[];
  reviews: ReviewReportDataItem[];
  ratingDistributionChart: RatingDistributionChartItem[];
  initialFrom?: string;
  initialTo?: string;
  error?: string;
}

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Icon
        key={i}
        name="Star"
        size="sm"
        className={i <= rating ? 'fill-primary text-primary' : 'fill-muted text-muted-foreground'}
      />
    );
  }
  return <div className="flex">{stars}</div>;
};

export default function ReviewsReportClient({
  kpis,
  reviews,
  ratingDistributionChart,
  initialFrom,
  initialTo,
  error,
}: ReviewsReportClientProps) {
  const [from, setFrom] = useState(initialFrom || '');
  const [to, setTo] = useState(initialTo || '');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [starFilter, setStarFilter] = useState<string>('');
  const [barChartColor, setBarChartColor] = useState('#8884d8');

  function getResolvedColor(variableName: string, fallbackColor: string): string {
    if (typeof window === 'undefined') return fallbackColor;
    const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    if (value) return `hsl(${value.replace(/\s+/g, ', ')})`;
    return fallbackColor;
  }

  useEffect(() => {
    setBarChartColor(getResolvedColor('--chart-1', '#8884d8'));
  }, []);

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    window.location.search = params.toString();
  };

  const filteredReviews = useMemo(() => {
    let tempReviews = reviews;
    if (starFilter) {
      const numericStarFilter = parseInt(starFilter, 10);
      tempReviews = tempReviews.filter(review => review.rating === numericStarFilter);
    }
    if (!searchTerm) return tempReviews;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return tempReviews.filter(
      (review) =>
        review.productName?.toLowerCase().includes(lowerSearchTerm) ||
        review.userName?.toLowerCase().includes(lowerSearchTerm) ||
        review.comment?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [reviews, searchTerm, starFilter]);

  const totalPages = Math.ceil(filteredReviews.length / rowsPerPage) || 1;
  const paginatedReviews = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredReviews.slice(start, start + rowsPerPage);
  }, [filteredReviews, page, rowsPerPage]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, rowsPerPage, starFilter]);

  if (error) {
    return <Card><CardContent className="py-10 text-center text-destructive-foreground">{error}</CardContent></Card>;
  }

  return (
    <div className='space-y-8'>
      {/* Filter Panel */}
      <Card>
        <CardContent className='flex flex-col items-end gap-4 py-4 md:flex-row'>
          <div>
            <label className='mb-1 block text-sm font-medium text-card-foreground'>من تاريخ</label>
            <Input type='date' value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className='mb-1 block text-sm font-medium text-card-foreground'>إلى تاريخ</label>
            <Input type='date' value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <Button className='mt-4 md:mt-0' onClick={handleFilter}>
            تطبيق الفلتر
          </Button>
        </CardContent>
      </Card>

      {/* KPIs */}
      {kpis.length > 0 ? (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4'>
          {kpis.map((kpi) => (
            <Card key={kpi.label} className='text-center bg-card shadow'>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-card-foreground'>{kpi.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-3xl font-bold text-primary'>{String(kpi.value)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card><CardContent className="py-4 text-center text-muted-foreground">لا توجد بيانات KPI للعرض.</CardContent></Card>
      )}

      {/* Rating Distribution Chart */}
      <Card>
        <CardHeader><CardTitle className="text-xl text-card-foreground">توزيع التقييمات</CardTitle></CardHeader>
        <CardContent>
          {ratingDistributionChart.reduce((sum, item) => sum + item.count, 0) > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ratingDistributionChart} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} interval={0} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="عدد التقييمات" fill={barChartColor} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-10">لا توجد بيانات لتوزيع التقييمات.</p>
          )}
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl text-card-foreground">قائمة التقييمات</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              type="search"
              placeholder="ابحث في التقييمات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select
              value={starFilter}
              onValueChange={(value) => setStarFilter(value === 'all' ? '' : value)}
            >
              <SelectTrigger id="starFilterSelect" className="w-[120px]">
                <SelectValue placeholder="فلتر النجوم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل النجوم</SelectItem>
                <SelectItem value="5">5 نجوم</SelectItem>
                <SelectItem value="4">4 نجوم</SelectItem>
                <SelectItem value="3">3 نجوم</SelectItem>
                <SelectItem value="2">2 نجوم</SelectItem>
                <SelectItem value="1">1 نجمة</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={String(rowsPerPage)}
              onValueChange={(value) => setRowsPerPage(Number(value))}
            >
              <SelectTrigger id="reviewsRowsPerPage" className="w-[100px]">
                <SelectValue placeholder="عدد الصفوف" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} صفوف
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المنتج</TableHead>
                <TableHead className="text-right">المستخدم</TableHead>
                <TableHead className="text-right">التقييم</TableHead>
                <TableHead className="text-right">التعليق</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReviews.length > 0 ? paginatedReviews.map((review) => (
                <TableRow key={review.id}><TableCell className="font-medium">{review.productName}</TableCell><TableCell className="text-muted-foreground">{review.userName}</TableCell><TableCell>{renderStars(review.rating)}</TableCell><TableCell className="max-w-xs whitespace-normal break-words">{review.comment || '-'}</TableCell><TableCell className="text-muted-foreground">{new Date(review.createdAt).toLocaleDateString('ar-EG')}</TableCell></TableRow>
              )) : (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-10">{reviews.length === 0 ? 'لا توجد تقييمات لعرضها.' : 'لا توجد تقييمات تطابق بحثك.'}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {totalPages > 1 && (
          <div className='flex items-center justify-center gap-2 border-t border-border p-4'>
            <Button variant='outline' size='sm' disabled={page === 1} onClick={() => setPage(page - 1)}>
              السابق
            </Button>
            <span className='mx-2 text-sm text-muted-foreground'>
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
        )}
      </Card>
    </div>
  );
}