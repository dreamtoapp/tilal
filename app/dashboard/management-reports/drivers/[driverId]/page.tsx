import Link from '@/components/link';
import { getDriverOrders } from '../actions/getDriverOrders';
import { Prisma } from '@prisma/client';
import { getDriversReport } from '../actions/getDriversReport';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageProps } from '@/types/commonTypes';

// Define types based on Prisma payloads
type DriverWithOrders = Prisma.UserGetPayload<{
  include: {
    driverOrders: {
      include: {
        items: true;
      };
    };
  };
}>;
// Note: OrderWithCustomer type isn't strictly needed here as TS infers it from getDriverOrders

// Remove empty interface and use PageProps directly
export default async function DriverDetailsPage({ params, searchParams }: PageProps<{ driverId: string }, { page?: string }>) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { driverId } = resolvedParams;
  const page = resolvedSearchParams?.page;

  const currentPage = page ? Number(page) : 1;
  const pageSize = 10;

  // Fetch driver info (name, etc)
  const drivers: DriverWithOrders[] = await getDriversReport(); // Type drivers array
  const driver = drivers.find((d: DriverWithOrders) => d.id === driverId); // Use correct type for d

  if (!driver) {
    return <div>Driver not found</div>;
  }

  // Fetch orders for this driver
  const { orders, totalCount } = await getDriverOrders(driverId, currentPage, pageSize);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className='mx-auto max-w-4xl py-8 space-y-6'>
      <div className='mb-4 flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold mb-1'>تفاصيل السائق: {driver?.name || driverId}</h2>
          <div className='text-muted-foreground text-sm'>رقم الجوال: <span className='font-semibold'>{driver?.phone || '-'}</span></div>
          <div className='flex gap-4 mt-2'>
            <span className='px-3 py-1 rounded bg-muted text-xs'>إجمالي الطلبات: <span className='font-bold'>{driver?.driverOrders?.length || 0}</span></span>
            <span className='px-3 py-1 rounded bg-success-foreground/10 text-xs text-success-foreground'>المكتملة: <span className='font-bold'>{driver?.driverOrders?.filter((o: { status: string }) => o.status === 'DELIVERED').length || 0}</span></span>
            <span className='px-3 py-1 rounded bg-destructive-foreground/10 text-xs text-destructive-foreground'>الملغاة: <span className='font-bold'>{driver?.driverOrders?.filter((o: { status: string }) => o.status === 'CANCELED').length || 0}</span></span>
            <span className='px-3 py-1 rounded bg-primary/10 text-xs text-primary'>الأرباح: <span className='font-bold'>{(driver?.driverOrders?.reduce((sum: number, o: { status: string; amount: number }) => sum + (o.status === 'DELIVERED' ? o.amount : 0), 0) || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ر.س</span></span>
          </div>
        </div>
        <Link
          href='/dashboard/reports/drivers'
          className='rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 shadow'
        >
          رجوع
        </Link>
      </div>
      <div className='bg-muted/40 rounded-lg border border-border shadow-sm p-4'>
        <Table>
          <TableHeader>
            <TableRow className='text-right'>
              <TableHead className='text-right'>رقم الطلب</TableHead>
              <TableHead className='text-right'>الحالة</TableHead>
              <TableHead className='text-right'>المبلغ</TableHead>
              <TableHead className='text-right'>العميل</TableHead>
              <TableHead className='text-right'>تاريخ الطلب</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='text-center text-gray-400'>
                  لا توجد طلبات لهذا السائق
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className='text-right'>{order.orderNumber || order.id}</TableCell>
                  <TableCell className={`text-right font-bold ${order.status === 'DELIVERED' ? 'text-success-foreground' : order.status === 'CANCELED' ? 'text-destructive-foreground' : ''}`}>{order.status}</TableCell>
                  <TableCell className='text-right'>
                    {order.amount?.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ر.س
                  </TableCell>
                  <TableCell className='text-right'>{order.customer?.name || '-'}</TableCell>
                  <TableCell className='text-right'>
                    {order.createdAt ? new Date(order.createdAt).toLocaleString('ar-EG') : '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* Pagination Controls */}
        {
          totalPages > 1 && (
            <div className='mt-4 flex items-center justify-between'>
              <a
                className='rounded bg-gray-200 px-3 py-1 disabled:opacity-50 shadow'
                href={`?page=${currentPage - 1}`}
                aria-disabled={currentPage === 1}
                tabIndex={currentPage === 1 ? -1 : 0}
                style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto' }}
              >
                السابق
              </a>
              <span className='text-sm text-muted-foreground'>
                صفحة {currentPage} من {totalPages}
              </span>
              <a
                className='rounded bg-gray-200 px-3 py-1 disabled:opacity-50 shadow'
                href={`?page=${currentPage + 1}`}
                aria-disabled={currentPage === totalPages}
                tabIndex={currentPage === totalPages ? -1 : 0}
                style={{ pointerEvents: currentPage === totalPages ? 'none' : 'auto' }}
              >
                التالي
              </a>
            </div>
          )
        }
      </div>
    </div>
  );
}
