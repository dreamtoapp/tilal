'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormError from '@/components/form-error';
import { createAddress, updateAddress } from '../actions/addressActions';
import { getAddressFromLatLng } from '@/lib/getAddressFromLatLng';
import InfoTooltip from '@/components/InfoTooltip';

// Address validation schema
const AddressSchema = z.object({
    label: z.string().min(1, 'نوع العنوان مطلوب'),
    district: z.string().min(1, 'الحي مطلوب'),
    street: z.string().min(1, 'الشارع مطلوب'),
    buildingNumber: z.string().min(1, 'رقم المبنى مطلوب'),
    floor: z.string().optional(),
    apartmentNumber: z.string().optional(),
    landmark: z.string().optional(),
    deliveryInstructions: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
});

type AddressFormData = z.infer<typeof AddressSchema>;

interface Address {
    id: string;
    label: string;
    district: string;
    street: string;
    buildingNumber: string;
    floor?: string | null;
    apartmentNumber?: string | null;
    landmark?: string | null;
    deliveryInstructions?: string | null;
    latitude?: string | null;
    longitude?: string | null;
    isDefault: boolean;
}

interface AddressFormProps {
    userId: string;
    address?: Address | null;
    onSubmit: () => void;
    onCancel: () => void;
}

const addressLabels = [
    { value: 'المنزل', label: 'المنزل' },
    { value: 'العمل', label: 'العمل' },
    { value: 'أخرى', label: 'أخرى' },
];

