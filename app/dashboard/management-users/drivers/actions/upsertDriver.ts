'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';

import { DriverFormData } from '../helpers/driverSchema';

interface UpsertResult {
  ok: boolean;
  msg?: string;
  driverId?: string;
}

export async function upsertDriver(
  formData: DriverFormData,
  mode: 'new' | 'update',
  driverId?: string
): Promise<UpsertResult> {
  try {
    const {
      name,
      email,
      phone,
      addressLabel,
      district,
      street,
      buildingNumber,
      floor,
      apartmentNumber,
      landmark,
      deliveryInstructions,
      password,
      vehicleType,
      vehiclePlateNumber,
      vehicleColor,
      vehicleModel,
      driverLicenseNumber,
      experience,
      maxOrders,
    } = formData;

    if (mode === 'new') {
      // Check if driver already exists
      const existingDriver = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email || undefined },
            { phone: phone || undefined },
          ],
        },
      });

      if (existingDriver) {
        return {
          ok: false,
          msg: 'يوجد سائق بنفس البريد الإلكتروني أو رقم الهاتف',
        };
      }

      // Create new driver
      const newDriver = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password,
          role: UserRole.DRIVER,
          // Driver-specific fields
          vehicleType,
          vehiclePlateNumber,
          vehicleColor,
          vehicleModel,
          driverLicenseNumber,
          experience: experience ? parseInt(experience) : 0,
          maxOrders: maxOrders ? parseInt(maxOrders) : 3,
          // Create default address using Address Book system
          addresses: {
            create: {
              label: addressLabel,
              district,
              street,
              buildingNumber,
              floor,
              apartmentNumber,
              landmark,
              deliveryInstructions,
              isDefault: true,
            },
          },
        },
      });

      revalidatePath('/dashboard/management-users/drivers');
      return {
        ok: true,
        msg: 'تم إضافة السائق بنجاح',
        driverId: newDriver.id,
      };
    } else {
      // Update existing driver
      if (!driverId) {
        return {
          ok: false,
          msg: 'معرف السائق مطلوب للتحديث',
        };
      }

      // Check if email/phone is already taken by another user
      const existingDriver = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email || undefined },
            { phone: phone || undefined },
          ],
          NOT: {
            id: driverId,
          },
        },
      });

      if (existingDriver) {
        return {
          ok: false,
          msg: 'يوجد سائق آخر بنفس البريد الإلكتروني أو رقم الهاتف',
        };
      }

      // Update driver
      const updatedDriver = await prisma.user.update({
        where: { id: driverId },
        data: {
          name,
          email,
          phone,
          password,
          // Driver-specific fields
          vehicleType,
          vehiclePlateNumber,
          vehicleColor,
          vehicleModel,
          driverLicenseNumber,
          experience: experience ? parseInt(experience) : 0,
          maxOrders: maxOrders ? parseInt(maxOrders) : 3,
        },
      });

      // Update or create default address
      const existingAddress = await prisma.address.findFirst({
        where: { userId: driverId, isDefault: true },
      });

      if (existingAddress) {
        // Update existing default address
        await prisma.address.update({
          where: { id: existingAddress.id },
          data: {
            label: addressLabel,
            district,
            street,
            buildingNumber,
            floor,
            apartmentNumber,
            landmark,
            deliveryInstructions,
          },
        });
      } else {
        // Create new default address
        await prisma.address.create({
          data: {
            userId: driverId,
            label: addressLabel,
            district,
            street,
            buildingNumber,
            floor,
            apartmentNumber,
            landmark,
            deliveryInstructions,
            isDefault: true,
          },
        });
      }

      revalidatePath('/dashboard/management-users/drivers');
      return {
        ok: true,
        msg: 'تم تحديث بيانات السائق بنجاح',
        driverId: updatedDriver.id,
      };
    }
  } catch (error) {
    console.error('Error upserting driver:', error);
    return {
      ok: false,
      msg: 'حدث خطأ أثناء حفظ بيانات السائق',
    };
  }
} 