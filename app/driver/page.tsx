import getSession from '@/lib/getSession';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Icon } from '@/components/icons/Icon';
import { getOrderByStatus } from './actions/getOrderByStatus';
import { ORDER_STATUS } from '@/constant/order-status';
import ActiveTrip from './components/ActiveTrip';

const NoActiveOrder = () => (
  <div className='flex min-h-screen w-full flex-col items-center justify-center bg-background'>
    <div className='bg-card rounded-xl shadow-lg p-8 flex flex-col items-center max-w-md w-full border border-border'>
      <div className='bg-muted rounded-full p-4 mb-4'>
        <Icon name="Info" className="text-primary" size="xl" />
      </div>
      <h2 className='text-2xl font-bold text-primary mb-2'>لا توجد رحلة نشطة حالياً</h2>
      <p className='text-base text-muted-foreground text-center mb-2'>
        لا يوجد لديك أي طلبات قيد التوصيل في الوقت الحالي.<br />
        ستظهر تفاصيل الرحلة هنا عندما يتم تعيين طلب جديد لك.
      </p>
      <div className='mt-4 text-sm text-muted-foreground text-center'>
        <Icon name="Rocket" className="inline-block mr-1 text-primary" />
        تأكد من تحديث الصفحة عند استلام طلب جديد.
      </div>
    </div>
  </div>
);

async function Page() {
  try {
    const session = await getSession();
    const user = session?.user;
    if (!user || !user.id) {
      return (
        <Alert variant='destructive'>
          <AlertTitle>غير مصرح</AlertTitle>
          <AlertDescription>يرجى تسجيل الدخول كـ سائق للوصول إلى هذه الصفحة</AlertDescription>
        </Alert>
      );
    }
    const driverId = user.id;
    const { ordersToShip } = await getOrderByStatus(driverId, ORDER_STATUS.IN_TRANSIT);
    if (!ordersToShip || ordersToShip.length === 0) {
      return <NoActiveOrder />;
    }
    // Multiple IN_TRANSIT orders: show warning and disable actions except revert
    if (ordersToShip.length > 1) {
      return (
        <div className='flex flex-col gap-4 p-4'>
          <div className='bg-warning-soft-background text-warning-foreground rounded-lg p-4 text-center font-bold mb-4'>
            يوجد أكثر من طلب جاري التوصيل. يرجى إرجاع الطلبات الزائدة إلى قائمة التعيين.
          </div>
          {ordersToShip.map((order: any) => (
            <ActiveTrip key={order.id} order={order} disableAllActions={true} driverId={driverId} />
          ))}
        </div>
      );
    }
    // Single IN_TRANSIT order
    const order = ordersToShip[0];
    return (
      <div className='flex flex-col gap-4 p-4'>
        <ActiveTrip order={order} disableAllActions={false} driverId={driverId} />
      </div>
    );
  } catch {
    return (
      <Alert variant='destructive'>
        <AlertTitle>حدث خطأ</AlertTitle>
        <AlertDescription>فشل في تحميل البيانات، يرجى التحقق من الاتصال بالإنترنت</AlertDescription>
      </Alert>
    );
  }
}

export default Page;
