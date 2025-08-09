'use client';
// app/dashboard/orders-management/components/OrdersList.tsx
import React, { useState } from 'react';

import { Icon } from '@/components/icons/Icon';
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';

// Using string values for order status
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { fetchOrdersAction } from '../../management-dashboard/action/fetchOrders';
import OrderCard from './OrderCard';
import { Order } from '@/types/databaseTypes';

interface OrdersListProps {
  initialOrders: Order[];
  currentPage: number;
  pageSize: number;
  status?: string;
  totalPages: number;
  totalOrders: number;
}

export default function OrdersList({
  initialOrders,
  currentPage,
  pageSize,
  status
}: OrdersListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Update URL with new page number
  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(1);
  };

  // Fetch orders with filters
  const fetchOrders = async (page: number) => {
    setLoading(true);
    try {
      const result = await fetchOrdersAction({
        status,
        page,
        pageSize,
        // Remove search parameter as it's not supported in the API
        // Add query parameter if needed later
      });

      setOrders(result || []);
      // Assuming the API returns total pages info
      setTotalPages(Math.ceil((result?.length || 0) / pageSize) || 1);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    fetchOrders(1);
  };

  // Generate pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => updatePage(i)}
          className="h-8 w-8"
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updatePage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <Icon name="ChevronRight" className="h-4 w-4" />
        </Button>

        {pages}

        <Button
          variant="outline"
          size="sm"
          onClick={() => updatePage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <Icon name="ChevronLeft" className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2 rtl:space-x-reverse">
          <Input
            type="search"
            placeholder="بحث عن طلب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Button type="submit" size="sm">
            <Icon name="Search" className="h-4 w-4 ml-2 rtl:mr-2" />
            بحث
          </Button>
        </form>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Icon name="Filter" className="h-4 w-4" />
          <span className="text-sm">ترتيب حسب:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="اختر الترتيب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">الأحدث</SelectItem>
              <SelectItem value="oldest">الأقدم</SelectItem>
              <SelectItem value="price-high">السعر: من الأعلى</SelectItem>
              <SelectItem value="price-low">السعر: من الأقل</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Icon name="Loader2" className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : orders.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Icon name="Package" className="h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">لا توجد طلبات</h3>
            <p className="text-sm text-gray-500">
              {status
                ? 'لا توجد طلبات بهذه الحالة حالياً'
                : 'لا توجد طلبات متاحة حالياً'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {orders.length > 0 && (
        <div className="flex justify-center pt-4">
          {renderPagination()}
        </div>
      )}
    </div>
  );
}
