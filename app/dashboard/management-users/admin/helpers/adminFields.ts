import {
  FieldErrors,
  UseFormRegister,
  UseFormRegisterReturn,
} from 'react-hook-form';

import { AdminFormData } from './adminSchema';



interface Field {
  name: keyof AdminFormData;
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  maxLength?: number;
  error?: string;
  className?: string;
  options?: Array<{ value: string; label: string }>;
}

interface FieldSection {
  section: string;
  hint?: boolean;
  fields: Field[];
}

export const getAdminFields = (
  register: UseFormRegister<AdminFormData>,
  errors: FieldErrors<AdminFormData>
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
        name: 'phone',
        type: 'tel',
        placeholder: 'رقم الهاتف',
        register: register('phone'),
        maxLength: 10,
        error: errors.phone?.message,
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