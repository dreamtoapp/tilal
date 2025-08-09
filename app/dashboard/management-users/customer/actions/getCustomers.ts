'use server';

import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function getCustomers() {
  try {
    const customers = await prisma.user.findMany({
      where: {
        role: UserRole.CUSTOMER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        password: true,
        image: true,
        // Include addresses
        addresses: {
          select: {
            id: true,
            label: true,
            district: true,
            street: true,
            buildingNumber: true,
            floor: true,
            apartmentNumber: true,
            landmark: true,
            deliveryInstructions: true,
            latitude: true,
            longitude: true,
            isDefault: true,
          },
          orderBy: [
            { isDefault: 'desc' },
            { createdAt: 'desc' }
          ],
        },
        // Include order count
        customerOrders: {
          select: { id: true }
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Add order count to each customer
    return customers.map(customer => ({
      ...customer,
      orderCount: customer.customerOrders.length
    }));
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
} 