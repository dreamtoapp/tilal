import { z } from 'zod';

export const marketerSchema = z.object({
  name: z.string().trim().nonempty('الاسم مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional(),
  phone: z
    .string()
    .trim()
    .nonempty('رقم الهاتف مطلوب')
    .regex(/^\d{10}$/, 'رقم الهاتف يجب أن يحتوي على 10 أرقام فقط'),
  // Address fields - using Address Book system
  addressLabel: z.string().trim().nonempty('نوع العنوان مطلوب'),
  district: z.string().trim().nonempty('الحي مطلوب'),
  street: z.string().trim().nonempty('الشارع مطلوب'),
  buildingNumber: z.string().trim().nonempty('رقم المبنى مطلوب'),
  floor: z.string().optional(),
  apartmentNumber: z.string().optional(),
  landmark: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  sharedLocationLink: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  // Marketer-specific fields
  marketerLevel: z.enum(['JUNIOR', 'SENIOR', 'LEAD', 'MANAGER']),
  specialization: z.string().trim().optional(),
  targetAudience: z.string().trim().optional(),
  commissionRate: z.number().min(0).max(100),
  performanceRating: z.number().min(0).max(5),
  marketerStatus: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
});

export type MarketerFormData = z.infer<typeof marketerSchema>; 