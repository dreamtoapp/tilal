import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AddImage from '@/components/AddImage';

const aboutSchema = z.object({
    heroTitle: z.string().min(2, 'العنوان الرئيسي مطلوب'),
    heroSubtitle: z.string().min(2, 'الوصف الرئيسي مطلوب'),
    heroImageUrl: z.string().url('رابط الصورة غير صالح'),
    missionTitle: z.string().min(2, 'عنوان الرسالة مطلوب'),
    missionText: z.string().min(2, 'نص الرسالة مطلوب'),
    ctaTitle: z.string().min(2, 'عنوان الدعوة مطلوب'),
    ctaText: z.string().min(2, 'نص الدعوة مطلوب'),
    ctaButtonText: z.string().min(2, 'نص زر الدعوة مطلوب'),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

export type AboutFormDefaultValues = Partial<AboutFormValues> & { id?: string };

export default function AboutForm({ defaultValues, onSubmit, onCancel }: {
    defaultValues?: AboutFormDefaultValues;
    onSubmit: (values: AboutFormValues) => void;
    onCancel?: () => void;
}) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<AboutFormValues>({
        resolver: zodResolver(aboutSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
            {/* Hero Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2 text-right">قسم الهيرو</h3>

                <div className="space-y-4">
                    <div className="text-right">
                        <Label htmlFor="heroTitle" className="text-sm font-medium text-right block">العنوان الرئيسي</Label>
                        <Input
                            id="heroTitle"
                            {...register('heroTitle')}
                            className="mt-1 text-right"
                            placeholder="أدخل العنوان الرئيسي"
                            dir="rtl"
                        />
                        {errors.heroTitle && (
                            <p className="text-destructive text-sm mt-1 text-right">{errors.heroTitle.message}</p>
                        )}
                    </div>

                    <div className="text-right">
                        <Label htmlFor="heroSubtitle" className="text-sm font-medium text-right block">الوصف الرئيسي</Label>
                        <Textarea
                            id="heroSubtitle"
                            {...register('heroSubtitle')}
                            className="mt-1 min-h-[100px] text-right"
                            placeholder="أدخل الوصف الرئيسي"
                            dir="rtl"
                        />
                        {errors.heroSubtitle && (
                            <p className="text-destructive text-sm mt-1 text-right">{errors.heroSubtitle.message}</p>
                        )}
                    </div>

                    <div className="text-right">
                        <Label htmlFor="heroImageUrl" className="text-sm font-medium text-right block">صورة الهيرو</Label>
                        <div className="mt-1 w-48 h-32 border rounded-md overflow-hidden">
                            <AddImage
                                url={watch('heroImageUrl')}
                                alt="صورة الهيرو"
                                recordId={defaultValues?.id || ''}
                                table="aboutPageContent"
                                tableField="heroImageUrl"
                                onUploadComplete={url => setValue('heroImageUrl', url, { shouldValidate: true })}
                                autoUpload
                            />
                        </div>
                        {errors.heroImageUrl && (
                            <p className="text-destructive text-sm mt-1 text-right">{errors.heroImageUrl.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2 text-right">قسم الرسالة</h3>

                <div className="space-y-4">
                    <div className="text-right">
                        <Label htmlFor="missionTitle" className="text-sm font-medium text-right block">عنوان الرسالة</Label>
                        <Input
                            id="missionTitle"
                            {...register('missionTitle')}
                            className="mt-1 text-right"
                            placeholder="أدخل عنوان الرسالة"
                            dir="rtl"
                        />
                        {errors.missionTitle && (
                            <p className="text-destructive text-sm mt-1 text-right">{errors.missionTitle.message}</p>
                        )}
                    </div>

                    <div className="text-right">
                        <Label htmlFor="missionText" className="text-sm font-medium text-right block">نص الرسالة</Label>
                        <Textarea
                            id="missionText"
                            {...register('missionText')}
                            className="mt-1 min-h-[100px] text-right"
                            placeholder="أدخل نص الرسالة"
                            dir="rtl"
                        />
                        {errors.missionText && (
                            <p className="text-destructive text-sm mt-1 text-right">{errors.missionText.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2 text-right">قسم الدعوة للعمل</h3>

                <div className="space-y-4">
                    <div className="text-right">
                        <Label htmlFor="ctaTitle" className="text-sm font-medium text-right block">عنوان الدعوة</Label>
                        <Input
                            id="ctaTitle"
                            {...register('ctaTitle')}
                            className="mt-1 text-right"
                            placeholder="أدخل عنوان الدعوة"
                            dir="rtl"
                        />
                        {errors.ctaTitle && (
                            <p className="text-destructive text-sm mt-1 text-right">{errors.ctaTitle.message}</p>
                        )}
                    </div>

                    <div className="text-right">
                        <Label htmlFor="ctaText" className="text-sm font-medium text-right block">نص الدعوة</Label>
                        <Textarea
                            id="ctaText"
                            {...register('ctaText')}
                            className="mt-1 min-h-[100px] text-right"
                            placeholder="أدخل نص الدعوة"
                            dir="rtl"
                        />
                        {errors.ctaText && (
                            <p className="text-destructive text-sm mt-1 text-right">{errors.ctaText.message}</p>
                        )}
                    </div>

                    <div className="text-right">
                        <Label htmlFor="ctaButtonText" className="text-sm font-medium text-right block">نص زر الدعوة</Label>
                        <Input
                            id="ctaButtonText"
                            {...register('ctaButtonText')}
                            className="mt-1 text-right"
                            placeholder="أدخل نص زر الدعوة"
                            dir="rtl"
                        />
                        {errors.ctaButtonText && (
                            <p className="text-destructive text-sm mt-1 text-right">{errors.ctaButtonText.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t justify-end">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                    >
                        إلغاء
                    </Button>
                )}
            </div>
        </form>
    );
} 