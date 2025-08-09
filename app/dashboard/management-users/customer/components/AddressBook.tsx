'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import GoogleMapsLink from '@/components/GoogleMapsLink';
import AppDialog from '@/components/app-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { extractCoordinatesFromUrl, isValidSharedLocationLink } from '@/utils/extract-latAndLog-fromWhatsAppLink';

type Address = {
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
};

type AddressBookProps = {
    addresses: Address[];
    onAddressUpdate: () => void;
};

// Address validation schema
const AddressSchema = z.object({
    label: z.string().min(1, 'نوع العنوان مطلوب'),
    district: z.string().min(2, 'الحي مطلوب'),
    street: z.string().min(5, 'الشارع مطلوب'),
    buildingNumber: z.string().min(1, 'رقم المبنى مطلوب'),
    floor: z.string().optional(),
    apartmentNumber: z.string().optional(),
    landmark: z.string().optional(),
    deliveryInstructions: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
});

type AddressFormData = z.infer<typeof AddressSchema>;

export default function AddressBook({ addresses, onAddressUpdate }: AddressBookProps) {
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [locationLink, setLocationLink] = useState('');
    const [isExtracting, setIsExtracting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<AddressFormData>({
        resolver: zodResolver(AddressSchema),
    });

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setValue('label', address.label);
        setValue('district', address.district);
        setValue('street', address.street);
        setValue('buildingNumber', address.buildingNumber);
        setValue('floor', address.floor || '');
        setValue('apartmentNumber', address.apartmentNumber || '');
        setValue('landmark', address.landmark || '');
        setValue('deliveryInstructions', address.deliveryInstructions || '');
        setValue('latitude', address.latitude || '');
        setValue('longitude', address.longitude || '');
    };

    const handleDelete = async (addressId: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا العنوان؟')) return;

        try {
            const response = await fetch(`/api/admin/customer-addresses/${addressId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Address delete error:', errorData);
                toast.error('فشل في حذف العنوان');
                return;
            }

            toast.success('تم حذف العنوان بنجاح');
            onAddressUpdate();
        } catch (error) {
            console.error('Address delete error:', error);
            toast.error('فشل في حذف العنوان');
        }
    };

    const handleExtractCoordinates = async () => {
        if (!locationLink.trim()) {
            toast.error('يرجى إدخال رابط الموقع');
            return;
        }

        setIsExtracting(true);
        try {
            if (!isValidSharedLocationLink(locationLink)) {
                toast.error('الرابط غير صالح. يرجى لصق رابط صحيح من Google Maps أو واتساب');
                return;
            }

            const coords = extractCoordinatesFromUrl(locationLink);
            if (!coords) {
                toast.error('تعذر استخراج الإحداثيات من الرابط. تأكد من صحة الرابط');
                return;
            }

            setValue('latitude', coords.lat.toString());
            setValue('longitude', coords.lng.toString());
            setLocationLink('');
            toast.success(`تم استخراج الإحداثيات بنجاح: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        } catch (error) {
            toast.error('حدث خطأ في معالجة الرابط');
        } finally {
            setIsExtracting(false);
        }
    };

    const onSubmit = async (data: AddressFormData) => {
        if (!editingAddress) return;

        setIsSubmitting(true);
        try {
            // Prepare the data with proper null handling
            const requestData = {
                label: data.label,
                district: data.district,
                street: data.street,
                buildingNumber: data.buildingNumber,
                floor: data.floor && data.floor.trim() ? data.floor : undefined,
                apartmentNumber: data.apartmentNumber && data.apartmentNumber.trim() ? data.apartmentNumber : undefined,
                landmark: data.landmark && data.landmark.trim() ? data.landmark : undefined,
                deliveryInstructions: data.deliveryInstructions && data.deliveryInstructions.trim() ? data.deliveryInstructions : undefined,
                latitude: data.latitude && data.latitude.trim() ? data.latitude : undefined,
                longitude: data.longitude && data.longitude.trim() ? data.longitude : undefined,
                isDefault: editingAddress.isDefault, // Preserve default status
            };

            console.log('Sending address data:', requestData);

            const response = await fetch(`/api/admin/customer-addresses/${editingAddress.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Address update error:', errorData);
                console.error('Response status:', response.status);
                console.error('Response headers:', Object.fromEntries(response.headers.entries()));
                toast.error(`فشل في تحديث العنوان: ${errorData.message || 'خطأ غير معروف'}`);
                return;
            }

            const result = await response.json();
            console.log('Address update success:', result);

            toast.success('تم تحديث العنوان بنجاح');
            setEditingAddress(null);
            reset();
            onAddressUpdate();
        } catch (error) {
            console.error('Address update error:', error);
            toast.error('فشل في تحديث العنوان');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='border-t border-border/50 pt-3'>
            <h4 className='text-sm font-semibold text-foreground mb-2 flex items-center gap-2'>
                <Icon name="MapPin" size="xs" className="text-primary w-3 h-3" />
                Addresses ({addresses.length})
            </h4>

            {addresses.length > 0 ? (
                <div className='space-y-2'>
                    {addresses.map((address) => (
                        <div key={address.id} className='p-3 rounded-lg bg-muted/10 border border-border/30'>
                            <div className='flex items-center justify-between mb-2'>
                                <div className='flex items-center gap-2'>
                                    <span className='text-xs font-medium text-primary'>{address.label}</span>
                                    {address.isDefault && (
                                        <Badge variant="outline" className="text-xs">Default</Badge>
                                    )}
                                </div>
                                <div className='flex items-center gap-1'>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEdit(address)}
                                        className="h-6 w-6 p-0 text-primary hover:text-primary/80"
                                    >
                                        <Icon name="Edit" size="xs" className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(address.id)}
                                        className="h-6 w-6 p-0 text-destructive hover:text-destructive/80"
                                    >
                                        <Icon name="Trash2" size="xs" className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>

                            <p className='text-xs text-muted-foreground mb-2'>
                                {address.district}, {address.street}, مبنى {address.buildingNumber}
                                {address.apartmentNumber && `، شقة ${address.apartmentNumber}`}
                                {address.floor && `، طابق ${address.floor}`}
                                {address.landmark && `، معلم: ${address.landmark}`}
                            </p>

                            {address.deliveryInstructions && (
                                <p className='text-xs text-muted-foreground mb-2'>
                                    تعليمات: {address.deliveryInstructions}
                                </p>
                            )}

                            {/* Google Maps Link - Show only when coordinates are available */}
                            {address.latitude && address.longitude ? (
                                <GoogleMapsLink
                                    latitude={address.latitude}
                                    longitude={address.longitude}
                                    label="عرض على الخريطة"
                                    variant="ghost"
                                    size="sm"
                                    className="text-primary hover:text-primary/80 hover:bg-primary/10 text-xs"
                                />
                            ) : (
                                <div className="text-xs text-amber-600 flex items-center gap-1">
                                    <Icon name="MapPin" size="xs" className="w-3 h-3" />
                                    لا توجد إحداثيات متاحة
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className='p-3 rounded-lg bg-muted/10 border border-border/30'>
                    <p className='text-xs text-muted-foreground text-center'>No Address Available</p>
                </div>
            )}

            {/* Edit Address Dialog */}
            {editingAddress && (
                <AppDialog
                    mode="update"
                    open={!!editingAddress}
                    onOpenChange={() => setEditingAddress(null)}
                    title="تعديل العنوان"
                    description="يرجى تحديث بيانات العنوان"
                    footer={
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setEditingAddress(null)}
                                disabled={isSubmitting}
                            >
                                إلغاء
                            </Button>
                            <Button
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
                            </Button>
                        </div>
                    }
                >
                    <form className="space-y-4">
                        {/* Address Type */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">نوع العنوان</label>
                            <Select
                                onValueChange={(value) => setValue('label', value)}
                                defaultValue={editingAddress.label}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر نوع العنوان" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="المنزل">المنزل</SelectItem>
                                    <SelectItem value="العمل">العمل</SelectItem>
                                    <SelectItem value="أخرى">أخرى</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Main Address Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">الحي</label>
                                <Input
                                    {...register('district')}
                                    placeholder="اسم الحي"
                                    defaultValue={editingAddress.district}
                                />
                                {errors.district && <p className="text-xs text-destructive">{errors.district.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">الشارع</label>
                                <Input
                                    {...register('street')}
                                    placeholder="اسم الشارع"
                                    defaultValue={editingAddress.street}
                                />
                                {errors.street && <p className="text-xs text-destructive">{errors.street.message}</p>}
                            </div>
                        </div>

                        {/* Building Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">رقم المبنى</label>
                                <Input
                                    {...register('buildingNumber')}
                                    placeholder="رقم المبنى"
                                    defaultValue={editingAddress.buildingNumber}
                                />
                                {errors.buildingNumber && <p className="text-xs text-destructive">{errors.buildingNumber.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">الطابق</label>
                                <Input
                                    {...register('floor')}
                                    placeholder="اختياري"
                                    defaultValue={editingAddress.floor || ''}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">رقم الشقة</label>
                                <Input
                                    {...register('apartmentNumber')}
                                    placeholder="اختياري"
                                    defaultValue={editingAddress.apartmentNumber || ''}
                                />
                            </div>
                        </div>

                        {/* Optional Fields */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">معلم قريب</label>
                                <Input
                                    {...register('landmark')}
                                    placeholder="معلم قريب للمساعدة في تحديد الموقع"
                                    defaultValue={editingAddress.landmark || ''}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">تعليمات التوصيل</label>
                                <Textarea
                                    {...register('deliveryInstructions')}
                                    placeholder="تعليمات خاصة للتوصيل (اختياري)"
                                    defaultValue={editingAddress.deliveryInstructions || ''}
                                    rows={2}
                                />
                            </div>
                        </div>

                        {/* Coordinates */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">استخراج الإحداثيات من رابط</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="ألصق رابط الموقع من واتساب أو Google Maps"
                                        value={locationLink}
                                        onChange={(e) => setLocationLink(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleExtractCoordinates}
                                        disabled={isExtracting || !locationLink.trim()}
                                        className="whitespace-nowrap"
                                    >
                                        {isExtracting ? (
                                            <div className="animate-spin mr-2 h-4 w-4 border border-current border-t-transparent rounded-full"></div>
                                        ) : (
                                            <Icon name="MapPin" size="xs" className="mr-2" />
                                        )}
                                        {isExtracting ? 'جارٍ الاستخراج...' : 'استخراج'}
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">خط العرض (Latitude)</label>
                                    <Input
                                        {...register('latitude')}
                                        placeholder="مثال: 24.7136"
                                        defaultValue={editingAddress.latitude || ''}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">خط الطول (Longitude)</label>
                                    <Input
                                        {...register('longitude')}
                                        placeholder="مثال: 46.6753"
                                        defaultValue={editingAddress.longitude || ''}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </AppDialog>
            )}
        </div>
    );
} 