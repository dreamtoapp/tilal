// categoryFields.ts
import {
  FieldErrors,
  UseFormRegister,
  UseFormRegisterReturn,
} from 'react-hook-form';
import { z } from 'zod';

// 🧩 Zod schema for category validation
export const CategorySchema = z.object({
  id: z.string().trim().optional(),
  name: z.string().trim().nonempty('الاسم مطلوب'),
  description: z.string().trim().optional(),
});

// 🧩 Inferred type from schema
export type CategoryFormData = z.infer<typeof CategorySchema>;

// 📦 Interface for individual form field
export interface Field {
  name: keyof CategoryFormData;
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  maxLength?: number;
  error?: string;
  className?: string;
}

// 📦 Interface for a group of fields
export interface FieldSection {
  section: string;
  hint?: boolean;
  fields: Field[];
}

// 🚀 Function to generate form field structure
export const getCategoryFields = (
  register: UseFormRegister<CategoryFormData>,
  errors: FieldErrors<CategoryFormData>
): FieldSection[] => [
    {
      section: 'بيانات التصنيف',
      hint: false,
      fields: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'الاسم',
          register: register('name'),
          error: errors.name?.message,
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'الوصف',
          register: register('description'),
          error: errors.description?.message,
          className: 'col-span-2',
        },
      ],
    },
  ];