export default function AddressForm({ userId, address, onSubmit, onCancel }: AddressFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<AddressFormData>({
        resolver: zodResolver(AddressSchema),
        defaultValues: {
            label: address?.label || 'المنزل',
            district: address?.district || '',
            street: address?.street || '',
            buildingNumber: address?.buildingNumber || '',
            floor: address?.floor || '',
            apartmentNumber: address?.apartmentNumber || '',
            landmark: address?.landmark || '',
            deliveryInstructions: address?.deliveryInstructions || '',
            latitude: address?.latitude || '',
            longitude: address?.longitude || '',
        },
    });

    const handleFormSubmit = async (data: AddressFormData) => {
        try {
            setIsSubmitting(true);

            if (address) {
                // Update existing address
                const result = await updateAddress(address.id, data);
                if (result.success) {
                    toast.success('تم تحديث العنوان بنجاح');
                    onSubmit();
                } else {
                    toast.error(result.message || 'فشل في تحديث العنوان');
                }
            } else {
                // Create new address
                const result = await createAddress(userId, data);
                if (result.success) {
                    toast.success('تم إضافة العنوان بنجاح');
                    onSubmit();
                } else {
                    toast.error(result.message || 'فشل في إضافة العنوان');
                }
            }
        } catch (error) {
            console.error('Error submitting address:', error);
            toast.error('حدث خطأ أثناء حفظ العنوان');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDetectLocation = async () => {
        setLoading(true);
        if (!navigator.geolocation) {
            toast.error('المتصفح لا يدعم تحديد الموقع الجغرافي.');
            setLoading(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                const address = await getAddressFromLatLng(latitude, longitude);
                setLoading(false);
                if (address && address.address) {
                    setValue('district', address.address.suburb || address.address.neighbourhood || address.address.city_district || address.address.city || '');
                    setValue('street', address.address.road || address.address.pedestrian || address.address.residential || '');
                    setValue('buildingNumber', address.address.house_number || '');
                    setValue('landmark', address.address.landmark || address.address.attraction || address.address.public_building || '');
                    setValue('latitude', address.lat || '');
                    setValue('longitude', address.lon || '');
                    toast.success('تم جلب العنوان بنجاح! يمكنك التعديل قبل الحفظ.');
                } else {
                    toast.error('تعذر جلب العنوان. حاول مرة أخرى.');
                }
            },
            () => {
                toast.error('تعذر تحديد الموقع. يرجى السماح بالوصول للموقع.');
                setLoading(false);
            }
        );
    };

    return (
        <div className="max-h-[80vh] overflow-y-auto p-2 sm:p-4">
            <div className="mb-4">
                <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={handleDetectLocation}
                    disabled={loading}
                >
                    <MapPin className="h-4 w-4" />
                    {loading ? 'جاري تحديد الموقع...' : 'تحديد موقعي تلقائياً'}
                </Button>
            </div>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                {/* Address Label */}
                <div className="space-y-2">
                    <Label htmlFor="label">نوع العنوان</Label>
                    <Select
                        value={watch('label')}
                        onValueChange={(value) => setValue('label', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="اختر نوع العنوان" />
                        </SelectTrigger>
                        <SelectContent>
                            {addressLabels.map((label) => (
                                <SelectItem key={label.value} value={label.value}>
                                    {label.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormError message={errors.label?.message} />
                </div>

                {/* District and Street */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="district">الحي</Label>
                        <div className="relative">
                            <Input
                                {...register('district')}
                                placeholder="اسم الحي"
                                className="focus:border-feature-suppliers pr-8"
                            />
                            {watch('district') === '' && (
                                <span className="absolute inset-y-0 left-2 flex items-center">
                                    <InfoTooltip
                                        content="يرجى إدخال هذا الحقل يدويًا لضمان دقة التوصيل."
                                        iconSize={16}
                                        iconClassName="text-info icon-enhanced"
                                    />
                                </span>
                            )}
                        </div>
                        <FormError message={errors.district?.message} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="street">الشارع</Label>
                        <div className="relative">
                            <Input
                                {...register('street')}
                                placeholder="اسم الشارع"
                                className="focus:border-feature-suppliers pr-8"
                            />
                            {watch('street') === '' && (
                                <span className="absolute inset-y-0 left-2 flex items-center">
                                    <InfoTooltip
                                        content="يرجى إدخال هذا الحقل يدويًا لضمان دقة التوصيل."
                                        iconSize={16}
                                        iconClassName="text-info icon-enhanced"
                                    />
                                </span>
                            )}
                        </div>
                        <FormError message={errors.street?.message} />
                    </div>
                </div>

                {/* Building Number */}
                <div className="space-y-2">
                    <Label htmlFor="buildingNumber">رقم المبنى</Label>
                    <div className="relative">
                        <Input
                            {...register('buildingNumber')}
                            placeholder="رقم المبنى"
                            className="focus:border-feature-suppliers pr-8"
                        />
                        {watch('buildingNumber') === '' && (
                            <span className="absolute inset-y-0 left-2 flex items-center">
                                <InfoTooltip
                                    content="يرجى إدخال هذا الحقل يدويًا لضمان دقة التوصيل."
                                    iconSize={16}
                                    iconClassName="text-info icon-enhanced"
                                />
                            </span>
                        )}
                    </div>
                    <FormError message={errors.buildingNumber?.message} />
                </div>

                {/* Floor and Apartment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="floor">الطابق (اختياري)</Label>
                        <Input
                            {...register('floor')}
                            placeholder="رقم الطابق"
                            className="focus:border-feature-suppliers"
                        />
                        <FormError message={errors.floor?.message} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="apartmentNumber">رقم الشقة (اختياري)</Label>
                        <Input
                            {...register('apartmentNumber')}
                            placeholder="رقم الشقة"
                            className="focus:border-feature-suppliers"
                        />
                        <FormError message={errors.apartmentNumber?.message} />
                    </div>
                </div>

                {/* Landmark */}
                <div className="space-y-2">
                    <Label htmlFor="landmark">معلم قريب (اختياري)</Label>
                    <Input
                        {...register('landmark')}
                        placeholder="مثال: قرب مسجد، مقابل بنك، إلخ"
                        className="focus:border-feature-suppliers"
                    />
                    <FormError message={errors.landmark?.message} />
                </div>

                {/* Delivery Instructions */}
                <div className="space-y-2">
                    <Label htmlFor="deliveryInstructions">تعليمات التوصيل (اختياري)</Label>
                    <Textarea
                        {...register('deliveryInstructions')}
                        placeholder="أي تعليمات إضافية للموصل"
                        className="focus:border-feature-suppliers"
                        rows={3}
                    />
                    <FormError message={errors.deliveryInstructions?.message} />
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="latitude">خط العرض (اختياري)</Label>
                        <Input
                            {...register('latitude')}
                            placeholder="24.7136"
                            className="focus:border-feature-suppliers"
                        />
                        <FormError message={errors.latitude?.message} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="longitude">خط الطول (اختياري)</Label>
                        <Input
                            {...register('longitude')}
                            placeholder="46.6753"
                            className="focus:border-feature-suppliers"
                        />
                        <FormError message={errors.longitude?.message} />
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1 btn-cancel-outline"
                        disabled={isSubmitting}
                    >
                        إلغاء
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 btn-save"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                جاري الحفظ...
                            </>
                        ) : (
                            <>
                                <MapPin className="h-4 w-4 ml-2" />
                                {address ? 'تحديث العنوان' : 'إضافة العنوان'}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
} 