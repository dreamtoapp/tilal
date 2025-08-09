'use client';
import { useEffect, useState } from 'react';
import { Prisma } from '@prisma/client'; // Import Prisma
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Define type for orders fetched
type OrderWithCustomer = Prisma.OrderGetPayload<{ include: { customer: true } }>;

interface DriverOrdersModalProps {
  driverId: string;
  driverName: string;
}

async function fetchDriverOrders(driverId: string, page: number, pageSize: number) {
  'use server';
  const { getDriverOrders } = await import('../actions/getDriverOrders');
  return getDriverOrders(driverId, page, pageSize);
}

export function DriverOrdersModal({ driverId, driverName }: DriverOrdersModalProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [orders, setOrders] = useState<OrderWithCustomer[]>([]); // Use specific type
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchDriverOrders(driverId, page, pageSize)
      .then((data) => {
        if (mounted) {
          setOrders(data.orders);
          setTotalCount(data.totalCount);
        }
      })
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [driverId, page]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='text-blue-600 underline hover:text-blue-800'>مزيد من المعلومات</button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogTitle>جميع الطلبات للسائق: {driverName}</DialogTitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم الطلب</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead>العميل</TableHead>
              <TableHead>تاريخ الطلب</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className='text-center text-gray-400'>
                  جاري التحميل...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='text-center text-gray-400'>
                  لا توجد طلبات لهذا السائق
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => ( // Remove 'any' annotation
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    {order.amount?.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ر.س
                  </TableCell>
                  <TableCell>{order.customer?.name || '-'}</TableCell>
                  <TableCell>
                    {order.createdAt ? new Date(order.createdAt).toLocaleString('ar-EG') : '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className='mt-4 flex items-center justify-between'>
            <button
              className='rounded bg-gray-200 px-3 py-1 disabled:opacity-50'
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              السابق
            </button>
            <span>
              صفحة {page} من {totalPages}
            </span>
            <button
              className='rounded bg-gray-200 px-3 py-1 disabled:opacity-50'
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              التالي
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
