"use client";
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AboutTabClient from './AboutTabClient';
import FeaturesTabClient from './FeaturesTabClient';
import FAQTabClient from './FAQTabClient';
import { updateAboutPageContent } from '../actions/updateAboutPageContent';

export default function AboutAdminClient({ aboutPage }: { aboutPage: any }) {
    const aboutPageId = aboutPage?.id || null;
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    async function handleAboutSubmit(values: any) {
        setStatus(undefined);
        setError(undefined);
        try {
            const result = await updateAboutPageContent(values);
            if (result.success) {
                setStatus('success');
            } else {
                setError(result.error?.toString() || 'فشل في الحفظ');
            }
        } catch (e: any) {
            setError(e.message || 'Unknown error');
        }
    }

    return (
        <div className="w-full" dir="rtl">
            <div className="mb-6 text-right">
                <h1 className="text-2xl font-bold text-foreground">إدارة محتوى صفحة من نحن</h1>
                <p className="text-muted-foreground mt-2">قم بتحديث محتوى صفحة من نحن وإدارة الأسئلة الشائعة والمميزات</p>
            </div>

            <Tabs defaultValue="about" className="w-full" dir="rtl">
                <TabsList className="mb-6 w-full justify-start" dir="rtl">
                    <TabsTrigger value="about">عن الشركة</TabsTrigger>
                    <TabsTrigger value="features">المميزات</TabsTrigger>
                    <TabsTrigger value="faq">الأسئلة الشائعة</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-0" dir="rtl">
                    <AboutTabClient
                        defaultValues={{ ...aboutPage, id: aboutPageId }}
                        onSubmit={handleAboutSubmit}
                        status={status}
                        error={error}
                    />
                </TabsContent>

                <TabsContent value="features" className="mt-0" dir="rtl">
                    <FeaturesTabClient aboutPageId={aboutPageId} />
                </TabsContent>

                <TabsContent value="faq" className="mt-0" dir="rtl">
                    <FAQTabClient aboutPageId={aboutPageId} />
                </TabsContent>
            </Tabs>
        </div>
    );
} 