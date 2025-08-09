import { FieldErrors, UseFormRegister, UseFormRegisterReturn } from 'react-hook-form';
import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'اسم المنتج مطلوب'),
  description: z.string().min(1, 'الوصف مطلوب'),
  price: z.coerce.number().min(0.01, 'السعر مطلوب ويجب أن يكون أكبر من صفر'),
  // imageUrl (main image) & images (gallery) - handled in main products page later
  supplierId: z.string().min(1, 'المورد مطلوب'),
  categoryIds: z.array(z.string()).min(1, 'اختر صنف واحد على الأقل').default([]).optional(),
  features: z.array(z.string()).default([]).optional(),
  requiresShipping: z.boolean().default(true).optional(),
  hasQualityGuarantee: z.boolean().default(true).optional(),
  published: z.boolean().default(false).optional(),
  outOfStock: z.boolean().default(false).optional(),
  manageInventory: z.boolean().default(true).optional(),
  tags: z.array(z.string()).default([]).optional(),
  // ... add other fields as needed
});

export type ProductFormData = z.infer<typeof ProductSchema>;

interface Field {
  name: keyof ProductFormData;
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  maxLength?: number;
  error?: string;
  className?: string;
}

interface FieldSection {
  section: string;
  fields: Field[];
}

export function getProductFields(
  register: UseFormRegister<ProductFormData>,
  errors: FieldErrors<ProductFormData>
): FieldSection[] {
  return [
    {
      section: 'بيانات المنتج',
      fields: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'اسم المنتج',
          register: register('name'),
          error: errors.name?.message,
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'الوصف',
          register: register('description'),
          error: errors.description?.message,
        },
        {
          name: 'price',
          type: 'number',
          placeholder: 'السعر',
          register: register('price', { valueAsNumber: true }),
          error: errors.price?.message,
        },
        // imageUrl (main image) & images (gallery) - handled in main products page later
        {
          name: 'supplierId',
          type: 'select',
          placeholder: 'اختر المورد',
          register: register('supplierId'),
          error: errors.supplierId?.message,
        },
        {
          name: 'categoryIds',
          type: 'select-multi',
          placeholder: 'اختر الأصناف',
          register: register('categoryIds'),
          error: errors.categoryIds?.message,
        },
        // features: handled as dynamic array in the component
        {
          name: 'requiresShipping',
          type: 'checkbox',
          placeholder: 'يتطلب شحن',
          register: register('requiresShipping'),
          error: errors.requiresShipping?.message,
        },
        {
          name: 'hasQualityGuarantee',
          type: 'checkbox',
          placeholder: 'ضمان جودة',
          register: register('hasQualityGuarantee'),
          error: errors.hasQualityGuarantee?.message,
        },
        {
          name: 'published',
          type: 'checkbox',
          placeholder: 'منشور',
          register: register('published'),
          error: errors.published?.message,
        },
        {
          name: 'outOfStock',
          type: 'checkbox',
          placeholder: 'نفد المخزون',
          register: register('outOfStock'),
          error: errors.outOfStock?.message,
        },
        {
          name: 'manageInventory',
          type: 'checkbox',
          placeholder: 'تتبع المخزون',
          register: register('manageInventory'),
          error: errors.manageInventory?.message,
        },
        // tags: handled as dynamic array in the component
      ],
    },
  ];
} 