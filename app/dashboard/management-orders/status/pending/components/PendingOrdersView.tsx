'use client';
// app/dashboard/orders-management/status/pending/components/PendingOrdersView.tsx
import React, { useState } from 'react';

import { Icon } from '@/components/icons/Icon';
import { ChevronDown } from 'lucide-react';
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import OrderTable from './OrderTable';
import { Order } from '@/types/databaseTypes';

interface PendingOrdersViewProps {
  orders: Order[];
  pendingCount: number;
  currentPage: number;
  pageSize: number;
  orderType?: 'pending' | 'assigned';
}

export default function PendingOrdersView({
  orders,
  pendingCount,
  currentPage,
  pageSize,
  orderType = 'pending'
}: PendingOrdersViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Accept sort and search params from parent (via URL)
  const search = searchParams.get('search') || '';
  const sortByParam = searchParams.get('sortBy') as 'createdAt' | 'amount' | 'orderNumber' || 'createdAt';
  const sortOrderParam = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc';

  const [sortBy, setSortBy] = useState<'createdAt' | 'amount' | 'orderNumber'>(sortByParam);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(sortOrderParam);
  const [searchTerm, setSearchTerm] = useState(search);

  // Update URL with new sort/filter/search
  const updateQuery = (paramsObj: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(paramsObj).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ search: searchTerm, page: 1, sortBy, sortOrder });
  };

  // Handle sort
  const handleSort = (field: 'createdAt' | 'amount' | 'orderNumber') => {
    const newOrder = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortBy(field);
    setSortOrder(newOrder);
    updateQuery({ sortBy: field, sortOrder: newOrder, page: 1, search: searchTerm });
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSortBy('createdAt');
    setSortOrder('desc');
    updateQuery({ search: '', sortBy: 'createdAt', sortOrder: 'desc', page: 1 });
  };

  // Check if filters are active
  const hasActiveFilters = search || sortBy !== 'createdAt' || sortOrder !== 'desc';

  // Get sort icon
  const getSortIcon = (field: 'createdAt' | 'amount' | 'orderNumber') => {
    if (sortBy === field) {
      return sortOrder === 'asc' ? <Icon name="SortAsc" className="h-4 w-4" /> : <Icon name="SortDesc" className="h-4 w-4" />;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <Collapsible defaultOpen>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="mb-2 flex items-center gap-2 group">
            <Icon name="Search" className="h-5 w-5 text-status-pending" />
            <span>Search & Filter</span>
            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="shadow-lg border-l-4 border-l-status-pending">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Icon name="Search" className="h-5 w-5 text-status-pending" />
                البحث والتصفية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Bar Section */}
              <div className="space-y-3">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="search"
                    placeholder={orderType === 'assigned'
                      ? "بحث في الطلبات المُخصصة (رقم الطلب، اسم العميل، اسم السائق)..."
                      : "بحث عن طلب (رقم الطلب، اسم العميل، رقم الهاتف)..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" className="gap-2 sm:w-auto w-full">
                    <Icon name="Search" className="h-4 w-4" />
                    بحث
                  </Button>
                </form>

                {/* Search Results Info */}
                <div className="flex justify-between items-center">
                  {search ? (
                    <Badge variant="outline" className={`${orderType === 'assigned'
                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                      : 'bg-status-pending-soft text-status-pending border-status-pending'
                      }`}>
                      نتائج البحث: {orders.length}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-muted text-muted-foreground">
                      {orderType === 'assigned' ? 'إجمالي الطلبات المُخصصة:' : 'إجمالي الطلبات:'} {pendingCount}
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              {/* Sort Controls */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="Filter" className="h-4 w-4 text-feature-analytics" />
                    <span className="text-sm font-semibold text-foreground">ترتيب حسب:</span>
                  </div>

                  {/* Clear Filters Button */}
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearFilters}
                      className="gap-2 text-muted-foreground border-dashed"
                    >
                      <Icon name="X" className="h-3 w-3" />
                      مسح الفلاتر
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={sortBy === 'createdAt' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSort('createdAt')}
                    className="gap-1 min-w-[90px]"
                  >
                    الأحدث
                    {getSortIcon('createdAt')}
                  </Button>

                  <Button
                    variant={sortBy === 'amount' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSort('amount')}
                    className="gap-1 min-w-[90px]"
                  >
                    المبلغ
                    {getSortIcon('amount')}
                  </Button>

                  <Button
                    variant={sortBy === 'orderNumber' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSort('orderNumber')}
                    className="gap-1 min-w-[90px]"
                  >
                    رقم الطلب
                    {getSortIcon('orderNumber')}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Status Info */}
              <div className="bg-muted/50 border rounded-lg p-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-card">
                    الصفحة: {currentPage}
                  </Badge>

                  <Badge variant="outline" className="bg-card">
                    المعروض: {orders.length} من {pendingCount}
                  </Badge>

                  {sortBy && (
                    <Badge variant="outline" className="bg-feature-analytics-soft text-feature-analytics border-feature-analytics gap-1">
                      الترتيب: {sortBy === 'createdAt' ? 'التاريخ' : sortBy === 'amount' ? 'المبلغ' : 'رقم الطلب'}
                      {getSortIcon(sortBy)}
                    </Badge>
                  )}

                  {search && (
                    <Badge variant="outline" className="bg-status-priority-soft text-status-priority border-status-priority">
                      البحث: &quot;{search}&quot;
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Orders Results Section */}
      <Card className="shadow-lg border-l-4 border-l-feature-commerce">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Icon name="FileText" className="h-5 w-5 text-feature-commerce" />
            {orderType === 'assigned' ? 'الطلبات المُخصصة للسائقين' : 'الطلبات قيد الانتظار'}
            <Badge className={`px-2 py-1 ml-2 text-sm ${orderType === 'assigned'
              ? 'bg-blue-500 text-white'
              : 'bg-status-pending text-white'
              }`}>
              {orders.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTable
            orders={orders}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={Math.ceil(pendingCount / pageSize) || 1}
            updatePage={(page) => updateQuery({ page, sortBy, sortOrder, search: searchTerm })}
            sortBy={sortBy}
            sortOrder={sortOrder}
            orderType={orderType}
          />
        </CardContent>
      </Card>
    </div>
  );
}
