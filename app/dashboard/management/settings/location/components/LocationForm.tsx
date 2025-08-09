"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2, MapPin } from "lucide-react";
import { saveCompany } from "../../actions/saveCompnay";
import { z } from "zod";

// Zod schema for location only
const LocationSchema = z.object({
    id: z.string().optional(),
    address: z.string().min(5, 'العنوان مطلوب'),
    latitude: z.string().regex(
        /^-?([0-8]?[0-9](\.\d+)?|90(\.0+)?)$/,
        'خط العرض غير صالح'
    ),
    longitude: z.string().regex(
        /^-?((1[0-7][0-9]|[0-9]?[0-9])(\.\d+)?|180(\.0+)?)$/,
        'خط الطول غير صالح'
    ),
});

type LocationFormData = z.infer<typeof LocationSchema>;

interface LocationFormProps {
    company?: any;
}

export default function LocationForm({ company }: LocationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(
        !!(company?.address && company?.latitude && company?.longitude)
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
        watch,
    } = useForm<LocationFormData>({
        resolver: zodResolver(LocationSchema),
        defaultValues: {
            id: company?.id || '',
            address: company?.address || '',
            latitude: company?.latitude || '',
            longitude: company?.longitude || '',
        },
    });

    const watchedValues = watch();
    const isFormComplete = !!(watchedValues.address && watchedValues.latitude && watchedValues.longitude);

    const onSubmit = async (data: LocationFormData) => {
        setIsSubmitting(true);
        try {
            // Merge with existing company data to preserve other fields
            const updatedData = {
                ...company,
                ...data,
            };

            await saveCompany(updatedData);
            setIsComplete(true);
            toast.success("تم حفظ معلومات الموقع بنجاح ✅");
            reset(data); // Reset form with new values
        } catch (error) {
            console.error("❌ Failed to save location:", error);
            toast.error("حدث خطأ أثناء الحفظ، الرجاء المحاولة مرة أخرى.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6" dir="rtl">
            {/* Completion Status */}
            {isComplete && (
                <Alert className="border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                        تم إكمال معلومات الموقع بنجاح
                    </AlertDescription>
                </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Address */}
                <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-right block">
                        العنوان الفعلي *
                    </Label>
                    <Input
                        id="address"
                        type="text"
                        placeholder="أدخل العنوان الكامل"
                        {...register('address')}
                        className="text-right"
                        dir="rtl"
                    />
                    {errors.address && (
                        <div className="flex items-center gap-2 text-xs text-destructive">
                            <AlertCircle className="w-3 h-3" />
                            {errors.address.message}
                        </div>
                    )}
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="latitude" className="text-sm font-medium text-right block">
                            خط العرض *
                        </Label>
                        <Input
                            id="latitude"
                            type="text"
                            placeholder="مثال: 24.7136"
                            {...register('latitude')}
                            className="text-right"
                            dir="rtl"
                        />
                        {errors.latitude && (
                            <div className="flex items-center gap-2 text-xs text-destructive">
                                <AlertCircle className="w-3 h-3" />
                                {errors.latitude.message}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="longitude" className="text-sm font-medium text-right block">
                            خط الطول *
                        </Label>
                        <Input
                            id="longitude"
                            type="text"
                            placeholder="مثال: 46.6753"
                            {...register('longitude')}
                            className="text-right"
                            dir="rtl"
                        />
                        {errors.longitude && (
                            <div className="flex items-center gap-2 text-xs text-destructive">
                                <AlertCircle className="w-3 h-3" />
                                {errors.longitude.message}
                            </div>
                        )}
                    </div>
                </div>

                {/* Help Text */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">كيفية الحصول على الإحداثيات:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>افتح Google Maps</li>
                                <li>ابحث عن موقعك</li>
                                <li>انقر بزر الماوس الأيمن على الموقع</li>
                                <li>انسخ الإحداثيات التي تظهر</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6 border-t justify-end">
                    <Button
                        type="submit"
                        disabled={isSubmitting || !isDirty}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                جاري الحفظ...
                            </>
                        ) : (
                            'حفظ الموقع'
                        )}
                    </Button>
                </div>
            </form>

            {/* Progress Indicator */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">الحقول المطلوبة</span>
                    <span className="text-sm text-muted-foreground">
                        {isFormComplete ? 'مكتمل' : 'غير مكتمل'}
                    </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-300 ${isFormComplete ? 'bg-green-500' : 'bg-muted-foreground'
                            }`}
                        style={{ width: `${isFormComplete ? 100 : 0}%` }}
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    الحقول المطلوبة: العنوان، خط العرض، خط الطول
                </p>
            </div>
        </div>
    );
} 