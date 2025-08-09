"use client";

// Product SEO Form Component
import React, { useState } from 'react';

import { toast } from 'sonner';

import InfoTooltip from '@/components/InfoTooltip';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const LOCALES = [
  { code: 'ar-SA', label: 'العربية' },
  { code: 'en-US', label: 'English' },
];

export default function ProductSeoForm({ productId, arSeo, enSeo, productData }: any) {
  const [activeLocale, setActiveLocale] = useState<'ar-SA' | 'en-US'>('ar-SA');
  const [form, setForm] = useState({
    'ar-SA': {
      metaTitle: arSeo?.metaTitle || '',
      metaDescription: arSeo?.metaDescription || '',
      openGraphTitle: arSeo?.openGraphTitle || '',
      openGraphDescription: arSeo?.openGraphDescription || '',
      canonicalUrl: arSeo?.canonicalUrl || '',
      robots: arSeo?.robots || 'index, follow',
      openGraphImage: arSeo?.openGraphImage || '',
      twitterImage: arSeo?.twitterImage || '',
      schemaOrg: arSeo?.schemaOrg || '',
      twitterCardType: arSeo?.twitterCardType || 'summary_large_image',
    },
    'en-US': {
      metaTitle: enSeo?.metaTitle || '',
      metaDescription: enSeo?.metaDescription || '',
      openGraphTitle: enSeo?.openGraphTitle || '',
      openGraphDescription: enSeo?.openGraphDescription || '',
      canonicalUrl: enSeo?.canonicalUrl || '',
      robots: enSeo?.robots || 'index, follow',
      openGraphImage: enSeo?.openGraphImage || '',
      twitterImage: enSeo?.twitterImage || '',
      schemaOrg: enSeo?.schemaOrg || '',
      twitterCardType: enSeo?.twitterCardType || 'summary_large_image',
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  // Set metaTitle default to product name if available
  React.useEffect(() => {
    if (productData?.name) {
      setForm((prev: any) => {
        const updated = { ...prev };
        LOCALES.forEach(locale => {
          if (!prev[locale.code].metaTitle) {
            updated[locale.code] = {
              ...prev[locale.code],
              metaTitle: productData.name,
            };
          }
        });
        return updated;
      });
    }
  }, [productData]);

  const handleChange = (locale: 'ar-SA' | 'en-US', field: string, value: string) => {
    setForm((prev: any) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { updateProductSeo } = await import('../actions/update-product-seo');
    const res = await updateProductSeo({
      productId,
      locale: activeLocale,
      ...form[activeLocale],
    });
    setIsLoading(false);
    if (res.success) {
      toast.success('تم حفظ بيانات السيو بنجاح');
    } else {
      console.error('SEO Save Error:', res);
      toast.error(res.error ? `خطأ أثناء الحفظ: ${res.error}` : `حدث خطأ غير متوقع أثناء حفظ بيانات السيو. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.\nAn unexpected error occurred while saving SEO data.\n${JSON.stringify(res)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto flex flex-col gap-8" autoComplete="off">
      <Card className="bg-background border border-border shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">SEO المنتج ({LOCALES.find(l => l.code === activeLocale)?.label})</CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            جميع الحقول مطلوبة لتحسين ظهور المنتج في نتائج البحث ({activeLocale === 'ar-SA' ? 'العربية' : 'English'}).
          </CardDescription>
          <div className="flex gap-2 mt-4">
            {LOCALES.map((locale) => (
              <button
                key={locale.code}
                type="button"
                className={`px-4 py-2 rounded font-bold border transition-colors ${activeLocale === locale.code ? 'bg-primary text-white border-primary' : 'bg-muted text-foreground border-border'}`}
                onClick={() => setActiveLocale(locale.code as 'ar-SA' | 'en-US')}
              >
                {locale.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* metaTitle */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row items-center gap-2 w-full">
                <label className="font-semibold text-sm text-foreground">Meta Title <span className="text-red-500">*</span></label>
                <InfoTooltip content="العنوان الرئيسي للمنتج كما يظهر في نتائج البحث. يجب أن يكون فريدًا وجذابًا ويحتوي على الكلمات المفتاحية الأساسية." />
                {/* Removed Meta Title suggestion button as per requirements */}
              </div>
              <Input
                type="text"
                required
                maxLength={120}
                value={form[activeLocale].metaTitle}
                onChange={e => handleChange(activeLocale, 'metaTitle', e.target.value)}
                placeholder={activeLocale === 'ar-SA' ? 'مثال: أفضل منتج إلكتروني' : 'e.g. Best Product Title'}
                autoComplete="off"
              />
              <span className="text-xs text-muted-foreground">120 حرف كحد أقصى</span>
            </div>
            {/* metaDescription */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row items-center gap-2 w-full">
                <label className="font-semibold text-sm text-foreground">Meta Description <span className="text-red-500">*</span></label>
                <InfoTooltip content="وصف مختصر للمنتج يظهر أسفل العنوان في نتائج البحث. يجب أن يكون مشوقًا ويوضح محتوى المنتج." />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Suggest a simple meta description using product data
                    if (productData?.name) {
                      setForm((prev: any) => ({
                        ...prev,
                        [activeLocale]: {
                          ...prev[activeLocale],
                          metaDescription: `اكتشف ${productData.name} الآن في متجرنا! جودة عالية وسعر منافس.`,
                        },
                      }));
                    }
                  }}
                  className="ml-2"
                >
                  اقتراح وصف تلقائي
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled
                  className="ml-2 opacity-60 cursor-not-allowed"
                >
                  مساعدة الذكاء الاصطناعي (قريبًا)
                </Button>
              </div>
              <Textarea
                required
                maxLength={320}
                value={form[activeLocale].metaDescription}
                onChange={e => handleChange(activeLocale, 'metaDescription', e.target.value)}
                placeholder={activeLocale === 'ar-SA' ? 'وصف مختصر وجذاب للمنتج...' : 'Short and catchy product description...'}
                className="min-h-[80px]"
                autoComplete="off"
              />
              <span className="text-xs text-muted-foreground">320 حرف كحد أقصى</span>
            </div>
            {/* openGraphTitle */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row items-center gap-2 w-full">
                <label className="font-semibold text-sm text-foreground">Open Graph Title</label>
                <InfoTooltip content="العنوان الذي يظهر عند مشاركة المنتج على وسائل التواصل الاجتماعي." />
              </div>
              <Input
                type="text"
                value={form[activeLocale].openGraphTitle}
                onChange={e => handleChange(activeLocale, 'openGraphTitle', e.target.value)}
                placeholder={activeLocale === 'ar-SA' ? 'عنوان المشاركة على وسائل التواصل' : 'Social share title'}
                autoComplete="off"
              />
            </div>
            {/* openGraphDescription */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row items-center gap-2 w-full">
                <label className="font-semibold text-sm text-foreground">Open Graph Description</label>
                <InfoTooltip content="وصف مختصر يظهر عند مشاركة المنتج على وسائل التواصل الاجتماعي." />
              </div>
              <Textarea
                value={form[activeLocale].openGraphDescription}
                onChange={e => handleChange(activeLocale, 'openGraphDescription', e.target.value)}
                placeholder={activeLocale === 'ar-SA' ? 'وصف المشاركة على وسائل التواصل' : 'Social share description'}
                className="min-h-[60px]"
                autoComplete="off"
              />
            </div>
            {/* canonicalUrl */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row items-center gap-2 w-full">
                <label className="font-semibold text-sm text-foreground">Canonical URL</label>
                <InfoTooltip content="الرابط الأساسي للمنتج لمنع تكرار المحتوى في محركات البحث. اتركه فارغًا إذا لم تكن متأكدًا." />
              </div>
              <Input
                type="url"
                value={form[activeLocale].canonicalUrl}
                onChange={e => handleChange(activeLocale, 'canonicalUrl', e.target.value)}
                placeholder="https://www.ammawag.com/product/slug"
              />
            </div>
            {/* robots */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row items-center gap-2 w-full">
                <label className="font-semibold text-sm text-foreground">Robots</label>
                <InfoTooltip content="تعليمات لمحركات البحث حول كيفية فهرسة المنتج. اختر من الخيارات القياسية فقط." />
              </div>
              <select
                value={form[activeLocale].robots}
                onChange={e => handleChange(activeLocale, 'robots', e.target.value)}
                className="input input-bordered w-full focus:ring-primary focus:border-primary rounded-md"
              >
                <option value="index, follow">index, follow (افتراضي - فهرسة وتتبع)</option>
                <option value="noindex, follow">noindex, follow (لا تفهرس وتتبع الروابط)</option>
                <option value="index, nofollow">index, nofollow (فهرس ولا تتبع الروابط)</option>
                <option value="noindex, nofollow">noindex, nofollow (لا تفهرس ولا تتبع الروابط)</option>
              </select>
              <span className="text-xs text-muted-foreground">اختر أحد الخيارات القياسية فقط.</span>
            </div>
            {/* openGraphImage */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row items-center gap-2 w-full">
                <label className="font-semibold text-sm text-foreground">Open Graph Image</label>
                <InfoTooltip content="رابط صورة المشاركة (يفضل 1200x630 بكسل) لعرضها بشكل مثالي على وسائل التواصل." />
              </div>
              <Input
                type="url"
                value={form[activeLocale].openGraphImage}
                onChange={e => handleChange(activeLocale, 'openGraphImage', e.target.value)}
                placeholder="Open Graph image URL"
              />
            </div>
            {/* twitterImage */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row items-center gap-2 w-full">
                <label className="font-semibold text-sm text-foreground">Twitter Image</label>
                <InfoTooltip content="رابط صورة مخصصة لبطاقة تويتر (يفضل أن تكون مربعة أو أفقية)." />
              </div>
              <Input
                type="url"
                value={form[activeLocale].twitterImage}
                onChange={e => handleChange(activeLocale, 'twitterImage', e.target.value)}
                placeholder="Twitter image URL"
              />
            </div>
            {/* twitterCardType */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row items-center gap-2 w-full">
                <label className="font-semibold text-sm text-foreground">Twitter Card Type</label>
                <InfoTooltip content="اختر نوع بطاقة تويتر الأكثر شيوعًا. يحدد كيف ستظهر المشاركة عند مشاركتها على تويتر." />
              </div>
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="twitterCardType"
                    value="summary_large_image"
                    checked={form[activeLocale].twitterCardType === 'summary_large_image'}
                    onChange={() => handleChange(activeLocale, 'twitterCardType', 'summary_large_image')}
                    className="accent-primary"
                  />
                  <span className="text-sm">summary_large_image (الأكثر شيوعًا)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="twitterCardType"
                    value="summary"
                    checked={form[activeLocale].twitterCardType === 'summary'}
                    onChange={() => handleChange(activeLocale, 'twitterCardType', 'summary')}
                    className="accent-primary"
                  />
                  <span className="text-sm">summary (ملخص صغير)</span>
                </label>
              </div>
              <span className="text-xs text-muted-foreground">اختر النوع المناسب حسب محتوى المنتج.</span>
            </div>
            {/* schemaOrg */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row items-center gap-2 w-full">
                <label className="font-semibold text-sm text-foreground">Schema.org JSON-LD</label>
                <InfoTooltip content="كود JSON-LD لتعريف بيانات المنتج لمحركات البحث (اختياري، متقدم). إذا لم تكن متأكدًا من كيفية إنشاء هذا الكود، يمكنك تركه فارغًا أو توليد تلقائي." />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  disabled={!productData}
                  onClick={() => {
                    if (!productData) return;
                    const schema = {
                      '@context': 'https://schema.org',
                      '@type': 'Product',
                      name: productData.name || '',
                      description: productData.description || '',
                      image: Array.isArray(productData.images) && productData.images.length > 0
                        ? productData.images[0]
                        : (typeof productData.imageUrl === 'string' ? productData.imageUrl : ''),
                      sku: productData.productCode || '',
                      brand: productData.supplier?.name
                        ? { '@type': 'Brand', name: productData.supplier.name }
                        : undefined,
                      offers: {
                        '@type': 'Offer',
                        price: productData.price != null ? String(productData.price) : '',
                        priceCurrency: productData.priceCurrency || 'SAR',
                        availability: productData.outOfStock
                          ? 'https://schema.org/OutOfStock'
                          : 'https://schema.org/InStock',
                        url: productData.slug ? `https://www.ammawag.com/product/${productData.slug}` : '',
                      },
                      gtin: productData.gtin || undefined,
                      aggregateRating: productData.rating
                        ? {
                          '@type': 'AggregateRating',
                          ratingValue: productData.rating,
                          reviewCount: productData.reviewCount,
                        }
                        : undefined,
                      review: Array.isArray(productData.reviews)
                        ? productData.reviews.map((r: any) => ({
                          '@type': 'Review',
                          reviewRating: { '@type': 'Rating', ratingValue: r.rating },
                          reviewBody: r.comment,
                        }))
                        : undefined,
                    };
                    setForm((prev: any) => ({
                      ...prev,
                      [activeLocale]: {
                        ...prev[activeLocale],
                        schemaOrg: JSON.stringify(schema, null, 2),
                      },
                    }));
                  }}
                >
                  توليد تلقائي
                </Button>
              </div>
              <Textarea
                value={form[activeLocale].schemaOrg}
                onChange={e => handleChange(activeLocale, 'schemaOrg', e.target.value)}
                placeholder={`{
  "@context": "https://schema.org",
  ...
}`}
                className="min-h-[100px] font-mono"
              />
            </div>
          </div>
          <div className="mt-8 w-full flex justify-end">
            <Button type="submit" className="min-w-[140px]" disabled={isLoading}>
              {isLoading ? 'جارٍ الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
