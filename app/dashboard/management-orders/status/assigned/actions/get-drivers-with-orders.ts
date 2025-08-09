import db from '@/lib/prisma';
import { UserRole, OrderStatus } from '@prisma/client';

export async function fetchDriversWithAssignedOrders() {
  // Fetch all drivers
  const drivers = await db.user.findMany({
    where: { role: UserRole.DRIVER },
    select: {
      id: true,
      name: true,
      image: true,
      driverOrders: {
        where: { status: OrderStatus.ASSIGNED },
        include: {
          customer: { 
            select: { 
              name: true,
              phone: true,
              email: true
            } 
          },
          address: true,
          items: {
            include: {
              product: true,
            }
          },
        },
      },
    },
  });
  return drivers;
} 