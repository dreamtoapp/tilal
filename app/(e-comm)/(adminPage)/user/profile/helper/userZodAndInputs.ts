// helpers/userZodAndInputs.ts
import {
  FieldErrors,
  UseFormRegister,
  UseFormRegisterReturn,
} from 'react-hook-form';
import { z } from 'zod';

// Validation schema
export const UserSchema = z.object({
  name: z.string().trim().nonempty('الاسم مطلوب'),
  email: z.string().trim().email('صيغة البريد الإلكتروني غير صحيحة').optional().or(z.literal('')),
  phone: z.string().trim().nonempty('رقم الهاتف مطلوب'),
  id: z.string(),
  image: z.string(),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

export type UserFormData = z.infer<typeof UserSchema>;

interface Field {
  name: keyof UserFormData;
  id?: string,
  image?: string,
  phone?: string,
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  maxLength?: number;
  error?: string;
  className?: string;
}

interface FieldSection {
  section: string;
  hint?: boolean; // Assuming this is a typo in the original code, should be 'false'
  fields: Field[];
}

export const getDriverFields = (
  register: UseFormRegister<UserFormData>,
  errors: FieldErrors<UserFormData>
): FieldSection[] => [
    {
      section: 'البيانات الشخصية',
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
          name: 'email',
          type: 'email',
          placeholder: 'البريد الإلكتروني',
          register: register('email'),
          error: errors.email?.message,
        },
        {
          name: 'password',
          type: 'text',
          placeholder: 'كلمة المرور',
          register: register('password'),
          error: errors.password?.message,
        },
      ],
    },
  ];
