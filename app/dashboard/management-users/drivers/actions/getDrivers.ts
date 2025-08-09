'use server';

import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function getDrivers() {
  try {
    const drivers = await prisma.user.findMany({
      where: {
        role: UserRole.DRIVER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,

        password: true,
        image: true,
        // Driver-specific fields
        vehicleType: true,
        vehiclePlateNumber: true,
        vehicleColor: true,
        vehicleModel: true,
        driverLicenseNumber: true,
        experience: true,
        maxOrders: true,
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
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return drivers;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return [];
  }
} 