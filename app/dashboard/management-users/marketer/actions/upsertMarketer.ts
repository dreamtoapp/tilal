'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';

import { MarketerFormData } from '../helpers/marketerSchema';

interface UpsertResult {
  ok: boolean;
  msg?: string;
  marketerId?: string;
}

export async function upsertMarketer(
  formData: MarketerFormData,
  mode: 'new' | 'update',
  marketerId?: string
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

    } = formData;

    if (mode === 'new') {
      // Check if marketer already exists
      const existingMarketer = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email || undefined },
            { phone: phone || undefined },
          ],
        },
      });

      if (existingMarketer) {
        return {
          ok: false,
          msg: 'يوجد مسوق بنفس البريد الإلكتروني أو رقم الهاتف',
        };
      }

      // Create new marketer
      const newMarketer = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password,
          role: UserRole.MARKETER,
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

      revalidatePath('/dashboard/management-users/marketer');
      return {
        ok: true,
        msg: 'تم إضافة المسوق بنجاح',
        marketerId: newMarketer.id,
      };
    } else {
      // Update existing marketer
      if (!marketerId) {
        return {
          ok: false,
          msg: 'معرف المسوق مطلوب للتحديث',
        };
      }

      // Check if email/phone is already taken by another user
      const existingMarketer = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email || undefined },
            { phone: phone || undefined },
          ],
          NOT: {
            id: marketerId,
          },
        },
      });

      if (existingMarketer) {
        return {
          ok: false,
          msg: 'يوجد مسوق آخر بنفس البريد الإلكتروني أو رقم الهاتف',
        };
      }

      // Update marketer
      const updatedMarketer = await prisma.user.update({
        where: { id: marketerId },
        data: {
          name,
          email,
          phone,
          password,
        },
      });

      // Update or create default address
      const existingAddress = await prisma.address.findFirst({
        where: { userId: marketerId, isDefault: true },
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
            userId: marketerId,
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

      revalidatePath('/dashboard/management-users/marketer');
      return {
        ok: true,
        msg: 'تم تحديث بيانات المسوق بنجاح',
        marketerId: updatedMarketer.id,
      };
    }
  } catch (error) {
    console.error('Error upserting marketer:', error);
    return {
      ok: false,
      msg: 'حدث خطأ أثناء حفظ بيانات المسوق',
    };
  }
} 