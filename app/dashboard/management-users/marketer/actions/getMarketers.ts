'use server';

import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';

interface GetMarketersResult {
  ok: boolean;
  marketers?: any[];
  msg?: string;
}

export async function getMarketers(): Promise<GetMarketersResult> {
  try {
    const marketers = await prisma.user.findMany({
      where: {
        role: UserRole.MARKETER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      ok: true,
      marketers,
    };
  } catch (error) {
    console.error('Error fetching marketers:', error);
    return {
      ok: false,
      msg: 'حدث خطأ أثناء جلب بيانات المسوقين',
    };
  }
} 