'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Icon } from '@/components/icons/Icon';
import { toast } from 'sonner';
import { fetchCompany } from '../../actions/fetchCompany';
import { saveCompany } from '../../actions/saveCompnay';

interface PlatformData {
    id?: string | null;
    // Business Hours
    businessHours?: string | null;
    // Tax Settings
    taxRate?: string | null;
    taxName?: string | null;
    isTaxEnabled?: boolean;
    // Delivery Settings
    deliveryRadius?: string | null;
    deliveryFee?: string | null;
    freeDeliveryThreshold?: string | null;
    isShippingEnabled?: boolean;
    // Notifications
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
    // Platform Status
    platformActive?: boolean;
    maintenanceMode?: boolean;
}

export default function PlatformSettingsForm() {
    const [platformData, setPlatformData] = useState<PlatformData>({});
    const [isLoading, setIsLoading] = useState(true);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        const fetchPlatformData = async () => {
            try {
                const companyData = await fetchCompany();
                if (companyData) {
                    setPlatformData({
                        id: companyData.id || '',
                        // Business Hours
                        businessHours: 'الأحد - الخميس: 8:00 ص - 10:00 م | الجمعة - السبت: 9:00 ص - 11:00 م',
                        // Tax Settings
                        taxRate: '15',
                        taxName: 'ضريبة القيمة المضافة',
                        isTaxEnabled: true,
                        // Delivery Settings
                        deliveryRadius: '50',
                        deliveryFee: '25',
                        freeDeliveryThreshold: '200',
                        isShippingEnabled: true,
                        // Notifications
                        emailNotifications: true,
                        smsNotifications: true,
                        pushNotifications: true,
                        // Platform Status
                        platformActive: true,
                        maintenanceMode: false
                    });
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

    const handleEdit = (field: string, currentValue: string | boolean) => {
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

            // Update the specific field
            const updatedData = {
                ...currentCompany,
                [field]: editValue
            };

            // Save to database
            const result = await saveCompany(updatedData);

            if (result.success) {
                setPlatformData(prev => ({ ...prev, [field]: editValue }));
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

    const handleToggle = async (field: string, value: boolean) => {
        try {
            setPlatformData(prev => ({ ...prev, [field]: value }));
            toast.success('تم تحديث الإعداد بنجاح');
        } catch (error) {
            console.error('Error toggling setting:', error);
            toast.error('فشل في تحديث الإعداد');
        }
    };



    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="text-muted-foreground">جاري التحميل...</div>
            </div>
        );
    }

    const businessHoursFields = [
        { key: 'businessHours', label: 'ساعات العمل', placeholder: 'ساعات العمل', type: 'text' }
    ];

    const taxFields = [
        { key: 'taxRate', label: 'نسبة الضريبة (%)', placeholder: '15', type: 'number' },
        { key: 'taxName', label: 'اسم الضريبة', placeholder: 'ضريبة القيمة المضافة', type: 'text' }
    ];

    const deliveryFields = [
        { key: 'deliveryRadius', label: 'نطاق التوصيل (كم)', placeholder: '50', type: 'number' },
        { key: 'deliveryFee', label: 'رسوم التوصيل (ريال)', placeholder: '25', type: 'number' },
        { key: 'freeDeliveryThreshold', label: 'حد التوصيل المجاني (ريال)', placeholder: '200', type: 'number' }
    ];

    return (
        <div className="space-y-6">
            {/* Business Hours Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icon name="Clock" size="sm" />
                        ساعات العمل
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {businessHoursFields.map((field) => {
                        const currentValue = platformData[field.key as keyof PlatformData] as string || '';
                        const isEditing = editingField === field.key;

                        return (
                            <div key={field.key} className="space-y-2">
                                <Label className="text-sm font-medium">{field.label}</Label>

                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <Textarea
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            placeholder={field.placeholder}
                                            className="flex-1"
                                            rows={3}
                                        />
                                        <Button size="sm" onClick={() => handleSave(field.key)}>
                                            حفظ
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={handleCancel}>
                                            إلغاء
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">
                                            {currentValue || 'لم يتم تحديد قيمة'}
                                        </span>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEdit(field.key, currentValue)}
                                            className="text-primary hover:text-primary/80"
                                        >
                                            <Icon name="Edit" size="xs" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Tax Information Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icon name="Receipt" size="sm" />
                        معلومات الضريبة
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Tax Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium">تفعيل الضريبة</Label>
                            <p className="text-xs text-muted-foreground">تفعيل أو إيقاف الضريبة على الطلبات</p>
                        </div>
                        <Switch
                            checked={platformData.isTaxEnabled || false}
                            onCheckedChange={(checked) => handleToggle('isTaxEnabled', checked)}
                        />
                    </div>

                    {/* Tax Fields */}
                    {taxFields.map((field) => {
                        const currentValue = platformData[field.key as keyof PlatformData] as string || '';
                        const isEditing = editingField === field.key;

                        return (
                            <div key={field.key} className="space-y-2">
                                <Label className="text-sm font-medium">{field.label}</Label>

                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type={field.type as 'text' | 'number'}
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            placeholder={field.placeholder}
                                            className="flex-1"
                                        />
                                        <Button size="sm" onClick={() => handleSave(field.key)}>
                                            حفظ
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={handleCancel}>
                                            إلغاء
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">
                                            {currentValue || 'لم يتم تحديد قيمة'}
                                        </span>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEdit(field.key, currentValue)}
                                            className="text-primary hover:text-primary/80"
                                        >
                                            <Icon name="Edit" size="xs" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Delivery Settings Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icon name="Truck" size="sm" />
                        إعدادات التوصيل
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Shipping Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium">تفعيل التوصيل</Label>
                            <p className="text-xs text-muted-foreground">تفعيل أو إيقاف خدمة التوصيل</p>
                        </div>
                        <Switch
                            checked={platformData.isShippingEnabled || false}
                            onCheckedChange={(checked) => handleToggle('isShippingEnabled', checked)}
                        />
                    </div>

                    {/* Delivery Fields */}
                    {deliveryFields.map((field) => {
                        const currentValue = platformData[field.key as keyof PlatformData] as string || '';
                        const isEditing = editingField === field.key;

                        return (
                            <div key={field.key} className="space-y-2">
                                <Label className="text-sm font-medium">{field.label}</Label>

                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type={field.type as 'text' | 'number'}
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            placeholder={field.placeholder}
                                            className="flex-1"
                                        />
                                        <Button size="sm" onClick={() => handleSave(field.key)}>
                                            حفظ
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={handleCancel}>
                                            إلغاء
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">
                                            {currentValue || 'لم يتم تحديد قيمة'}
                                        </span>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEdit(field.key, currentValue)}
                                            className="text-primary hover:text-primary/80"
                                        >
                                            <Icon name="Edit" size="xs" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Notification Settings Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icon name="Bell" size="sm" />
                        إعدادات الإشعارات
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium">إشعارات البريد الإلكتروني</Label>
                            <p className="text-xs text-muted-foreground">استلام إشعارات عبر البريد الإلكتروني</p>
                        </div>
                        <Switch
                            checked={platformData.emailNotifications || false}
                            onCheckedChange={(checked) => handleToggle('emailNotifications', checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium">إشعارات الرسائل النصية</Label>
                            <p className="text-xs text-muted-foreground">استلام إشعارات عبر الرسائل النصية</p>
                        </div>
                        <Switch
                            checked={platformData.smsNotifications || false}
                            onCheckedChange={(checked) => handleToggle('smsNotifications', checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium">إشعارات المتصفح</Label>
                            <p className="text-xs text-muted-foreground">استلام إشعارات في المتصفح</p>
                        </div>
                        <Switch
                            checked={platformData.pushNotifications || false}
                            onCheckedChange={(checked) => handleToggle('pushNotifications', checked)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Platform Status Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icon name="Globe" size="sm" />
                        حالة المنصة
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium">تفعيل المنصة</Label>
                            <p className="text-xs text-muted-foreground">تفعيل أو إيقاف المنصة</p>
                        </div>
                        <Switch
                            checked={platformData.platformActive || false}
                            onCheckedChange={(checked) => handleToggle('platformActive', checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium">وضع الصيانة</Label>
                            <p className="text-xs text-muted-foreground">تفعيل وضع الصيانة للمنصة</p>
                        </div>
                        <Switch
                            checked={platformData.maintenanceMode || false}
                            onCheckedChange={(checked) => handleToggle('maintenanceMode', checked)}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 