'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Icon } from '@/components/icons/Icon';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';
import AddImage from '@/components/AddImage';
import SettingsLayout from '../components/SettingsLayout';
import { fetchCompany } from '../actions/fetchCompany';
import { saveCompany } from '../actions/saveCompnay';

interface PlatformData {
    id?: string | null;
    // Business Hours
    workingHours?: string | null;
    // Tax Information
    taxNumber?: string | null;
    taxQrImage?: string | null;
    taxPercentage?: number | null;
    // Delivery Settings
    shippingFee?: number | null;
    minShipping?: number | null;
}

export default function PlatformPage() {
    const [platformData, setPlatformData] = useState<PlatformData>({});
    const [isLoading, setIsLoading] = useState(true);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        const fetchPlatformData = async () => {
            try {
                const companyData = await fetchCompany();

                if (companyData) {
                    const platformDataToSet = {
                        id: companyData.id || '',
                        // Business Hours
                        workingHours: companyData.workingHours || '',
                        // Tax Information
                        taxNumber: companyData.taxNumber || '',
                        taxQrImage: companyData.taxQrImage || '',
                        taxPercentage: companyData.taxPercentage || 15,
                        // Delivery Settings
                        shippingFee: companyData.shippingFee || 0,
                        minShipping: companyData.minShipping || 0
                    };

                    setPlatformData(platformDataToSet);
                }
            } catch (error) {
                console.error('Error fetching platform data:', error);
                toast.error('فشل في تحميل بيانات المنصة');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlatformData();
    }, []);

    const handleEdit = (field: string, currentValue: string | number | boolean) => {
        setEditingField(field);
        setEditValue(String(currentValue));
    };

    const handleSave = async (field: string) => {
        try {
            // Get current company data
            const currentCompany = await fetchCompany();
            if (!currentCompany) {
                toast.error('لم يتم العثور على بيانات الشركة');
                return;
            }

            // Convert value to appropriate type based on field
            let fieldValue: string | number = editValue;
            if (field === 'shippingFee' || field === 'minShipping' || field === 'taxPercentage') {
                fieldValue = parseInt(editValue) || 0;
            }

            // Update the specific field
            const updatedData = {
                ...currentCompany,
                [field]: fieldValue
            };

            // Save to database
            const result = await saveCompany(updatedData);

            if (result.success) {
                setPlatformData(prev => ({ ...prev, [field]: fieldValue }));
                setEditingField(null);
                setEditValue('');
                toast.success('تم حفظ البيانات بنجاح');
            } else {
                toast.error(result.message || 'فشل في حفظ البيانات');
            }
        } catch (error) {
            console.error('Error saving platform data:', error);
            toast.error('فشل في حفظ البيانات');
        }
    };

    const handleCancel = () => {
        setEditingField(null);
        setEditValue('');
    };



    const completedFields = [
        platformData.workingHours,
        platformData.taxNumber,
        platformData.taxPercentage,
        platformData.shippingFee,
        platformData.minShipping
    ].filter(field => {
        if (typeof field === 'string') {
            return field && field.trim() !== '';
        }
        if (typeof field === 'number') {
            return field >= 0;
        }
        return false;
    }).length;

    const totalFields = 5;
    const isComplete = completedFields === totalFields;

    if (isLoading) {
        return (
            <SettingsLayout
                title="إعدادات المنصة"
                description="إدارة الإعدادات العامة للمنصة"
                icon={Settings}
                progress={{
                    current: 0,
                    total: 1,
                    isComplete: false
                }}
            >
                <div className="flex items-center justify-center h-32">
                    <div className="text-muted-foreground">جاري التحميل...</div>
                </div>
            </SettingsLayout>
        );
    }

    const businessHoursFields = [
        { key: 'workingHours', label: 'ساعات العمل', placeholder: 'مثال: الأحد - الخميس: 8:00 ص - 10:00 م', type: 'text' }
    ];

    const taxFields = [
        { key: 'taxNumber', label: 'الرقم الضريبي', placeholder: 'أدخل الرقم الضريبي', type: 'text' },
        { key: 'taxPercentage', label: 'نسبة الضريبة (%)', placeholder: '15', type: 'number' }
    ];

    const deliveryFields = [
        { key: 'shippingFee', label: 'رسوم التوصيل (ريال)', placeholder: '0', type: 'number' },
        { key: 'minShipping', label: 'حد التوصيل المجاني (ريال)', placeholder: '0', type: 'number' }
    ];

    return (
        <SettingsLayout
            title="إعدادات المنصة"
            description="إدارة الإعدادات العامة للمنصة"
            icon={Settings}
            progress={{
                current: completedFields,
                total: totalFields,
                isComplete
            }}
        >
            <div className="space-y-8">
                {/* Summary Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">ساعات العمل</p>
                                <p className="text-lg font-semibold mt-1 text-foreground">
                                    {platformData.workingHours ? 'محددة' : 'غير محددة'}
                                </p>
                            </div>
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Icon name="Clock" size="sm" className="text-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">الرقم الضريبي</p>
                                <p className="text-lg font-semibold mt-1 text-foreground">
                                    {platformData.taxNumber ? 'محدد' : 'غير محدد'}
                                </p>
                            </div>
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Icon name="Receipt" size="sm" className="text-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">نسبة الضريبة</p>
                                <p className="text-lg font-semibold mt-1 text-foreground">
                                    {platformData.taxPercentage || 0}%
                                </p>
                            </div>
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Icon name="Percent" size="sm" className="text-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">رسوم التوصيل</p>
                                <p className="text-lg font-semibold mt-1 text-foreground">
                                    {platformData.shippingFee || 0} ريال
                                </p>
                            </div>
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Icon name="Truck" size="sm" className="text-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">التوصيل المجاني</p>
                                <p className="text-lg font-semibold mt-1 text-foreground">
                                    {platformData.minShipping || 0} ريال
                                </p>
                            </div>
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Icon name="Gift" size="sm" className="text-primary" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Business Hours Section */}
                <Card className="shadow-sm border-0 bg-gradient-to-br from-background to-muted/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-lg">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Icon name="Clock" size="sm" className="text-primary" />
                            </div>
                            <div>
                                <div className="font-semibold">ساعات العمل</div>
                                <div className="text-sm font-normal text-muted-foreground mt-1">
                                    تحديد أوقات العمل المتاحة للعملاء
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {businessHoursFields.map((field) => {
                            const currentValue = platformData[field.key as keyof PlatformData] as string || '';
                            const isEditing = editingField === field.key;

                            return (
                                <div key={field.key} className="space-y-3">
                                    <Label className="text-sm font-semibold text-foreground">{field.label}</Label>

                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <Textarea
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                placeholder={field.placeholder}
                                                className="min-h-[100px] resize-none border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                rows={4}
                                            />
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSave(field.key)}
                                                    className="flex-1 sm:flex-none"
                                                >
                                                    <Icon name="Check" size="xs" className="ml-2" />
                                                    حفظ التغييرات
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={handleCancel}
                                                    className="flex-1 sm:flex-none"
                                                >
                                                    <Icon name="X" size="xs" className="ml-2" />
                                                    إلغاء
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="group relative">
                                            <div className="p-4 rounded-lg border-2 border-dashed border-border bg-muted/30 hover:border-primary/50 transition-colors">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-muted-foreground mb-1">القيمة الحالية:</p>
                                                        <p className="text-sm font-medium text-foreground leading-relaxed">
                                                            {currentValue || (
                                                                <span className="text-muted-foreground italic">
                                                                    لم يتم تحديد ساعات العمل بعد
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEdit(field.key, currentValue)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary hover:bg-primary/10"
                                                    >
                                                        <Icon name="Edit" size="sm" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Tax Information Section */}
                <Card className="shadow-sm border-0 bg-gradient-to-br from-background to-muted/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-lg">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Icon name="Receipt" size="sm" className="text-primary" />
                            </div>
                            <div>
                                <div className="font-semibold">معلومات الضريبة</div>
                                <div className="text-sm font-normal text-muted-foreground mt-1">
                                    إدارة المعلومات الضريبية والوثائق المطلوبة
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Tax Number Field */}
                        {taxFields.map((field) => {
                            const currentValue = platformData[field.key as keyof PlatformData] as string || '';
                            const isEditing = editingField === field.key;

                            return (
                                <div key={field.key} className="space-y-3">
                                    <Label className="text-sm font-semibold text-foreground">{field.label}</Label>

                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <Input
                                                type={field.type as 'text' | 'number'}
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                placeholder={field.placeholder}
                                                className="border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            />
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSave(field.key)}
                                                    className="flex-1 sm:flex-none"
                                                >
                                                    <Icon name="Check" size="xs" className="ml-2" />
                                                    حفظ التغييرات
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={handleCancel}
                                                    className="flex-1 sm:flex-none"
                                                >
                                                    <Icon name="X" size="xs" className="ml-2" />
                                                    إلغاء
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="group relative">
                                            <div className="p-4 rounded-lg border-2 border-dashed border-border bg-muted/30 hover:border-primary/50 transition-colors">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-muted-foreground mb-1">القيمة الحالية:</p>
                                                        <p className="text-sm font-medium text-foreground">
                                                            {currentValue || (
                                                                <span className="text-muted-foreground italic">
                                                                    لم يتم تحديد الرقم الضريبي بعد
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEdit(field.key, currentValue)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary hover:bg-primary/10"
                                                    >
                                                        <Icon name="Edit" size="sm" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Tax QR Image Field */}
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-semibold text-foreground">صورة QR الضريبة</Label>
                                <p className="text-xs text-muted-foreground mt-1">
                                    انقر على الصورة لتغيير صورة QR الضريبة المطلوبة للفواتير
                                </p>
                            </div>
                            <div className="w-full sm:w-64 h-40 border-2 border-dashed border-border rounded-lg overflow-hidden bg-muted/30 hover:border-primary/50 transition-colors">
                                <AddImage
                                    url={platformData.taxQrImage || undefined}
                                    alt="صورة QR الضريبة"
                                    recordId={platformData.id || ''}
                                    table="company"
                                    tableField="taxQrImage"
                                    onUploadComplete={(url) => {
                                        setPlatformData(prev => ({ ...prev, taxQrImage: url }));
                                        toast.success('تم تحديث صورة QR الضريبة بنجاح');
                                    }}
                                    autoUpload={true}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Delivery Settings Section */}
                <Card className="shadow-sm border-0 bg-gradient-to-br from-background to-muted/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-lg">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Icon name="Truck" size="sm" className="text-primary" />
                            </div>
                            <div>
                                <div className="font-semibold">إعدادات التوصيل</div>
                                <div className="text-sm font-normal text-muted-foreground mt-1">
                                    إدارة رسوم التوصيل وشروط التوصيل المجاني
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Delivery Fields */}
                        {deliveryFields.map((field) => {
                            const currentValue = platformData[field.key as keyof PlatformData] as string | number || '';
                            const isEditing = editingField === field.key;

                            return (
                                <div key={field.key} className="space-y-3">
                                    <Label className="text-sm font-semibold text-foreground">{field.label}</Label>

                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <Input
                                                type={field.type as 'text' | 'number'}
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                placeholder={field.placeholder}
                                                className="border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            />
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSave(field.key)}
                                                    className="flex-1 sm:flex-none"
                                                >
                                                    <Icon name="Check" size="xs" className="ml-2" />
                                                    حفظ التغييرات
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={handleCancel}
                                                    className="flex-1 sm:flex-none"
                                                >
                                                    <Icon name="X" size="xs" className="ml-2" />
                                                    إلغاء
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="group relative">
                                            <div className="p-4 rounded-lg border-2 border-dashed border-border bg-muted/30 hover:border-primary/50 transition-colors">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-muted-foreground mb-1">القيمة الحالية:</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg font-semibold text-primary">
                                                                {currentValue || '0'}
                                                            </span>
                                                            <span className="text-sm text-muted-foreground">ريال</span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEdit(field.key, currentValue)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary hover:bg-primary/10"
                                                    >
                                                        <Icon name="Edit" size="sm" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>




            </div>
        </SettingsLayout>
    );
} 