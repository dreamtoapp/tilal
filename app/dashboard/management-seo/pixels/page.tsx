// app/dashboard/seo/pixels/page.tsx
"use client"
import React from 'react';

import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  getAnalyticsSettings,
  upsertAnalyticsSettings,
} from './actions';

export default function PixelsAndAnalyticsPage() {
  const [loading, setLoading] = React.useState(false);
  const { register, handleSubmit, reset } = useForm();

  React.useEffect(() => {
    getAnalyticsSettings().then((data) => {
      if (data) reset(data);
    });
  }, [reset]);

  const onSubmit = async (values: any) => {
    setLoading(true);
    await upsertAnalyticsSettings(values);
    setLoading(false);
    // Optionally show a toast/notification here
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-primary">
        إعداد وربط البيكسل والتحليلات
      </h1>
      <p className="mb-6 text-muted-foreground">
        أدخل معلومات التتبع الخاصة بك لكل منصة أدناه. جميع الحقول اختيارية
        ويمكنك تفعيل أو تعطيل أي منصة حسب الحاجة.
      </p>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Google Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Google Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="googleAnalyticsId">Measurement ID</Label>
            <Input id="googleAnalyticsId" {...register('googleAnalyticsId')} type="text" placeholder="G-XXXXXXXXXX" className="mt-1" />
            <div className="mt-1 text-xs text-muted-foreground">
              <a href="https://support.google.com/analytics/answer/9539598?hl=ar" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition">شرح ربط Google Analytics (رابط رسمي)</a>
            </div>
          </CardContent>
        </Card>

        {/* Facebook Pixel */}
        <Card>
          <CardHeader>
            <CardTitle>Facebook Pixel</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="facebookPixelId">Pixel ID</Label>
            <Input id="facebookPixelId" {...register('facebookPixelId')} type="text" placeholder="123456789012345" className="mt-1" />
            <div className="mt-1 text-xs text-muted-foreground">
              <a href="https://www.facebook.com/business/help/952192354843755" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition">شرح ربط Facebook Pixel (رابط رسمي)</a>
            </div>
          </CardContent>
        </Card>

        {/* TikTok Pixel */}
        <Card>
          <CardHeader>
            <CardTitle>TikTok Pixel</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="tiktokPixelId">Pixel ID</Label>
            <Input id="tiktokPixelId" {...register('tiktokPixelId')} type="text" placeholder="XXXXXXXXXX" className="mt-1" />
            <div className="mt-1 text-xs text-muted-foreground">
              <a href="https://ads.tiktok.com/help/article?aid=100006276" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition">شرح ربط TikTok Pixel (رابط رسمي)</a>
            </div>
          </CardContent>
        </Card>

        {/* Snapchat Pixel */}
        <Card>
          <CardHeader>
            <CardTitle>Snapchat Pixel</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="snapchatPixelId">Pixel ID</Label>
            <Input id="snapchatPixelId" {...register('snapchatPixelId')} type="text" placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" className="mt-1" />
            <div className="mt-1 text-xs text-muted-foreground">
              <a href="https://businesshelp.snapchat.com/s/article/pixel-setup" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition">شرح ربط Snapchat Pixel (رابط رسمي)</a>
            </div>
          </CardContent>
        </Card>

        {/* Pinterest Tag */}
        <Card>
          <CardHeader>
            <CardTitle>Pinterest Tag</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="pinterestTagId">Tag ID</Label>
            <Input id="pinterestTagId" {...register('pinterestTagId')} type="text" placeholder="XXXXXXXXXX" className="mt-1" />
            <div className="mt-1 text-xs text-muted-foreground">
              <a href="https://help.pinterest.com/en/business/article/set-up-the-pinterest-tag" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition">شرح ربط Pinterest Tag (رابط رسمي)</a>
            </div>
          </CardContent>
        </Card>

        {/* LinkedIn Insight */}
        <Card>
          <CardHeader>
            <CardTitle>LinkedIn Insight</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="linkedinInsightTagId">Tag ID</Label>
            <Input id="linkedinInsightTagId" {...register('linkedinInsightTagId')} type="text" placeholder="XXXXXXXXXX" className="mt-1" />
            <div className="mt-1 text-xs text-muted-foreground">
              <a href="https://www.linkedin.com/help/lms/answer/a427660" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition">شرح ربط LinkedIn Insight (رابط رسمي)</a>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? '...جارٍ الحفظ' : 'حفظ الإعدادات'}
        </Button>
      </form>

      <div className="mt-8 text-xs text-muted-foreground">
        <b>المنصات المدعومة:</b> Google Analytics, Facebook Pixel, TikTok Pixel,
        Snapchat Pixel, Pinterest Tag, LinkedIn Insight.
      </div>
    </div>
  );
}