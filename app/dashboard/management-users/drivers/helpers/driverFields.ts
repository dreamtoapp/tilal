import { UseFormReturn } from 'react-hook-form';
import { DriverFormData } from './driverSchema';

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

export function getDriverFields(
  register: UseFormReturn<DriverFormData>['register'],
  errors: UseFormReturn<DriverFormData>['formState']['errors']
): FieldSection[] {
  return [
    {
      section: 'البيانات الشخصية',
      hint: false,
      fields: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'اسم السائق',
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
    {
      section: 'معلومات العنوان',
      hint: false,
      fields: [
        {
          name: 'addressLabel',
          type: 'select',
          placeholder: 'نوع العنوان',
          register: register('addressLabel'),
          error: errors.addressLabel?.message,
          options: [
            { value: 'المنزل', label: 'المنزل' },
            { value: 'العمل', label: 'العمل' },
            { value: 'أخرى', label: 'أخرى' },
          ],
        },
        {
          name: 'district',
          type: 'text',
          placeholder: 'الحي',
          register: register('district'),
          error: errors.district?.message,
        },
        {
          name: 'street',
          type: 'text',
          placeholder: 'الشارع',
          register: register('street'),
          error: errors.street?.message,
        },
        {
          name: 'buildingNumber',
          type: 'text',
          placeholder: 'رقم المبنى',
          register: register('buildingNumber'),
          error: errors.buildingNumber?.message,
        },
        {
          name: 'floor',
          type: 'text',
          placeholder: 'الطابق (اختياري)',
          register: register('floor'),
          error: errors.floor?.message,
        },
        {
          name: 'apartmentNumber',
          type: 'text',
          placeholder: 'رقم الشقة (اختياري)',
          register: register('apartmentNumber'),
          error: errors.apartmentNumber?.message,
        },
        {
          name: 'landmark',
          type: 'text',
          placeholder: 'معلم قريب (اختياري)',
          register: register('landmark'),
          error: errors.landmark?.message,
        },
        {
          name: 'deliveryInstructions',
          type: 'textarea',
          placeholder: 'تعليمات التوصيل (اختياري)',
          register: register('deliveryInstructions'),
          error: errors.deliveryInstructions?.message,
          className: "col-span-2",
        },
      ],
    },

    {
      section: 'معلومات المركبة',
      hint: false,
      fields: [
        {
          name: 'vehicleType',
          type: 'select',
          placeholder: 'نوع المركبة',
          register: register('vehicleType'),
          error: errors.vehicleType?.message,
          options: [
            { value: 'MOTORCYCLE', label: 'دراجة نارية' },
            { value: 'CAR', label: 'سيارة' },
            { value: 'VAN', label: 'فان' },
            { value: 'TRUCK', label: 'شاحنة صغيرة' },
            { value: 'BICYCLE', label: 'دراجة هوائية' },
          ],
        },
        {
          name: 'vehiclePlateNumber',
          type: 'text',
          placeholder: 'رقم اللوحة',
          register: register('vehiclePlateNumber'),
          error: errors.vehiclePlateNumber?.message,
        },
        {
          name: 'vehicleColor',
          type: 'text',
          placeholder: 'لون المركبة',
          register: register('vehicleColor'),
          error: errors.vehicleColor?.message,
        },
        {
          name: 'vehicleModel',
          type: 'text',
          placeholder: 'موديل المركبة',
          register: register('vehicleModel'),
          error: errors.vehicleModel?.message,
        },
        {
          name: 'driverLicenseNumber',
          type: 'text',
          placeholder: 'رقم رخصة القيادة',
          register: register('driverLicenseNumber'),
          error: errors.driverLicenseNumber?.message,
        },
        {
          name: 'experience',
          type: 'text',
          placeholder: 'سنوات الخبرة',
          register: register('experience'),
          error: errors.experience?.message,
        },
        {
          name: 'maxOrders',
          type: 'number',
          placeholder: 'الحد الأقصى للطلبات',
          register: register('maxOrders'),
          error: errors.maxOrders?.message,
        },

      ],
    },
  ];
} 