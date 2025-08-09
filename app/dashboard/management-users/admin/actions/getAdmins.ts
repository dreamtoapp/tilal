'use server';

import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function getAdmins() {
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: UserRole.ADMIN,
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
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return admins;
  } catch (error) {
    console.error('Error fetching admins:', error);
    return [];
  }
} 