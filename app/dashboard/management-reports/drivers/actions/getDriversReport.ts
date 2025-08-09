import db from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function getDriversReport() {
  // Fetch users with role: 'DRIVER' and their orders (as driver)
  return db.user.findMany({
    where: { role: UserRole.DRIVER },
    include: {
      driverOrders: {
        include: {
          items: true
        }
      }
    },
    orderBy: [{ name: 'asc' }],
  });
}
