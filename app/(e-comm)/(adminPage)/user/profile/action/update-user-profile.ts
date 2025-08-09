'use server';

import { revalidatePath } from 'next/cache';
import db from '@/lib/prisma';
import { UserFormData, UserSchema } from '../helper/userZodAndInputs';

export async function updateUserProfile(formData: UserFormData) {
  try {
    // ✅ Validate input using Zod
    const parseResult = UserSchema.safeParse(formData);

    if (!parseResult.success) {
      return {
        ok: false,
        msg: 'يرجى تصحيح الأخطاء في النموذج',
        errors: parseResult.error.flatten().fieldErrors,
      };
    }

    const data = parseResult.data;

    if (!data.phone) {
      return {
        ok: false,
        msg: 'رقم الهاتف مطلوب لتحديث المستخدم',
        errors: {},
      };
    }

    // ✅ ابحث عن المستخدم باستخدام رقم الهاتف فقط
    const existingUser = await db.user.findUnique({
      where: { phone: data.phone },
    });

    if (!existingUser) {
      return {
        ok: false,
        msg: 'المستخدم غير موجود',
        errors: {},
      };
    }

    // ✅ التحقق من عدم تكرار البريد الإلكتروني مع مستخدم آخر
    if (data.email && data.email !== existingUser.email) {
      const existingUserWithEmail = await db.user.findFirst({
        where: {
          email: data.email,
          NOT: {
            id: existingUser.id, // استثناء المستخدم الحالي
          },
        },
      });

      if (existingUserWithEmail) {
        return {
          ok: false,
          msg: 'البريد الإلكتروني مستخدم بالفعل من قبل مستخدم آخر',
          errors: { email: ['البريد الإلكتروني مستخدم بالفعل'] },
        };
      }
    }

    // ✅ استخرج القيم الفعلية فقط للتحديث
    const updateData: any = {
      name: data.name || undefined,
      email: data.email || undefined,
      password: data.password || undefined,
    };

    // ✅ نفّذ التحديث
    await db.user.update({
      where: { id: existingUser.id },
      data: updateData,
    });

    revalidatePath('/user/profile');

    return {
      ok: true,
      msg: 'تم تحديث بيانات المستخدم بنجاح',
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      ok: false,
      msg: 'حدث خطأ غير متوقع أثناء تحديث المستخدم، يرجى المحاولة لاحقاً',
      errors: {},
    };
  }
}
