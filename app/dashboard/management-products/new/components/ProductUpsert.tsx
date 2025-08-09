// ProductUpsert.tsx - Add/Edit Product Form (inline, not modal)
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icon } from '@/components/icons/Icon';
import { toast } from 'sonner';
import { ProductFormData, ProductSchema } from '../helpers/productZodAndInputs';
import { useRouter } from 'next/navigation';
import { createProduct } from '../actions/create-product';
import { updateProduct } from '../actions/update-product';
import { Controller } from 'react-hook-form';

interface ProductUpsertProps {
    mode: 'new' | 'update';
    defaultValues?: Partial<ProductFormData>;
    categories: { id: string; name: string }[];
    suppliers: { id: string; name: string }[];
}

function getSafeDefaultValues(values?: Partial<ProductFormData>): ProductFormData {
    return {
        id: values?.id ?? '',
        name: values?.name ?? '',
        description: values?.description ?? '',
        price: values?.price ?? 0,
        // imageUrl (main image) & images (gallery) - handled in main products page later
        supplierId: values?.supplierId ?? '',
        categoryIds: values?.categoryIds ?? [],
        features: values?.features ?? [],
        requiresShipping: values?.requiresShipping ?? true,
        hasQualityGuarantee: values?.hasQualityGuarantee ?? true,
        published: values?.published ?? false,
        outOfStock: values?.outOfStock ?? false,
        manageInventory: values?.manageInventory ?? true,
        tags: values?.tags ?? [],
    };
}

