import {
  ORDER_STATUS,
} from '@/constant/order-status';

import { getOrderByStatus } from '../actions/getOrderByStatus';

import AssignedOrderCard from '../components/AssignedOrderCard';

async function page({ searchParams }: { searchParams: Promise<{ driverId: string; status: string }>; }) {
  const { driverId, status } = await searchParams;

  // Normalize status
  const normalizedStatus =
    status === 'ASSIGNED' || status === ORDER_STATUS.ASSIGNED ? ORDER_STATUS.ASSIGNED :
      status === 'PENDING' || status === ORDER_STATUS.PENDING ? ORDER_STATUS.PENDING :
        status === 'IN_TRANSIT' || status === ORDER_STATUS.IN_TRANSIT || status === 'IN_WAY' ? ORDER_STATUS.IN_TRANSIT :
          status === 'DELIVERED' || status === ORDER_STATUS.DELIVERED ? ORDER_STATUS.DELIVERED :
            status === 'CANCELED' || status === ORDER_STATUS.CANCELED ? ORDER_STATUS.CANCELED :
              ORDER_STATUS.ASSIGNED;

  const orders = await getOrderByStatus(driverId, normalizedStatus);

  // Title assignment
  const title =
    status === ORDER_STATUS.IN_TRANSIT ? '    📦 قائمة التسليم ' :
      status === ORDER_STATUS.DELIVERED ? '    📦 تم التسليم ' :
        status === ORDER_STATUS.CANCELED ? '    📦 ملغي ' : '';

  return (
    <div className='flex min-h-screen pt-16 flex-col gap-6 p-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h1 className='text-xl font-bold text-foreground'>
            {title}الطلبيات المخصصة للتسليم
          </h1>
          <div className='flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-semibold shadow-lg border-2 border-primary/20'>
            {orders?.ordersToShip?.length || 0}
          </div>
        </div>
      </div>

      {Array.isArray(orders?.ordersToShip) && orders.ordersToShip.length > 0 ? (
        orders.ordersToShip.map((order: any) => (
          <AssignedOrderCard key={order.id} order={order} driverId={driverId} />
        ))
      ) : (
        <div className='flex flex-col items-center justify-center py-16 px-6'>
          <div className='w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6'>
            <svg className='w-12 h-12 text-muted-foreground' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
            </svg>
          </div>
          <h3 className='text-lg font-semibold text-foreground mb-2'>
            لا توجد طلبات مُخصصة
          </h3>
          <p className='text-sm text-muted-foreground text-center max-w-md'>
            {status === ORDER_STATUS.IN_TRANSIT
              ? 'لا توجد طلبات في قائمة التسليم حالياً'
              : status === ORDER_STATUS.DELIVERED
                ? 'لا توجد طلبات تم تسليمها بعد'
                : status === ORDER_STATUS.CANCELED
                  ? 'لا توجد طلبات ملغية'
                  : 'لا توجد طلبات مُخصصة لك في الوقت الحالي'}
          </p>
        </div>
      )}
    </div>
  );
}

export default page;
