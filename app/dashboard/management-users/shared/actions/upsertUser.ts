'use server';

import db from '@/lib/prisma';
import { UserRole } from '@prisma/client';

import {
  UserFormData,
  UserSchema,
} from '../helper/userZodAndInputs';

// -------------------- ✅ Type-safe validation --------------------
type ValidationResult =
  | { ok: false; msg: string; errors: Record<string, string[]> }
  | { ok: true; data: UserFormData };

function validateFormData(formData: UserFormData): ValidationResult {
  const parsed = UserSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      ok: false,
      msg: 'يرجى تصحيح الأخطاء في النموذج',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  return {
    ok: true,
    data: parsed.data,
  };
}

// -------------------- ✅ Duplicate check --------------------
async function isDuplicateUser(phone: string, email: string) {
  const existingUser = await db.user.findFirst({
    where: {
      OR: [{ phone }, { email }],
    },
  });

  return !!existingUser;
}

// -------------------- ✅ Create user --------------------
async function createUser(data: UserFormData, role: UserRole) {
  const duplicate = await isDuplicateUser(data.phone, data.email);
  if (duplicate) {
    return {
      ok: false,
      msg: 'رقم الهاتف أو البريد الإلكتروني موجود بالفعل',
      errors: {
        phone: ['رقم الهاتف أو البريد الإلكتروني موجود بالفعل'],
        email: ['رقم الهاتف أو البريد الإلكتروني موجود بالفعل'],
      },
    };
  }

  await db.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role,
      // Vehicle fields for drivers
      vehicleType: data.vehicleType as any,
      vehiclePlateNumber: data.vehiclePlateNumber || undefined,
      vehicleColor: data.vehicleColor || undefined,
      vehicleModel: data.vehicleModel || undefined,
      driverLicenseNumber: data.driverLicenseNumber || undefined,
      experience: data.experience ? parseInt(data.experience) : undefined,
      maxOrders: data.maxOrders ? parseInt(data.maxOrders) : 3,
    },
  });

  return {
    ok: true,
    msg: 'تم إضافة المستخدم بنجاح',
  };
}

// -------------------- ✅ Update user --------------------
async function updateUser(data: UserFormData, role: UserRole) {
  const user = await db.user.findUnique({
    where: { phone: data.phone },
  });

  if (!user) {
    return {
      ok: false,
      msg: 'المستخدم غير موجود',
      errors: { phone: ['لا يمكن العثور على المستخدم برقم الهاتف المحدد'] },
    };
  }

  await db.user.update({
    where: { phone: data.phone },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role,
      // Vehicle fields for drivers
      vehicleType: data.vehicleType as any,
      vehiclePlateNumber: data.vehiclePlateNumber || undefined,
      vehicleColor: data.vehicleColor || undefined,
      vehicleModel: data.vehicleModel || undefined,
      driverLicenseNumber: data.driverLicenseNumber || undefined,
      experience: data.experience ? parseInt(data.experience) : undefined,
      maxOrders: data.maxOrders ? parseInt(data.maxOrders) : 3,
    },
  });

  return {
    ok: true,
    msg: 'تم تعديل بيانات المستخدم بنجاح',
  };
}

// -------------------- ✅ Main action --------------------
export async function upsertUser(
  formData: UserFormData,
  role: UserRole,
  mode: 'new' | 'update'
) {
  try {
    const validation = validateFormData(formData);
    if (!validation.ok) return validation;

    const data = validation.data;

    if (mode === 'new') {
      return await createUser(data, role);
    }

    if (mode === 'update') {
      return await updateUser(data, role);
    }

    return {
      ok: false,
      msg: 'وضع غير مدعوم',
      errors: {},
    };
  } catch (error) {
    console.error('upsertUser error:', error);
    return {
      ok: false,
      msg: 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً',
      errors: {},
    };
  }
}
