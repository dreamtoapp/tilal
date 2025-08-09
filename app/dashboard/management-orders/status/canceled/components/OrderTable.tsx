// app/dashboard/orders-management/status/canceled/components/OrderTable.tsx
'use client';

import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/utils';
import { Order } from '@/types/databaseTypes';

import { restoreOrder } from '../actions/restore-order';

interface OrderTableProps {
  orders: Order[];
  currentPage: number;
  pageSize: number;
  updatePage: (page: number) => void;
  totalPages: number;
}

export default function OrderTable({
  orders,
  currentPage,
  updatePage,
  totalPages
}: OrderTableProps) {

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
    <Card>
      <CardContent className="p-0">
        <Table dir="rtl">
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">رقم الطلب</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">المبلغ</TableHead>
              <TableHead className="text-right">طريقة الدفع</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-amber-50">
                <TableCell className="font-medium">
                  <Link href={`/dashboard/show-invoice/${order.id}`} className="text-primary hover:underline">
                    #{order.id.substring(0, 8)}
                  </Link>
                </TableCell>
                <TableCell>{order.customer.name || 'غير معروف'}</TableCell>
                <TableCell className="font-semibold">{order.amount} ر.س</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {order.paymentMethod}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: ar })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-green-600 hover:bg-green-100 hover:text-green-700"
                      onClick={async () => {
                        await restoreOrder(order.id);
                        updatePage(currentPage);
                      }}
                    >
                      {/* <Check className="h-4 w-4" /> */}
                      Restore
                    </Button>
                    <Link
                      href={`/dashboard/show-invoice/${order.id}`}
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm font-medium transition-colors",
                        "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <Icon name="Search" className="h-4 w-4" />
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-center p-4">
        {renderPagination()}
      </CardFooter>
    </Card>
  );
}
