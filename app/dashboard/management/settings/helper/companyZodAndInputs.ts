import { ReactNode } from 'react';

import {
  FieldErrors,
  UseFormRegister,
  UseFormRegisterReturn,
} from 'react-hook-form';
// helpers/companyZodAndInputs.ts
import { z } from 'zod';

// ✅ Zod Schema
export const CompanySchema = z.object({
  id: z.string().trim().nonempty('الاسم الكامل مطلوب').optional(),
  fullName: z.string().trim().nonempty('الاسم الكامل مطلوب').optional(),
  email: z.string().trim().email('صيغة البريد الإلكتروني غير صحيحة').optional(),
  phoneNumber: z.string().trim().nonempty('رقم الهاتف مطلوب').optional(),
  whatsappNumber: z.string().trim().nonempty('رقم الواتساب مطلوب').optional(),
  logo: z.string().url('رابط الشعار غير صالح').optional().or(z.literal('')),
  profilePicture: z.string().url('رابط الصورة غير صالح').optional().or(z.literal('')),
  bio: z.string().trim().optional().or(z.literal('')),
  taxNumber: z.string().trim().optional().or(z.literal('')),
  taxQrImage: z.string().url('رابط QR غير صالح').optional().or(z.literal('')),
  twitter: z.string().url('رابط تويتر غير صالح').optional().or(z.literal('')),
  linkedin: z.string().url('رابط لينكدإن غير صالح').optional().or(z.literal('')),
  instagram: z.string().url('رابط انستغرام غير صالح').optional().or(z.literal('')),
  tiktok: z.string().url('رابط تيك توك غير صالح').optional().or(z.literal('')),
  facebook: z.string().url('رابط فيسبوك غير صالح').optional().or(z.literal('')),
  snapchat: z.string().url('رابط سناب شات غير صالح').optional().or(z.literal('')),
  website: z.string().url('رابط الموقع غير صالح').optional().or(z.literal('')),
  address: z.string().trim().nonempty('العنوان مطلوب').optional(),
  latitude: z.string().regex(
    /^-?([0-8]?[0-9](\.\d+)?|90(\.0+)?)$/,
    'خط العرض غير صالح'
  ).optional().or(z.literal('')).nullable(),

  longitude: z.string().regex(
    /^-?((1[0-7][0-9]|[0-9]?[0-9])(\.\d+)?|180(\.0+)?)$/,
    'خط الطول غير صالح'
  ).optional().or(z.literal('')).nullable(),

  // Platform Settings
  workingHours: z.string().trim().optional().or(z.literal('')),
  shippingFee: z.number().min(0, 'رسوم التوصيل يجب أن تكون 0 أو أكثر').optional(),
  minShipping: z.number().min(0, 'حد التوصيل المجاني يجب أن يكون 0 أو أكثر').optional(),
  taxPercentage: z.number().min(0, 'نسبة الضريبة يجب أن تكون 0 أو أكثر').max(100, 'نسبة الضريبة يجب أن تكون 100 أو أقل').optional(),

});

export type CompanyFormData = z.infer<typeof CompanySchema>;

interface Field {
  name: keyof CompanyFormData;
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: string;
  className?: string;
  customContent?: boolean;
  fullWidith?: boolean;

}

interface FieldSection {
  section: string;
  hint?: boolean;
  fields: Field[];
  customContent?: ReactNode;
  hasImage?: boolean;
}

// ✅ Input Field Generator
export const getCompanyFields = (
  register: UseFormRegister<CompanyFormData>,
  errors: FieldErrors<CompanyFormData>
): FieldSection[] => [
    {
      section: 'البيانات الأساسية',
      fields: [
        { name: 'fullName', type: 'text', placeholder: 'الاسم الكامل', register: register('fullName'), error: errors.fullName?.message },

        { name: 'email', type: 'email', placeholder: 'البريد الإلكتروني', register: register('email'), error: errors.email?.message },

        { name: 'phoneNumber', type: 'tel', placeholder: 'رقم الهاتف', register: register('phoneNumber'), error: errors.phoneNumber?.message },

        { name: 'whatsappNumber', type: 'tel', placeholder: 'رقم الواتساب', register: register('whatsappNumber'), error: errors.whatsappNumber?.message },
        { name: 'bio', type: 'text', placeholder: 'نبذة عن الشركة (اختياري)', register: register('bio'), error: errors.bio?.message, className: 'col-span-2', fullWidith: true, },

        { name: 'address', type: 'text', placeholder: 'العنوان', register: register('address'), error: errors.address?.message, className: 'col-span-2', fullWidith: true },

      ]
    },
    {
      section: 'الوصف والموقع',
      hint: true,
      customContent: null, // سنضيفها من الخارج
      fields: [

        { name: 'latitude', type: 'text', placeholder: 'خط العرض', register: register('latitude'), error: errors.latitude?.message },
        { name: 'longitude', type: 'text', placeholder: 'خط الطول', register: register('longitude'), error: errors.longitude?.message },
      ]
    },
    {
      section: 'معلومات ضريبية',
      hint: true,
      hasImage: true,
      fields: [
        { name: 'taxNumber', type: 'text', placeholder: 'الرقم الضريبي', register: register('taxNumber'), error: errors.taxNumber?.message, customContent: true, },

      ]
    },
    {
      section: 'الروابط الاجتماعية',
      hint: true,
      fields: [
        { name: 'twitter', type: 'url', placeholder: 'رابط تويتر', register: register('twitter'), error: errors.twitter?.message },
        { name: 'linkedin', type: 'url', placeholder: 'رابط لينكدإن', register: register('linkedin'), error: errors.linkedin?.message },
        { name: 'instagram', type: 'url', placeholder: 'رابط انستغرام', register: register('instagram'), error: errors.instagram?.message },
        { name: 'tiktok', type: 'url', placeholder: 'رابط تيك توك', register: register('tiktok'), error: errors.tiktok?.message },
        { name: 'facebook', type: 'url', placeholder: 'رابط فيسبوك', register: register('facebook'), error: errors.facebook?.message },
        { name: 'snapchat', type: 'url', placeholder: 'رابط سناب شات', register: register('snapchat'), error: errors.snapchat?.message },

      ]
    },

  ];
