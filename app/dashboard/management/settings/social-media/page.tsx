'use client';

import { useEffect, useState } from 'react';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/icons/Icon';
import SettingsLayout from '../components/SettingsLayout';

interface SocialMediaLinks {
    facebook?: string | null;
    instagram?: string | null;
    twitter?: string | null;
    linkedin?: string | null;
    tiktok?: string | null;
    snapchat?: string | null;
}

export default function SocialMediaPage() {
    const [socialData, setSocialData] = useState<SocialMediaLinks>({});
    const [isLoading, setIsLoading] = useState(true);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        // Fetch social media data
        const fetchSocialData = async () => {
            try {
                // TODO: Replace with actual API call
                const mockData: SocialMediaLinks = {
                    facebook: 'https://facebook.com/company',
                    instagram: 'https://instagram.com/company',
                    twitter: 'https://twitter.com/company',
                    linkedin: 'https://linkedin.com/company/company',
                    tiktok: 'https://tiktok.com/@company',
                    snapchat: 'https://snapchat.com/add/company'
                };
                setSocialData(mockData);
            } catch (error) {
                console.error('Error fetching social media data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSocialData();
    }, []);

    const handleEdit = (field: string, currentValue: string) => {
        setEditingField(field);
        setEditValue(currentValue);
    };

    const handleSave = async (field: string) => {
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500));

            setSocialData(prev => ({ ...prev, [field]: editValue }));
            setEditingField(null);
            setEditValue('');
            toast.success('تم حفظ الرابط بنجاح');
        } catch (error) {
            toast.error('فشل في حفظ الرابط');
        }
    };

    const handleCancel = () => {
        setEditingField(null);
        setEditValue('');
    };

    const completedFields = [
        socialData.facebook,
        socialData.instagram,
        socialData.twitter,
        socialData.linkedin,
        socialData.tiktok,
        socialData.snapchat
    ].filter(field => field && field.trim() !== '').length;

    const totalFields = 6;
    const isComplete = completedFields === totalFields;

    if (isLoading) {
        return (
            <SettingsLayout
                title="الروابط الاجتماعية"
                description="روابط وسائل التواصل الاجتماعي للشركة"
                icon={Share2}
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

    const platforms = [
        { key: 'facebook', label: 'فيسبوك', placeholder: 'https://facebook.com/your-page', color: 'text-blue-600' },
        { key: 'instagram', label: 'إنستغرام', placeholder: 'https://instagram.com/your-account', color: 'text-pink-600' },
        { key: 'twitter', label: 'تويتر', placeholder: 'https://twitter.com/your-account', color: 'text-blue-400' },
        { key: 'linkedin', label: 'لينكد إن', placeholder: 'https://linkedin.com/company/your-company', color: 'text-blue-700' },
        { key: 'tiktok', label: 'تيك توك', placeholder: 'https://tiktok.com/@your-account', color: 'text-black' },
        { key: 'snapchat', label: 'سناب شات', placeholder: 'https://snapchat.com/add/your-username', color: 'text-yellow-500' }
    ];

    return (
        <SettingsLayout
            title="الروابط الاجتماعية"
            description="روابط وسائل التواصل الاجتماعي للشركة"
            icon={Share2}
            progress={{
                current: completedFields,
                total: totalFields,
                isComplete
            }}
        >
            <div className="space-y-4">
                {platforms.map((platform) => {
                    const currentValue = socialData[platform.key as keyof SocialMediaLinks] || '';
                    const isEditing = editingField === platform.key;

                    return (
                        <div key={platform.key} className="flex items-center gap-4 p-4 bg-muted/10 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Icon name="Share2" size="xs" className="text-primary" />
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">{platform.label}</p>

                                {isEditing ? (
                                    <div className="flex items-center gap-2 mt-2">
                                        <Input
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            placeholder={platform.placeholder}
                                            className="flex-1"
                                        />
                                        <Button size="sm" onClick={() => handleSave(platform.key)}>
                                            حفظ
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={handleCancel}>
                                            إلغاء
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 mt-1">
                                        {currentValue ? (
                                            <a
                                                href={currentValue}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`text-sm ${platform.color} hover:underline`}
                                            >
                                                {currentValue}
                                            </a>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">لا يوجد رابط</span>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEdit(platform.key, currentValue)}
                                            className="text-primary hover:text-primary/80"
                                        >
                                            <Icon name="Edit" size="xs" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </SettingsLayout>
    );
} 