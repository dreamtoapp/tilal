'use client';

import { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import SettingsLayout from '../components/SettingsLayout';
import { fetchCompany } from '../actions/fetchCompany';
import { saveCompany } from '../actions/saveCompnay';
import AddImage from '@/components/AddImage';

interface BrandingData {
    id?: string | null;
    logo?: string | null;
    fullName?: string | null;
    bio?: string | null;
    website?: string | null;
}

export default function BrandingPage() {
    const [brandingData, setBrandingData] = useState<BrandingData>({});
    const [isLoading, setIsLoading] = useState(true);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        // Fetch branding data
        const fetchBrandingData = async () => {
            try {
                const companyData = await fetchCompany();
                if (companyData) {
                    setBrandingData({
                        id: companyData.id || '',
                        logo: companyData.logo || '',
                        fullName: companyData.fullName || '',
                        bio: companyData.bio || '',
                        website: companyData.website || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching branding data:', error);
                toast.error('فشل في تحميل بيانات الشركة');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBrandingData();
    }, []);

    const handleEdit = (field: string, currentValue: string) => {
        setEditingField(field);
        setEditValue(currentValue);
    };

    const formatUrl = (url: string): string => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `https://${url}`;
    };

    const handleSave = async (field: string) => {
        try {
            // Get current company data
            const currentCompany = await fetchCompany();
            if (!currentCompany) {
                toast.error('لم يتم العثور على بيانات الشركة');
                return;
            }

            // Format URL if it's a website field
            let valueToSave = editValue;
            if (field === 'website' && editValue) {
                valueToSave = formatUrl(editValue);
            }

            // Update the specific field
            const updatedData = {
                ...currentCompany,
                [field]: valueToSave
            };

            // Save to database
            const result = await saveCompany(updatedData);

            if (result.success) {
                setBrandingData(prev => ({ ...prev, [field]: valueToSave }));
                setEditingField(null);
                setEditValue('');
                toast.success('تم حفظ البيانات بنجاح');
            } else {
                toast.error(result.message || 'فشل في حفظ البيانات');
            }
        } catch (error) {
            console.error('Error saving branding data:', error);
            toast.error('فشل في حفظ البيانات');
        }
    };

    const handleCancel = () => {
        setEditingField(null);
        setEditValue('');
    };

    const completedFields = [
        brandingData.logo,
        brandingData.fullName,
        brandingData.bio,
        brandingData.website
    ].filter(field => field && field.trim() !== '').length;

    const totalFields = 4;
    const isComplete = completedFields === totalFields;

    if (isLoading) {
        return (
            <SettingsLayout
                title="الشعار والهوية"
                description="إدارة هوية الشركة البصرية"
                icon={Palette}
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

    const brandingFields = [
        { key: 'fullName', label: 'اسم الشركة', placeholder: 'اسم الشركة', type: 'text' },
        { key: 'bio', label: 'وصف الشركة', placeholder: 'وصف الشركة وشعارها', type: 'text' },
        { key: 'website', label: 'رابط الموقع الإلكتروني', placeholder: 'https://example.com', type: 'url' }
    ];

    return (
        <SettingsLayout
            title="الشعار والهوية"
            description="إدارة هوية الشركة البصرية"
            icon={Palette}
            progress={{
                current: completedFields,
                total: totalFields,
                isComplete
            }}
        >
            <div className="space-y-6">
                {/* Logo Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Icon name="Image" size="sm" />
                            شعار الشركة
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                انقر على الصورة لتغيير شعار الشركة
                            </p>
                            <div className="w-48 h-32 border rounded-lg overflow-hidden">
                                <AddImage
                                    url={brandingData.logo || undefined}
                                    alt="شعار الشركة"
                                    recordId={brandingData.id || ''}
                                    table="company"
                                    tableField="logo"
                                    onUploadComplete={(url) => {
                                        setBrandingData(prev => ({ ...prev, logo: url }));
                                        toast.success('تم تحديث الشعار بنجاح');
                                    }}
                                    autoUpload={true}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Brand Identity Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Icon name="Building2" size="sm" />
                            معلومات الشركة
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {brandingFields.map((field) => {
                            const currentValue = brandingData[field.key as keyof BrandingData] || '';
                            const isEditing = editingField === field.key;

                            return (
                                <div key={field.key} className="space-y-2">
                                    <Label className="text-sm font-medium">{field.label}</Label>

                                    {isEditing ? (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type={field.type as 'text' | 'url'}
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
                                            {field.type === 'url' && currentValue ? (
                                                <a
                                                    href={currentValue}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline"
                                                >
                                                    {currentValue}
                                                </a>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    {currentValue || 'لم يتم تحديد قيمة'}
                                                </span>
                                            )}
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

                {/* Preview Section */}
                {(brandingData.logo || brandingData.fullName) && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Icon name="Eye" size="sm" />
                                معاينة الهوية
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 p-4 bg-muted/10 rounded-lg">
                                {brandingData.logo && (
                                    <div className="w-16 h-16 rounded overflow-hidden bg-white">
                                        <Image
                                            src={brandingData.logo}
                                            alt="Logo"
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                                <div>
                                    {brandingData.fullName && (
                                        <h3 className="text-lg font-semibold">{brandingData.fullName}</h3>
                                    )}
                                    {brandingData.bio && (
                                        <p className="text-sm text-muted-foreground">{brandingData.bio}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </SettingsLayout>
    );
} 