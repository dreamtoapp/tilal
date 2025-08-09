import { DriversReportTable } from './components/DriversReportTable';
import { Prisma, UserRole } from '@prisma/client';
import db from '@/lib/prisma';

type DriverWithOrders = Prisma.UserGetPayload<{
  include: {
    driverOrders: {
      include: {
        items: true;
      };
    };
  };
}>;

export default async function DriversReportPage() {
  const drivers = await db.user.findMany({
    where: { role: UserRole.DRIVER },
    include: {
      driverOrders: {
        include: {
          items: true,
        },
      },
    },
  });

  return (
    <div className='rtl mx-auto max-w-6xl px-2 py-10 text-right'>
      <h1 className='mb-6 text-3xl font-bold text-primary'>تقرير السائقين والتوصيل</h1>
      <DriversReportTable
        drivers={drivers.map((driver: DriverWithOrders) => ({
          id: driver.id,
          name: driver.name || 'No Name',
          phone: driver.phone || 'No Phone',
          orders: driver.driverOrders.map((order) => ({
            id: order.id,
            status: order.status,
            amount: order.amount,
            createdAt: order.createdAt,
          })),
        }))}
        page={1}
      />
    </div>
  );
}
