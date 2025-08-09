import { UseFormReturn } from 'react-hook-form';
import { CustomerFormData } from './customerSchema';

interface Field {
  name: string;
  type: string;
  placeholder: string;
  register: any;
  error?: string;
  className?: string;
  options?: Array<{ value: string; label: string }>;
}

interface FieldSection {
  section: string;
  hint?: boolean;
  fields: Field[];
}

export function getCustomerFields(
  register: UseFormReturn<CustomerFormData>['register'],
  errors: UseFormReturn<CustomerFormData>['formState']['errors']
): FieldSection[] {
  return [
    {
      section: 'البيانات الشخصية',
      hint: false,
      fields: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'اسم العميل',
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
          error: errors.phone?.message,
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'كلمة المرور',
          register: register('password'),
          error: errors.password?.message,
        },
      ],
    },
  ];
} 