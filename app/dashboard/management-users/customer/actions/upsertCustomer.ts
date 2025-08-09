'use server';

import { revalidatePath } from 'next/cache';


import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';

import { CustomerFormData } from '../helpers/customerSchema';

interface UpsertResult {
  ok: boolean;
  msg?: string;
  userId?: string;
}

export async function upsertCustomer(
  formData: CustomerFormData,
  mode: 'new' | 'update',
  userId?: string
): Promise<UpsertResult> {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = formData;

    if (mode === 'new') {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email || undefined },
            { phone: phone || undefined },
          ],
        },
      });

      if (existingUser) {
        return {
          ok: false,
          msg: 'يوجد مستخدم بنفس البريد الإلكتروني أو رقم الهاتف',
        };
      }

      // Create new customer
      const newCustomer = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password,
          role: UserRole.CUSTOMER,
        },
      });

      revalidatePath('/dashboard/management-users/customer');
      return {
        ok: true,
        msg: 'تم إضافة العميل بنجاح',
        userId: newCustomer.id,
      };
    } else {
      // Update existing customer
      if (!userId) {
        return {
          ok: false,
          msg: 'معرف المستخدم مطلوب للتحديث',
        };
      }

      // Check if email/phone is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email || undefined },
            { phone: phone || undefined },
          ],
          NOT: {
            id: userId,
          },
        },
      });

      if (existingUser) {
        return {
          ok: false,
          msg: 'يوجد مستخدم آخر بنفس البريد الإلكتروني أو رقم الهاتف',
        };
      }

      // Update customer
      const updatedCustomer = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          email,
          phone,
          password,
        },
      });

      revalidatePath('/dashboard/management-users/customer');
      return {
        ok: true,
        msg: 'تم تحديث بيانات العميل بنجاح',
        userId: updatedCustomer.id,
      };
    }
  } catch (error) {
    console.error('Error upserting customer:', error);
    return {
      ok: false,
      msg: 'حدث خطأ أثناء حفظ بيانات العميل',
    };
  }
} 