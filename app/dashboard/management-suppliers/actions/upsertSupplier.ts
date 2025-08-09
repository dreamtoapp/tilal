'use server';

import db from '@/lib/prisma';
import { Slugify } from '../../../../utils/slug';
import { revalidateTag } from 'next/cache';

import {
  SupplierFormData,
  SupplierSchema,
} from '../helper/supplierZodAndInputs';

// -------------------- ✅ Type-safe validation --------------------
type ValidationResult =
  | { ok: false; msg: string; errors: Record<string, string[]> }
  | { ok: true; data: SupplierFormData };

function validateFormData(formData: SupplierFormData): ValidationResult {
  const parsed = SupplierSchema.safeParse(formData);

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
async function isDuplicateSupplier(phone: string, email: string) {
  const existingSupplier = await db.supplier.findFirst({
    where: {
      OR: [{ phone }, { email }],
    },
  });

  return !!existingSupplier;
}

// -------------------- ✅ Create supplier --------------------
async function createSupplier(data: SupplierFormData) {
  const duplicate = await isDuplicateSupplier(data.phone, data.email);
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

  await db.supplier.create({
    data: {
      name: data.name,
      slug: Slugify(data.name),
      email: data.email,
      phone: data.phone,
      address: data.address,
    },
  });
  revalidateTag('suppliers');

  return {
    ok: true,
    msg: 'تم إضافة المورد بنجاح',
  };
}

// -------------------- ✅ Update supplier --------------------
async function updateSupplier(data: SupplierFormData) {
  console.log(data)
  const supplier = await db.supplier.findFirst({
    where: { id: data.id },
  });

  if (!supplier) {
    return {
      ok: false,
      msg: 'المورد غير موجود',
      errors: { phone: ['لا يمكن العثور على المورد برقم الهاتف المحدد'] },
    };
  }

  await db.supplier.update({
    where: { id: data.id },
    data: {
      name: data.name,
      slug: Slugify(data.name),
      email: data.email,
      phone: data.phone,
      address: data.address,
    },
  });
  revalidateTag('suppliers');

  return {
    ok: true,
    msg: 'تم تعديل بيانات المورد بنجاح',
  };
}

// -------------------- ✅ Main action --------------------
export async function upsertSupplier(
  formData: SupplierFormData,

  mode: 'new' | 'update'
) {
  try {
    const validation = validateFormData(formData);
    if (!validation.ok) return validation;

    const data = validation.data;

    if (mode === 'new') {
      return await createSupplier(data);
    }

    if (mode === 'update') {
      return await updateSupplier(data);
    }

    return {
      ok: false,
      msg: 'وضع غير مدعوم',
      errors: {},
    };
  } catch (error) {
    console.error('upsertSupplier error:', error);
    return {
      ok: false,
      msg: 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً',
      errors: {},
    };
  }
}
