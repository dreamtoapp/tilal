'use client';

import { useActionState, useState, useEffect } from 'react';
import { Loader2, Percent, Package, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

import { createOffer } from '../actions/create-offer';
import { updateOffer } from '../actions/update-offer';

interface OfferFormProps {
    initialData?: {
        id?: string;
        name?: string;
        description?: string | null;
        bannerImage?: string | null;
        hasDiscount?: boolean;
        discountPercentage?: number | null;
        isActive?: boolean;
        displayOrder?: number;
        productAssignments?: Array<{
            product: {
                id: string;
                name: string;
                images: string[];
                price: number;
            };
        }>;
        header?: string | null;
        subheader?: string | null;
    };
    mode?: 'create' | 'edit';
}

export function OfferForm({ initialData, mode = 'create' }: OfferFormProps) {
    const [hasDiscount, setHasDiscount] = useState(initialData?.hasDiscount || false);
    const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

    const [state, formAction, isPending] = useActionState(
        mode === 'edit' ? updateOffer : createOffer,
        {
            success: false,
            message: '',
        }
    );

    useEffect(() => {
        if (state.success) {
            // Form will redirect automatically, but we can show success message briefly
            console.log(mode === 'edit' ? 'Offer updated successfully' : 'Offer created successfully');
        }
    }, [state.success, mode]);

    return (
        <form action={formAction} className="space-y-6">
            {/* Hidden field for offer ID in edit mode */}
            {mode === 'edit' && initialData?.id && (
                <input type="hidden" name="offerId" value={initialData.id} />
            )}

            {/* Basic Information */}
            <div className="space-y-4 p-6 bg-feature-commerce-soft rounded-lg border border-feature-commerce/20">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Package className="h-5 w-5 text-feature-commerce icon-enhanced" />
                    المعلومات الأساسية
                </h3>

                <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground font-medium">اسم المجموعة *</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="أدخل اسم المجموعة"
                        required
                        defaultValue={initialData?.name}
                        className="border-feature-commerce/30 focus:border-feature-commerce focus:ring-feature-commerce/20"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-foreground font-medium">وصف المجموعة</Label>
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="أدخل وصف المجموعة"
                        defaultValue={initialData?.description || ''}
                        className="border-feature-commerce/30 focus:border-feature-commerce focus:ring-feature-commerce/20 min-h-[100px]"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="header" className="text-foreground font-medium">العنوان الرئيسي (Header)</Label>
                    <Input
                        id="header"
                        name="header"
                        placeholder="أدخل العنوان الرئيسي للعرض"
                        defaultValue={initialData?.header || ''}
                        className="border-feature-commerce/30 focus:border-feature-commerce focus:ring-feature-commerce/20"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="subheader" className="text-foreground font-medium">العنوان الفرعي (Subheader)</Label>
                    <Input
                        id="subheader"
                        name="subheader"
                        placeholder="أدخل العنوان الفرعي للعرض"
                        defaultValue={initialData?.subheader || ''}
                        className="border-feature-commerce/30 focus:border-feature-commerce focus:ring-feature-commerce/20"
                    />
                </div>
            </div>

            <Separator className="bg-feature-commerce/20" />

            {/* Discount Settings */}
            <div className="space-y-4 p-6 bg-feature-commerce-soft rounded-lg border border-feature-commerce/20">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Percent className="h-5 w-5 text-feature-commerce icon-enhanced" />
                    إعدادات الخصم
                </h3>

                <div className="space-y-3 p-4 bg-card rounded-md border">
                    <Label htmlFor="discountPercentage" className="text-feature-commerce font-medium">نسبة الخصم (اختيارية)</Label>
                    <Input
                        id="discountPercentage"
                        name="discountPercentage"
                        type="number"
                        min="0"
                        max="99"
                        placeholder="0 = بدون خصم، 1-99 = نسبة الخصم"
                        defaultValue={initialData?.discountPercentage ?? 0}
                        className="border-feature-commerce/30 focus:border-feature-commerce focus:ring-feature-commerce/20"
                        onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setHasDiscount(value > 0);
                        }}
                    />
                    <p className="text-xs text-feature-commerce">
                        اتركها 0 لعدم تطبيق خصم، أو أدخل نسبة من 1% إلى 99% لتطبيق الخصم
                    </p>

                    {/* Status indicator */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all ${hasDiscount
                        ? 'bg-feature-commerce/10 text-feature-commerce border border-feature-commerce/20'
                        : 'bg-muted text-muted-foreground border border-muted-foreground/20'
                        }`}>
                        <Percent className="h-3 w-3" />
                        {hasDiscount ? 'سيتم تطبيق الخصم' : 'بدون خصم'}
                    </div>
                </div>

                {/* Hidden input for form submission */}
                <input type="hidden" name="hasDiscount" value={hasDiscount.toString()} />
            </div>

            <Separator className="bg-feature-commerce/20" />

            {/* Product Selection */}
            <div className="space-y-4 p-6 bg-feature-products-soft rounded-lg border border-feature-products/20">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Package className="h-5 w-5 text-feature-products icon-enhanced" />
                    اختيار المنتجات
                </h3>

                <div className="p-6 bg-card rounded-lg border">
                    <div className="text-center space-y-3">
                        <div className="p-3 bg-feature-products/10 rounded-full w-fit mx-auto">
                            <Package className="h-8 w-8 text-feature-products" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-feature-products mb-1">
                                إدارة المنتجات
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                بعد إنشاء المجموعة، ستتمكن من إضافة وإدارة المنتجات من خلال صفحة تفاصيل المجموعة
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs text-feature-products bg-feature-products/5 px-3 py-2 rounded-md border border-feature-products/20">
                            <div className="w-2 h-2 bg-feature-products rounded-full"></div>
                            <span>سيتم تفعيل إدارة المنتجات بعد الحفظ</span>
                        </div>
                    </div>
                </div>
            </div>

            <Separator className="bg-feature-commerce/20" />

            {/* Display Settings */}
            <div className="space-y-4 p-6 bg-feature-settings-soft rounded-lg border border-feature-settings/20">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Eye className="h-5 w-5 text-feature-settings icon-enhanced" />
                    إعدادات العرض
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 p-4 bg-card rounded-md border">
                        <Label className="text-feature-settings font-medium">ترتيب العرض</Label>
                        <Input
                            name="displayOrder"
                            type="number"
                            min="0"
                            defaultValue={initialData?.displayOrder || 0}
                            placeholder="0"
                            className="max-w-xs border-feature-settings/30 focus:border-feature-settings focus:ring-feature-settings/20"
                        />
                        <p className="text-xs text-muted-foreground">
                            الأرقام الأصغر تظهر أولاً في القائمة
                        </p>
                    </div>

                    <div className="space-y-3 p-4 bg-card rounded-md border">
                        <div className="flex items-center gap-3">
                            <Switch
                                id="isActive"
                                checked={isActive}
                                onCheckedChange={setIsActive}
                                className={`
                                    h-6 w-11 
                                    data-[state=checked]:bg-feature-commerce 
                                    data-[state=unchecked]:bg-muted-foreground/30
                                    border-2
                                    ${isActive
                                        ? 'border-feature-commerce/20 shadow-feature-commerce/20'
                                        : 'border-muted-foreground/20 shadow-muted/20'
                                    }
                                    shadow-lg
                                    transition-all duration-200 ease-in-out
                                    hover:shadow-xl
                                    focus:ring-2 focus:ring-feature-commerce/30
                                `}
                            />
                            <Label htmlFor="isActive" className={`font-medium transition-colors cursor-pointer ${isActive ? 'text-feature-commerce' : 'text-muted-foreground'
                                }`}>
                                {isActive ? (
                                    <span className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        المجموعة نشطة
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <EyeOff className="h-4 w-4" />
                                        المجموعة غير نشطة
                                    </span>
                                )}
                            </Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            المجموعات النشطة فقط تظهر للعملاء
                        </p>

                        {/* Status indicator */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${isActive
                            ? 'bg-feature-commerce/10 text-feature-commerce border border-feature-commerce/20'
                            : 'bg-muted text-muted-foreground border border-muted-foreground/20'
                            }`}>
                            {isActive ? (
                                <>
                                    <div className="w-2 h-2 bg-feature-commerce rounded-full animate-pulse"></div>
                                    مفعلة ومرئية للعملاء
                                </>
                            ) : (
                                <>
                                    <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                                    غير مفعلة ومخفية
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hidden input for isActive */}
                <input type="hidden" name="isActive" value={isActive.toString()} />
            </div>

            {/* Error/Success Message */}
            {state.message && (
                <div
                    className={`rounded-lg p-4 border ${state.success
                        ? 'bg-green-50/50 text-green-700 border-green-200/50 shadow-sm'
                        : 'bg-destructive/10 text-destructive border-destructive/20 shadow-sm'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        {state.success ? (
                            <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        ) : (
                            <div className="w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-destructive-foreground" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                        <span className="font-medium">{state.message}</span>
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center gap-4 pt-6 border-t border-feature-commerce/20">
                <Button
                    type="submit"
                    disabled={isPending}
                    className="btn-save flex items-center gap-2 px-6 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            جاري الحفظ...
                        </>
                    ) : (
                        <>
                            <Package className="h-5 w-5" />
                            {mode === 'edit' ? 'تحديث المجموعة' : 'إنشاء المجموعة'}
                        </>
                    )}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className="btn-cancel-outline px-6 py-3 text-base font-medium"
                    onClick={() => window.history.back()}
                >
                    إلغاء
                </Button>
            </div>
        </form>
    );
} 