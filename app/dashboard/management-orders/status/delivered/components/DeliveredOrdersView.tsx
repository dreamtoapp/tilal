'use client';
// app/dashboard/orders-management/status/delivered/components/DeliveredOrdersView.tsx
import React, { useState, useMemo } from 'react';

import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

import { Icon } from '@/components/icons/Icon';
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';

import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Order } from '@/types/databaseTypes';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface DeliveredOrdersViewProps {
  orders: Order[];
  deliveredCount: number;
  currentPage: number;
  pageSize: number;
  dateRange: string;
}

export default function DeliveredOrdersView({
  orders,
  deliveredCount,
  currentPage,
  pageSize,
  dateRange
}: DeliveredOrdersViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState(dateRange);
  const [sortBy, setSortBy] = useState('deliveredAt');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const uniqueCustomers = new Set(orders.map(order => order.customer?.id)).size;
    const uniqueDrivers = new Set(orders.map(order => order.driver?.id).filter(Boolean)).size;
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    return {
      totalRevenue,
      uniqueCustomers,
      uniqueDrivers,
      avgOrderValue,
      totalOrders: orders.length
    };
  }, [orders]);

  // Calculate total pages
  const totalPages = Math.ceil(deliveredCount / pageSize) || 1;

  // Update URL with new page number and filters
  const updateFilters = (page: number, newDateRange?: string, newSortBy?: string, newSortOrder?: 'asc' | 'desc') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());

    if (newDateRange) {
      params.set('dateRange', newDateRange);
    }
    if (newSortBy) {
      params.set('sortBy', newSortBy);
    }
    if (newSortOrder) {
      params.set('sortOrder', newSortOrder);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle date range change
  const handleDateRangeChange = (value: string) => {
    setSelectedDateRange(value);
    updateFilters(1, value);
  };

  // Handle sorting
  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateFilters(currentPage, undefined, value, sortOrder);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  // Export to CSV
  const handleExport = () => {
    const csvContent = [
      ['رقم الطلب', 'العميل', 'المبلغ', 'السائق', 'تاريخ التسليم'].join(','),
      ...orders.map(order => [
        order.orderNumber || '—',
        order.customer?.name || order.customer?.email || '—',
        `${order.amount} ر.س`,
        order.driver?.name || '—',
        order.deliveredAt ? format(new Date(order.deliveredAt), 'yyyy-MM-dd') : '—'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `delivered-orders-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => updateFilters(i)}
          className="h-8 w-8"
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateFilters(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <Icon name="chevron-right" className="h-4 w-4" />
        </Button>

        {pages}

        <Button
          variant="outline"
          size="sm"
          onClick={() => updateFilters(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <Icon name="chevron-left" className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ar });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('ar-SA')} ر.س`;
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-feature-commerce">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-feature-commerce-soft rounded-lg">
                <Icon name="dollar-sign" className="h-5 w-5 text-feature-commerce" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                <p className="text-xl font-bold text-feature-commerce">{formatCurrency(statistics.totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-feature-users">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-feature-users-soft rounded-lg">
                <Icon name="users" className="h-5 w-5 text-feature-users" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">العملاء</p>
                <p className="text-xl font-bold text-feature-users">{statistics.uniqueCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-feature-suppliers">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-feature-suppliers-soft rounded-lg">
                <Icon name="truck" className="h-5 w-5 text-feature-suppliers" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">السائقون</p>
                <p className="text-xl font-bold text-feature-suppliers">{statistics.uniqueDrivers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-feature-analytics">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-feature-analytics-soft rounded-lg">
                <Icon name="bar-chart-3" className="h-5 w-5 text-feature-analytics" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط الطلب</p>
                <p className="text-xl font-bold text-feature-analytics">{formatCurrency(statistics.avgOrderValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border-l-4 border-feature-commerce">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Icon name="check-circle" className="h-5 w-5 text-feature-commerce" />
              الطلبات المسلمة
              <Badge variant="secondary" className="bg-feature-commerce-soft text-feature-commerce">
                {deliveredCount}
              </Badge>
            </CardTitle>

            <Button
              onClick={handleExport}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
              disabled={orders.length === 0}
            >
              <Icon name="download" className="h-4 w-4" />
              تصدير CSV
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center gap-2">
              <Input
                type="search"
                placeholder="بحث برقم الطلب أو اسم العميل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              <Button type="submit" size="sm" variant="outline">
                <Icon name="search" className="h-4 w-4" />
              </Button>
            </form>

            <div className="flex items-center gap-2">
              <Icon name="calendar" className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">الفترة:</span>
              <Select value={selectedDateRange} onValueChange={handleDateRangeChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="today">اليوم</SelectItem>
                  <SelectItem value="week">الأسبوع</SelectItem>
                  <SelectItem value="month">الشهر</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Icon name="filter" className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">ترتيب:</span>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deliveredAt">التاريخ</SelectItem>
                  <SelectItem value="amount">المبلغ</SelectItem>
                  <SelectItem value="orderNumber">الرقم</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Orders Grid */}
          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <Card key={order.id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Icon name="check-circle" className="h-5 w-5 text-green-500" />
                          <span className="font-bold text-lg text-feature-commerce">
                            {order.orderNumber || '—'}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            #{index + 1 + (currentPage - 1) * pageSize}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Icon name="user" className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">
                              {order.customer?.name || order.customer?.email || '—'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Icon name="phone" className="h-4 w-4 text-gray-400" />
                            <span className="font-mono text-sm">
                              {order.customer?.phone || '—'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Icon name="truck" className="h-4 w-4 text-gray-400" />
                            <span>{order?.driver?.name || '—'}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Icon name="package" className="h-4 w-4 text-gray-400" />
                            <span>{order.items?.length || 0} منتج</span>
                          </div>
                        </div>
                      </div>

                      {/* Amount & Actions */}
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <div className="text-2xl font-bold text-feature-commerce">
                            {formatCurrency(order.amount || 0)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.deliveredAt ? formatDate(String(order.deliveredAt)) : '—'}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            href={`/dashboard/show-invoice/${order.id}`}
                            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-white bg-feature-commerce rounded-md hover:bg-feature-commerce/90 transition-colors"
                          >
                            <Icon name="eye" className="h-3 w-3" />
                            تفاصيل
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Icon name="check-circle" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">لا توجد طلبات مسلمة</h3>
                <p className="text-gray-500 mb-4">لم يتم العثور على طلبات في هذه الفترة</p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={() => handleDateRangeChange('all')}>
                    عرض الكل
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSearchTerm('')}>
                    مسح البحث
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        {orders.length > 0 && (
          <CardFooter className="border-t bg-gray-50/50">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
              <div className="text-sm text-gray-600">
                عرض {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, deliveredCount)} من {deliveredCount} طلب
              </div>
              {renderPagination()}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
