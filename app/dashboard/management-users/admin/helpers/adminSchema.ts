import { z } from 'zod';

// Admin-specific validation schema
export const AdminSchema = z.object({
  name: z.string().trim().nonempty('الاسم مطلوب'),
  email: z.string().trim().email('صيغة البريد الإلكتروني غير صحيحة'),
  phone: z
    .string()
    .trim()
    .nonempty('رقم الهاتف مطلوب')
    .regex(/^\d{10}$/, 'رقم الهاتف يجب أن يحتوي على 10 أرقام فقط'),

  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),


});

export type AdminFormData = z.infer<typeof AdminSchema>; 