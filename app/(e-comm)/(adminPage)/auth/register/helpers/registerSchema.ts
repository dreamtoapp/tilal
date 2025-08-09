import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string({ required_error: 'يرجى إدخال الاسم الكامل' })
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  phone: z
    .string({ required_error: 'يرجى إدخال رقم الجوال' })
    .regex(/^05[0-9]{8}$/, 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام'),
  password: z
    .string({ required_error: 'يرجى إدخال كلمة المرور' })
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z
    .string({ required_error: 'يرجى تأكيد كلمة المرور' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

export type RegisterSchemaType = z.infer<typeof registerSchema>; 