export default function ProductUpsert({
    mode,
    defaultValues,
    categories,
    suppliers,
}: ProductUpsertProps) {
    // Always sanitize defaultValues at runtime
    const safeDefaults = getSafeDefaultValues(defaultValues);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset,
        watch,
        control,
    } = useForm<ProductFormData>({
        resolver: zodResolver(ProductSchema),
        mode: 'onChange',
        defaultValues: safeDefaults,
    });

    const selectedCategoryIds = watch('categoryIds') || [];
    const selectedSupplierId = watch('supplierId') || '';

    const showSuccessDialog = async (productName: string) => {
        const Swal = (await import('sweetalert2')).default;
        const result = await Swal.fire({
            title: '🎉 تم حفظ المنتج بنجاح!',
            html: `
                <div class="text-center space-y-4">
                    <div class="text-lg font-medium text-green-600">
                        تم إنشاء منتج "${productName}" بنجاح
                    </div>
                    <div class="text-sm text-gray-600">
                        ماذا تريد أن تفعل الآن؟
                    </div>
                </div>
            `,
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: '➕ إضافة منتج آخر',
            cancelButtonText: '📋 عرض جميع المنتجات',
            confirmButtonColor: '#16a34a', // Green for add another
            cancelButtonColor: '#7c3aed',  // Purple for view products
            reverseButtons: true,
            customClass: {
                popup: 'rounded-xl',
                title: 'text-xl font-bold',
                confirmButton: 'px-6 py-3 rounded-lg font-medium',
                cancelButton: 'px-6 py-3 rounded-lg font-medium'
            },
            backdrop: 'rgba(0,0,0,0.4)',
            allowEscapeKey: false,
            allowOutsideClick: false
        });

        return result.isConfirmed; // true = add another, false = view products
    };

    const onSubmit = async (formData: ProductFormData) => {
        try {
            let result;
            if (mode === 'new') {
                result = await createProduct({
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    supplierId: formData.supplierId,
                    categoryIds: formData.categoryIds ?? [],
                    published: formData.published ?? false,
                    outOfStock: formData.outOfStock ?? false,
                    requiresShipping: formData.requiresShipping ?? true,
                    hasQualityGuarantee: formData.hasQualityGuarantee ?? true,
                    manageInventory: formData.manageInventory ?? true,
                });
            } else {
                // updateProduct requires id to be a string
                result = await updateProduct({
                    id: formData.id || '',
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    supplierId: formData.supplierId,
                    categoryIds: formData.categoryIds ?? [],
                    published: formData.published ?? false,
                    outOfStock: formData.outOfStock ?? false,
                    requiresShipping: formData.requiresShipping ?? true,
                    hasQualityGuarantee: formData.hasQualityGuarantee ?? true,
                    manageInventory: formData.manageInventory ?? true,
                });
            }

            if (result.success) {
                if (mode === 'new') {
                    // Show interactive success dialog
                    const addAnother = await showSuccessDialog(formData.name);

                    if (addAnother) {
                        // User chose to add another product
                        // Reset only the basic product fields, keep supplier and categories selected
                        const currentSupplier = formData.supplierId;
                        const currentCategories = formData.categoryIds;
                        const currentSettings = {
                            requiresShipping: formData.requiresShipping,
                            hasQualityGuarantee: formData.hasQualityGuarantee,
                            manageInventory: formData.manageInventory,
                        };

                        // Reset the form but preserve common fields
                        reset({
                            id: '',
                            name: '',
                            description: '',
                            price: 0,
                            supplierId: currentSupplier, // Keep selected supplier
                            categoryIds: currentCategories, // Keep selected categories
                            features: [],
                            published: false,
                            outOfStock: false,
                            tags: [],
                            ...currentSettings, // Keep settings
                        });

                        // Focus on the name field for quick next entry
                        setTimeout(() => {
                            const nameInput = document.getElementById('name') as HTMLInputElement;
                            if (nameInput) {
                                nameInput.focus();
                                nameInput.select();
                            }
                        }, 100);
                    } else {
                        // User chose to view products
                        router.push('/dashboard/management-products');
                    }
                } else {
                    // For updates: show simple success toast and go back
                    toast.success(result.message || 'تم تحديث المنتج بنجاح');
                    router.push('/dashboard/management-products');
                }
            } else {
                toast.error(result.message || 'حدث خطأ يرجى المحاولة لاحقاً');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'فشل في إرسال البيانات، يرجى المحاولة لاحقاً';
            toast.error(errorMessage);
            console.error('فشل في إرسال البيانات:', err);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 space-y-8 animate-in fade-in-50 duration-700">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Product Information */}
                <Card className="shadow-lg border-l-4 border-l-feature-products card-hover-effect card-border-glow">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Icon name="Package" className="h-5 w-5 text-feature-products icon-enhanced" />
                            معلومات المنتج الأساسية
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 bg-feature-products-soft/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">اسم المنتج *</Label>
                                <Input
                                    {...register('name')}
                                    id="name"
                                    placeholder="أدخل اسم المنتج"
                                    disabled={isSubmitting}
                                    className="h-11 transition-all duration-200 focus:border-feature-products"
                                />
                                {errors.name && (
                                    <p className="text-destructive text-sm flex items-center gap-1 animate-in slide-in-from-left-2 duration-300">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-sm font-medium">السعر *</Label>
                                <Input
                                    {...register('price', { valueAsNumber: true })}
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    disabled={isSubmitting}
                                    className="h-11 transition-all duration-200 focus:border-feature-products"
                                />
                                {errors.price && (
                                    <p className="text-destructive text-sm animate-in slide-in-from-left-2 duration-300">{errors.price.message}</p>
                                )}
                            </div>

                            <div className="col-span-1 md:col-span-2 xl:col-span-3 space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium">وصف المنتج *</Label>
                                <Input
                                    {...register('description')}
                                    id="description"
                                    placeholder="أدخل وصف المنتج"
                                    disabled={isSubmitting}
                                    className="h-11 transition-all duration-200 focus:border-feature-products"
                                />
                                {errors.description && (
                                    <p className="text-destructive text-sm animate-in slide-in-from-left-2 duration-300">{errors.description.message}</p>
                                )}
                            </div>

                            {/* Note: Product images will be handled in the main products page later */}
                            <div className="col-span-1 md:col-span-2 xl:col-span-3">
                                <div className="p-4 bg-feature-products-soft/20 border border-feature-products/30 rounded-lg card-hover-effect">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Icon name="Package" className="h-5 w-5 text-feature-products icon-enhanced" />
                                            <h4 className="font-medium text-feature-products">إدارة صور المنتج</h4>
                                        </div>
                                        <div className="text-sm text-feature-products space-y-3">
                                            <div className="flex items-start gap-3">
                                                <Icon name="Image" className="h-4 w-4 text-feature-products mt-0.5 flex-shrink-0 icon-enhanced" />
                                                <p><strong>الصورة الرئيسية:</strong> الصورة التي تظهر في بطاقة المنتج والقوائم الرئيسية</p>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Icon name="Images" className="h-4 w-4 text-feature-analytics mt-0.5 flex-shrink-0 icon-enhanced" />
                                                <p><strong>ألبوم الصور:</strong> مجموعة صور إضافية تظهر في صفحة تفاصيل المنتج (معرض الصور)</p>
                                            </div>
                                            <div className="mt-3 pt-2 border-t border-feature-products/20">
                                                <p className="text-xs text-feature-products/80">
                                                    💡 سيتم إضافة الصورة الرئيسية وألبوم الصور من صفحة إدارة المنتجات الرئيسية بعد إنشاء المنتج
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Supplier Selection */}
                <Card className="shadow-lg border-l-4 border-l-feature-suppliers card-hover-effect card-border-glow">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Icon name="Building2" className="h-5 w-5 text-feature-suppliers icon-enhanced" />
                            اختيار المورد
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="bg-feature-suppliers-soft/10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 flex-wrap">
                                <Label className="text-sm font-medium">اختر المورد *</Label>
                                <Badge variant="outline" className="text-xs border-feature-suppliers/30 text-feature-suppliers">
                                    {suppliers.length} مورد متاح
                                </Badge>
                                {selectedSupplierId && (
                                    <Badge className="text-xs bg-feature-suppliers text-white animate-in slide-in-from-right-2 duration-300">
                                        ✓ {suppliers.find(s => s.id === selectedSupplierId)?.name}
                                    </Badge>
                                )}
                            </div>

                            <ScrollArea className="h-64 w-full border border-feature-suppliers/20 rounded-lg bg-feature-suppliers-soft/5 p-2">
                                <RadioGroup
                                    value={selectedSupplierId}
                                    onValueChange={(value) => setValue('supplierId', value, { shouldValidate: true })}
                                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 p-2"
                                >
                                    {suppliers.map(supplier => (
                                        <div
                                            key={supplier.id}
                                            className={`relative border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:border-feature-suppliers hover:shadow-md card-hover-effect ${selectedSupplierId === supplier.id
                                                ? 'border-feature-suppliers bg-feature-suppliers-soft/20 shadow-md'
                                                : 'border-border bg-card'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <RadioGroupItem value={supplier.id} id={supplier.id} />
                                                <Label htmlFor={supplier.id} className="flex-1 cursor-pointer font-medium text-sm">
                                                    {supplier.name}
                                                </Label>
                                            </div>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </ScrollArea>

                            {errors.supplierId && (
                                <p className="text-destructive text-sm animate-in slide-in-from-left-2 duration-300">{errors.supplierId.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Categories Selection */}
                <Card className="shadow-lg border-l-4 border-l-feature-products card-hover-effect card-border-glow">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Icon name="Tag" className="h-5 w-5 text-feature-products icon-enhanced" />
                            تصنيفات المنتج
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="bg-feature-products-soft/10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 flex-wrap">
                                <Label className="text-sm font-medium">اختر التصنيفات *</Label>
                                <Badge variant="outline" className="text-xs border-feature-products/30 text-feature-products">
                                    {categories.length} تصنيف متاح
                                </Badge>
                                {selectedCategoryIds.length > 0 && (
                                    <>
                                        <Badge className="text-xs bg-feature-products text-white animate-in slide-in-from-right-2 duration-300">
                                            {selectedCategoryIds.length} محدد
                                        </Badge>
                                        <div className="flex gap-1 flex-wrap">
                                            {selectedCategoryIds.map(categoryId => {
                                                const category = categories.find(c => c.id === categoryId);
                                                return category ? (
                                                    <Badge key={categoryId} variant="secondary" className="text-xs animate-in zoom-in-50 duration-200">
                                                        ✓ {category.name}
                                                    </Badge>
                                                ) : null;
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>

                            <ScrollArea className="h-48 w-full border border-feature-products/20 rounded-lg bg-feature-products-soft/5 p-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 p-2">
                                    {categories.map(category => (
                                        <div
                                            key={category.id}
                                            className={`relative border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:border-feature-products hover:shadow-sm card-hover-effect ${selectedCategoryIds.includes(category.id)
                                                ? 'border-feature-products bg-feature-products-soft/20 shadow-sm'
                                                : 'border-border bg-card'
                                                }`}
                                        >
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <Checkbox
                                                    checked={selectedCategoryIds.includes(category.id)}
                                                    onCheckedChange={checked => {
                                                        if (checked) {
                                                            setValue('categoryIds', [...selectedCategoryIds, category.id], { shouldValidate: true });
                                                        } else {
                                                            setValue('categoryIds', selectedCategoryIds.filter((id: string) => id !== category.id), { shouldValidate: true });
                                                        }
                                                    }}
                                                />
                                                <span className="font-medium text-sm">{category.name}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            {errors.categoryIds && (
                                <p className="text-destructive text-sm animate-in slide-in-from-left-2 duration-300">{errors.categoryIds.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Product Settings */}
                <Card className="shadow-lg border-l-4 border-l-feature-settings card-hover-effect card-border-glow">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Icon name="Settings" className="h-5 w-5 text-feature-settings icon-enhanced" />
                            إعدادات المنتج
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="bg-feature-settings-soft/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Controller
                                        name="published"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                id="published"
                                                className="data-[state=checked]:bg-feature-settings data-[state=checked]:border-feature-settings"
                                            />
                                        )}
                                    />
                                    <Label htmlFor="published" className="text-sm font-medium cursor-pointer">
                                        منشور للعملاء
                                    </Label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Controller
                                        name="requiresShipping"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                id="requiresShipping"
                                                className="data-[state=checked]:bg-feature-settings data-[state=checked]:border-feature-settings"
                                            />
                                        )}
                                    />
                                    <Label htmlFor="requiresShipping" className="text-sm font-medium cursor-pointer">
                                        يتطلب شحن
                                    </Label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Controller
                                        name="hasQualityGuarantee"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                id="hasQualityGuarantee"
                                                className="data-[state=checked]:bg-feature-settings data-[state=checked]:border-feature-settings"
                                            />
                                        )}
                                    />
                                    <Label htmlFor="hasQualityGuarantee" className="text-sm font-medium cursor-pointer">
                                        ضمان جودة
                                    </Label>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Controller
                                        name="outOfStock"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                id="outOfStock"
                                                className="data-[state=checked]:bg-feature-settings data-[state=checked]:border-feature-settings"
                                            />
                                        )}
                                    />
                                    <Label htmlFor="outOfStock" className="text-sm font-medium cursor-pointer">
                                        نفد المخزون
                                    </Label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Controller
                                        name="manageInventory"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                id="manageInventory"
                                                className="data-[state=checked]:bg-feature-settings data-[state=checked]:border-feature-settings"
                                            />
                                        )}
                                    />
                                    <Label htmlFor="manageInventory" className="text-sm font-medium cursor-pointer">
                                        تتبع المخزون
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <Card className="shadow-lg border-l-4 border-l-feature-settings card-hover-effect">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Icon name="Settings" className="h-5 w-5 text-feature-settings icon-enhanced" />
                            {mode === 'new' ? 'حفظ المنتج' : 'حفظ التغييرات'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4 justify-end">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className={`gap-2 flex-1 sm:flex-initial ${mode === 'new' ? 'btn-add' : 'btn-save'}`}
                            >
                                <Icon name="Save" className="h-4 w-4" />
                                {isSubmitting ? 'جارٍ الحفظ...' : (mode === 'new' ? 'حفظ المنتج' : 'حفظ التغييرات')}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/dashboard/management-products')}
                                disabled={isSubmitting}
                                className="btn-cancel-outline gap-2 flex-1 sm:flex-initial"
                            >
                                إلغاء
                            </Button>
                        </div>

                        {mode === 'new' && (
                            <div className="text-sm text-muted-foreground bg-feature-products-soft/10 p-4 rounded-lg border border-feature-products/20">
                                <p className="font-medium mb-2 text-feature-products">🚀 تجربة محسّنة للإضافة السريعة</p>
                                <ul className="space-y-1 text-xs">
                                    <li>• بعد حفظ المنتج، ستظهر لك نافذة تأكيد لاختيار الإجراء التالي</li>
                                    <li>• يمكنك إضافة منتجات متعددة بسرعة مع الاحتفاظ بالإعدادات المشتركة</li>
                                    <li>• سيتم التركيز تلقائياً على حقل اسم المنتج للإدخال السريع</li>
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </form>
        </div>
    );
} 