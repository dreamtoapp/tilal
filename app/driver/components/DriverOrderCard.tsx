'use client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardFooter,
} from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { Order } from '@/types/databaseTypes';

import { startTrip } from '../actions/startTrip';
import { setOrderInTransit } from '../actions/setOrderInTransit';

export default function DriverOrderCard({ order, activeTrip }: { order: Order, activeTrip: boolean }) {
  // Helper: Status badge
  const statusBadge = (status: string) => {
    let color = 'bg-yellow-500';
    let label = 'مخصص للتسليم';
    if (status === 'IN_TRANSIT') { color = 'bg-blue-600'; label = 'جاري التوصيل'; }
    if (status === 'DELIVERED') { color = 'bg-green-600'; label = 'تم التسليم'; }
    if (status === 'CANCELED') { color = 'bg-red-600'; label = 'ملغي'; }
    return <span className={`px-3 py-1 rounded-full text-white text-xs font-bold ${color}`}>{label}</span>;
  };

  // Helper: Address section
  const addressSection = (
    <div className='flex items-center gap-2 bg-muted rounded p-2 my-2'>
      <Icon name="MapPin" size="sm" />
      <span className='font-bold'>العنوان:</span>
      <span className='truncate'>{order.address?.label || 'غير متوفر'}</span>
      {order.address?.latitude && order.address?.longitude && (
        <Button
          size='sm'
          variant='secondary'
          className='ml-auto'
          onClick={() => {
            const lat = order.address.latitude;
            const lng = order.address.longitude;
            window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank', 'noopener,noreferrer');
          }}
        >
          <Icon name="Navigation" size="xs" /> توجيه
        </Button>
      )}
    </div>
  );

  // Helper: Customer section
  const customerSection = (
    <div className='flex items-center gap-2 my-2'>
      <Icon name="User" size="sm" />
      <span className='font-bold'>{order.customer.name || 'عميل غير معروف'}</span>
      {order.customer.phone && (
        <Button
          size='sm'
          variant='secondary'
          className='ml-auto'
          onClick={() => window.open(`tel:${order.customer.phone}`)}
        >
          <Icon name="Phone" size="xs" /> اتصل بالعميل
        </Button>
      )}
    </div>
  );

  // Helper: Product list
  const productList = (
    <div className='bg-muted rounded p-2 my-2 max-h-32 overflow-y-auto'>
      <div className='flex items-center gap-2 mb-2'>
        <Icon name="Package" size="sm" />
        <span className='font-bold'>المنتجات</span>
      </div>
      {order.items.map((item, idx) => (
        <div key={item.id || idx} className='flex justify-between items-center border-b border-border py-1'>
          <span>{item.product?.name}</span>
          <span className='text-muted-foreground'>x{item.quantity}</span>
          <span className='font-bold'>{item.price} ريال</span>
        </div>
      ))}
    </div>
  );

  // Helper: Notes
  const notes = (order as any).notes && (
    <div className='bg-yellow-100 text-yellow-800 rounded p-2 my-2 flex items-center gap-2'>
      <Icon name="Info" size="sm" />
      <span>{(order as any).notes}</span>
    </div>
  );

  // Helper: Total
  const total = (
    <div className='flex justify-between items-center mt-2'>
      <span className='font-bold text-lg'>الإجمالي</span>
      <span className='font-bold text-primary text-xl'>{order.amount.toFixed(2)} ريال</span>
    </div>
  );

  // Header
  const header = (
    <div className='flex items-center justify-between mb-2'>
      <div className='flex items-center gap-2'>
        <span className='font-bold text-base'>طلب #{order.orderNumber}</span>
        <Button size='icon' variant='ghost' onClick={() => navigator.clipboard.writeText(order.orderNumber)} title='نسخ رقم الطلب'>
          <Icon name="Copy" size="xs" />
        </Button>
      </div>
      {statusBadge(order.status)}
    </div>
  );

  // ASSIGNED
  if (order.status === 'ASSIGNED') {
    return (
      <Card className='bg-background shadow-md p-4 mb-4'>
        {header}
        {customerSection}
        {addressSection}
        {productList}
        {notes}
        {total}
        <CardFooter className='mt-4 flex flex-col gap-2'>
          <Button size='lg' className='w-full text-lg' variant='default' onClick={async () => {
            const res = await setOrderInTransit(order.id, order.driver?.id ?? '');
            if (res.success) toast.success('تم تحديث حالة الطلب');
            else toast.error(res.error);
          }}>
            <Icon name="Rocket" size="sm" className="ml-2" /> بدء الرحلة
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // IN_TRANSIT (no ActiveTrip)
  if (order.status === 'IN_TRANSIT' && !activeTrip) {
    return (
      <Card className='bg-background shadow-md p-4 mb-4'>
        {header}
        {customerSection}
        {addressSection}
        {productList}
        {notes}
        {total}
        <CardFooter className='mt-4 flex flex-col gap-2'>
          <Button size='lg' className='w-full text-lg' variant='default' onClick={async () => {
            const res = await startTrip(
              order.id,
              order.driver?.id ?? '',
              order.address?.latitude ?? '',
              order.address?.longitude ?? ''
            );
            if (res.success) toast.success('تم بدء التتبع');
            else toast.error(res.error);
          }}>
            <Icon name="CheckCircle" size="sm" className="ml-2" /> تأكيد بدء التتبع
          </Button>
          <span className='text-xs text-muted-foreground text-center'>لن يبدأ التتبع إلا بعد التأكيد</span>
        </CardFooter>
      </Card>
    );
  }

  // IN_TRANSIT (with ActiveTrip)
  if (order.status === 'IN_TRANSIT' && activeTrip) {
    return (
      <Card className='bg-background shadow-md p-4 mb-4'>
        {header}
        {customerSection}
        {addressSection}
        {productList}
        {notes}
        {total}
        <CardFooter className='mt-4 flex gap-2'>
          <Button size='lg' className='flex-1' variant='default'>
            <Icon name="Check" size="sm" className="ml-2" /> تسليم الطلب
          </Button>
          <Button size='lg' className='flex-1' variant='destructive'>
            <Icon name="X" size="sm" className="ml-2" /> إلغاء الطلب
          </Button>
        </CardFooter>
        {/* Tracking logic will be implemented here later */}
      </Card>
    );
  }

  // DELIVERED/CANCELED
  return (
    <Card className='bg-background shadow-md p-4 mb-4 opacity-60'>
      {header}
      {customerSection}
      {addressSection}
      {productList}
      {notes}
      {total}
      <CardFooter className='mt-4'>
        <span className='text-muted-foreground w-full text-center'>تمت المعالجة</span>
      </CardFooter>
    </Card>
  );
}
