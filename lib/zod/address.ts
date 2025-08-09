import { z } from 'zod';

// Coordinate validation helper
const coordinateSchema = z.string().refine(
  (val) => {
    if (!val) return true; // Optional field
    const num = parseFloat(val);
    return !isNaN(num);
  },
  { message: 'إحداثيات غير صحيحة' }
);

export const addressSchema = z.object({
  label: z.string().min(1, 'اسم العنوان مطلوب').default('المنزل'),
  district: z.string().min(2, 'الحي مطلوب'),
  street: z.string().min(5, 'الشارع مطلوب'),
  buildingNumber: z.string().min(1, 'رقم المبنى مطلوب'),
  floor: z.string().optional(),
  apartmentNumber: z.string().optional(),
  landmark: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  // 🗺️ Coordinates for driver navigation
  latitude: coordinateSchema.optional(),
  longitude: coordinateSchema.optional(),
  isDefault: z.boolean().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>; 