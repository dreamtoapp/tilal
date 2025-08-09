// UniversalSeoForm.tsx
'use client';

import React, {
  useActionState,
  useState,
} from 'react';

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
import { EntityType } from '@prisma/client';

export type UniversalSeoFormProps = {
  defaultValues: {
    ar: {
      entityId: string;
      metaTitle: string;
      metaDescription: string;
      entityType: EntityType;
      canonicalUrl: string;
      robots: string;
      openGraphTitle: string;
      openGraphDescription: string;
      openGraphImage: string;
      twitterImage: string;
      schemaOrg: string;
      twitterCardType: string;
    };
    en: {
      entityId: string;
      metaTitle: string;
      metaDescription: string;
      entityType: EntityType;
      canonicalUrl: string;
      robots: string;
      openGraphTitle: string;
      openGraphDescription: string;
      openGraphImage: string;
      twitterImage: string;
      schemaOrg: string;
      twitterCardType: string;
    };
  };
  mode: 'edit' | 'create';
  pageName: string;
  upsertAction: (data: any) => Promise<any>;
};

export default function UniversalSeoForm({ defaultValues, mode, pageName, upsertAction }: UniversalSeoFormProps) {
  const safeDefaults = React.useMemo(() => ({
    ar: {
      entityId: defaultValues?.ar?.entityId ?? '',
      metaTitle: defaultValues?.ar?.metaTitle ?? '',
      metaDescription: defaultValues?.ar?.metaDescription ?? '',
      entityType: defaultValues?.ar?.entityType ?? 'HOME',
      canonicalUrl: defaultValues?.ar?.canonicalUrl ?? '',
      robots: defaultValues?.ar?.robots ?? 'index, follow',
      openGraphTitle: defaultValues?.ar?.openGraphTitle ?? '',
      openGraphDescription: defaultValues?.ar?.openGraphDescription ?? '',
      openGraphImage: defaultValues?.ar?.openGraphImage ?? '',
      twitterImage: defaultValues?.ar?.twitterImage ?? '',
      schemaOrg: defaultValues?.ar?.schemaOrg ?? '',
      twitterCardType: defaultValues?.ar?.twitterCardType ?? 'summary_large_image',
    },
    en: {
      entityId: defaultValues?.en?.entityId ?? '',
      metaTitle: defaultValues?.en?.metaTitle ?? '',
      metaDescription: defaultValues?.en?.metaDescription ?? '',
      entityType: defaultValues?.en?.entityType ?? 'HOME',
      canonicalUrl: defaultValues?.en?.canonicalUrl ?? '',
      robots: defaultValues?.en?.robots ?? 'index, follow',
      openGraphTitle: defaultValues?.en?.openGraphTitle ?? '',
      openGraphDescription: defaultValues?.en?.openGraphDescription ?? '',
      openGraphImage: defaultValues?.en?.openGraphImage ?? '',
      twitterImage: defaultValues?.en?.twitterImage ?? '',
      schemaOrg: defaultValues?.en?.schemaOrg ?? '',
      twitterCardType: defaultValues?.en?.twitterCardType ?? 'summary_large_image',
    },
    shared: {
      robots: defaultValues?.ar?.robots ?? 'index, follow',
      canonicalUrl: defaultValues?.ar?.canonicalUrl ?? '',
      openGraphImage: defaultValues?.ar?.openGraphImage ?? '',
      twitterImage: defaultValues?.ar?.twitterImage ?? '',
      schemaOrg: defaultValues?.ar?.schemaOrg ?? '',
      twitterCardType: defaultValues?.ar?.twitterCardType ?? 'summary_large_image',
    },
  }), [defaultValues]);

  const [form, setForm] = useState(safeDefaults);

  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      const getString = (fd: FormData, key: string) => (fd.get(key) ?? '').toString();
      const shared = {
        robots: getString(formData, 'shared-robots'),
        canonicalUrl: getString(formData, 'shared-canonicalUrl'),
        openGraphImage: getString(formData, 'shared-openGraphImage'),
        twitterImage: getString(formData, 'shared-twitterImage'),
        schemaOrg: getString(formData, 'shared-schemaOrg'),
        twitterCardType: getString(formData, 'shared-twitterCardType'),
      };
      const ar = {
        ...form.ar,
        metaTitle: getString(formData, 'ar-metaTitle'),
        metaDescription: getString(formData, 'ar-metaDescription'),
        openGraphTitle: getString(formData, 'ar-openGraphTitle'),
        openGraphDescription: getString(formData, 'ar-openGraphDescription'),
        ...shared,
        locale: 'ar-SA',
      };
      const en = {
        ...form.en,
        metaTitle: getString(formData, 'en-metaTitle'),
        metaDescription: getString(formData, 'en-metaDescription'),
        openGraphTitle: getString(formData, 'en-openGraphTitle'),
        openGraphDescription: getString(formData, 'en-openGraphDescription'),
        ...shared,
        locale: 'en-US',
      };
      if (!ar.metaTitle || !en.metaTitle) {
        return { success: false, error: 'يجب تعبئة عنوان الصفحة (metaTitle) لكل لغة.' };
      }
      if (!ar.metaDescription || !en.metaDescription) {
        return { success: false, error: 'يجب تعبئة وصف الصفحة (metaDescription) لكل لغة.' };
      }
      const arResult = await upsertAction(ar);
      const enResult = await upsertAction(en);
      if (arResult.success && enResult.success) {
        return { success: true };
      }
      return { success: false, error: arResult.error || enResult.error };
    },
    { success: false, error: undefined }
  );

  const handleChange = (
    locale: 'ar' | 'en',
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const name = e.target.name.replace(`${locale}-`, '');
    setForm((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        [name]: e.target.value,
      },
    }));
  };

  const handleSharedChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      shared: {
        ...prev.shared,
        [e.target.name]: e.target.value,
      },
    }));
  };

  const handleSharedRadioChange = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      shared: {
        ...prev.shared,
        [name]: value,
      },
    }));
  };

  const renderFields = (locale: 'ar' | 'en', label: string) => (
    <div className="space-y-8">
      <h3 className="text-lg font-bold text-foreground mb-2">{label}</h3>
      {/* metaTitle */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row items-center gap-2 w-full">
          <label htmlFor={`${locale}-metaTitle`} className="font-semibold text-sm text-foreground">عنوان الصفحة <span className="text-red-500">*</span></label>
          <InfoTooltip content="العنوان الرئيسي للصفحة كما يظهر في نتائج البحث. يجب أن يكون فريدًا وجذابًا ويحتوي على الكلمات المفتاحية الأساسية." />
        </div>
        <Input
          id={`${locale}-metaTitle`}
          name={`${locale}-metaTitle`}
          type="text"
          required
          maxLength={120}
          value={form[locale].metaTitle}
          onChange={e => handleChange(locale, e)}
          placeholder={locale === 'ar' ? 'مثال: أفضل متجر إلكتروني في السعودية' : 'e.g. Best Online Store in Saudi Arabia'}
          autoComplete="off"
        />
        <span className="text-xs text-muted-foreground">120 حرف كحد أقصى</span>
      </div>
      {/* metaDescription */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row items-center gap-2 w-full">
          <label htmlFor={`${locale}-metaDescription`} className="font-semibold text-sm text-foreground">وصف الصفحة <span className="text-red-500">*</span></label>
          <InfoTooltip content="وصف مختصر للصفحة يظهر أسفل العنوان في نتائج البحث. يجب أن يكون مشوقًا ويوضح محتوى الصفحة." />
        </div>
        <Textarea
          id={`${locale}-metaDescription`}
          name={`${locale}-metaDescription`}
          required
          maxLength={320}
          value={form[locale].metaDescription}
          onChange={e => handleChange(locale, e)}
          placeholder={locale === 'ar' ? 'وصف مختصر وجذاب للصفحة الرئيسية...' : 'Short and catchy homepage description...'}
          className="min-h-[80px]"
          autoComplete="off"
        />
        <span className="text-xs text-muted-foreground">320 حرف كحد أقصى</span>
      </div>
      {/* openGraphTitle */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row items-center gap-2 w-full">
          <label htmlFor={`${locale}-openGraphTitle`} className="font-semibold text-sm text-foreground">عنوان Open Graph</label>
          <InfoTooltip content="العنوان الذي يظهر عند مشاركة الصفحة على وسائل التواصل الاجتماعي (فيسبوك، تويتر، إلخ)." />
        </div>
        <Input
          id={`${locale}-openGraphTitle`}
          name={`${locale}-openGraphTitle`}
          type="text"
          value={form[locale].openGraphTitle}
          onChange={e => handleChange(locale, e)}
          placeholder={locale === 'ar' ? 'عنوان المشاركة على وسائل التواصل الاجتماعي' : 'Social share title'}
          autoComplete="off"
        />
      </div>
      {/* openGraphDescription */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row items-center gap-2 w-full">
          <label htmlFor={`${locale}-openGraphDescription`} className="font-semibold text-sm text-foreground">وصف Open Graph</label>
          <InfoTooltip content="وصف مختصر يظهر عند مشاركة الصفحة على وسائل التواصل الاجتماعي." />
        </div>
        <Input
          id={`${locale}-openGraphDescription`}
          name={`${locale}-openGraphDescription`}
          type="text"
          value={form[locale].openGraphDescription}
          onChange={e => handleChange(locale, e)}
          placeholder={locale === 'ar' ? 'وصف المشاركة على وسائل التواصل الاجتماعي' : 'Social share description'}
          autoComplete="off"
        />
      </div>
    </div>
  );

  const renderSharedFields = () => (
    <div className="space-y-8">
      <h3 className="text-lg font-bold text-foreground mb-2">الحقول المشتركة (Shared Fields)</h3>
      {/* robots */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row items-center gap-2 w-full">
          <label htmlFor="shared-robots" className="font-semibold text-sm text-foreground">Robots</label>
          <InfoTooltip content="تعليمات لمحركات البحث حول كيفية فهرسة الصفحة. اختر من الخيارات القياسية فقط. هذا الخيار مشترك بين جميع اللغات." />
        </div>
        <select
          id="shared-robots"
          name="shared-robots"
          value={form.shared.robots}
          onChange={handleSharedChange}
          className="input input-bordered w-full focus:ring-primary focus:border-primary rounded-md"
        >
          <option value="index, follow">index, follow (افتراضي - فهرسة وتتبع)</option>
          <option value="noindex, follow">noindex, follow (لا تفهرس وتتبع الروابط)</option>
          <option value="index, nofollow">index, nofollow (فهرس ولا تتبع الروابط)</option>
          <option value="noindex, nofollow">noindex, nofollow (لا تفهرس ولا تتبع الروابط)</option>
        </select>
        <span className="text-xs text-muted-foreground">اختر أحد الخيارات القياسية فقط.</span>
      </div>
      {/* canonicalUrl */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row items-center gap-2 w-full">
          <label htmlFor="shared-canonicalUrl" className="font-semibold text-sm text-foreground">Canonical URL</label>
          <InfoTooltip content="الرابط الأساسي للصفحة لمنع تكرار المحتوى في محركات البحث. اتركه فارغًا إذا لم تكن متأكدًا. هذا الحقل مشترك بين جميع اللغات." />
        </div>
        <Input
          id="shared-canonicalUrl"
          name="shared-canonicalUrl"
          type="url"
          value={form.shared.canonicalUrl}
          onChange={handleSharedChange}
          placeholder="https://www.ammawag.com/"
        />
      </div>
      {/* openGraphImage */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row items-center gap-2 w-full">
          <label htmlFor="shared-openGraphImage" className="font-semibold text-sm text-foreground">رابط صورة Open Graph</label>
          <InfoTooltip content="رابط صورة المشاركة (يفضل 1200x630 بكسل) لعرضها بشكل مثالي على وسائل التواصل. هذا الحقل مشترك بين جميع اللغات." />
        </div>
        <Input
          id="shared-openGraphImage"
          name="shared-openGraphImage"
          type="url"
          value={form.shared.openGraphImage}
          onChange={handleSharedChange}
          placeholder="Open Graph image URL"
        />
      </div>
      {/* twitterImage */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row items-center gap-2 w-full">
          <label htmlFor="shared-twitterImage" className="font-semibold text-sm text-foreground">رابط صورة تويتر</label>
          <InfoTooltip content="رابط صورة مخصصة لبطاقة تويتر (يفضل أن تكون مربعة أو أفقية). هذا الحقل مشترك بين جميع اللغات." />
        </div>
        <Input
          id="shared-twitterImage"
          name="shared-twitterImage"
          type="url"
          value={form.shared.twitterImage}
          onChange={handleSharedChange}
          placeholder="Twitter image URL"
        />
      </div>
      {/* twitterCardType (shared) */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row items-center gap-2 w-full">
          <label className="font-semibold text-sm text-foreground">نوع بطاقة تويتر</label>
          <InfoTooltip content="اختر نوع بطاقة تويتر الأكثر شيوعًا. يحدد كيف ستظهر المشاركة عند مشاركتها على تويتر. هذا الخيار مشترك بين جميع اللغات." />
        </div>
        <div className="flex gap-6 mt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="shared-twitterCardType"
              value="summary_large_image"
              checked={form.shared.twitterCardType === 'summary_large_image'}
              onChange={() => handleSharedRadioChange('twitterCardType', 'summary_large_image')}
              className="accent-primary"
            />
            <span className="text-sm">summary_large_image (الأكثر شيوعًا)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="shared-twitterCardType"
              value="summary"
              checked={form.shared.twitterCardType === 'summary'}
              onChange={() => handleSharedRadioChange('twitterCardType', 'summary')}
              className="accent-primary"
            />
            <span className="text-sm">summary (ملخص صغير)</span>
          </label>
        </div>
        <span className="text-xs text-muted-foreground">اختر النوع المناسب حسب محتوى الصفحة. هذا الخيار مشترك بين جميع اللغات.</span>
      </div>
      {/* schemaOrg */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row items-center gap-2 w-full">
          <label htmlFor="shared-schemaOrg" className="font-semibold text-sm text-foreground">Schema.org JSON-LD</label>
          <InfoTooltip content="كود JSON-LD لتعريف بيانات الصفحة لمحركات البحث (اختياري، متقدم). إذا لم تكن متأكدًا من كيفية إنشاء هذا الكود، يمكنك تركه فارغًا أو الضغط على زر 'توليد تلقائي' وسنقوم بإنشائه لك بناءً على بيانات متجرك الإلكتروني." />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={() => {
              setForm((prev) => ({
                ...prev,
                shared: {
                  ...prev.shared,
                  schemaOrg: `{
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "${form.ar.metaTitle || 'متجر إلكتروني'}",
  "description": "${form.ar.metaDescription || 'أفضل متجر إلكتروني في السعودية'}",
  "url": "${form.shared.canonicalUrl || 'https://www.ammawag.com/'}",
  "image": "${form.shared.openGraphImage || ''}"
}`
                }
              }));
            }}
          >
            توليد تلقائي
          </Button>
        </div>
        <Textarea
          id="shared-schemaOrg"
          name="shared-schemaOrg"
          value={form.shared.schemaOrg}
          onChange={handleSharedChange}
          placeholder={`{
  "@context": "https://schema.org",
  ...
}`}
          className="min-h-[100px] font-mono"
        />
      </div>
    </div>
  );

  return (
    <form className="w-full max-w-3xl mx-auto flex flex-col gap-8" action={formAction} autoComplete="off">
      <Card className="bg-background border border-border shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">الحقول المشتركة (Shared Fields)</CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            هذه الحقول تُطبق على جميع اللغات تلقائيًا.
          </CardDescription>
          <div className="mt-2 p-3 bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-400 dark:border-yellow-700 rounded-md flex items-center gap-2">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-yellow-600 dark:text-yellow-300"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0ZM12 7v.01" /></svg>
            <span className="text-sm text-yellow-800 dark:text-yellow-200">تنبيه: عند الحفظ سيتم استبدال جميع بيانات السيو الحالية لهذه الصفحة ({pageName}) ولن يتم إنشاء نسخة جديدة. إذا كانت هناك بيانات سابقة، سيتم تحديثها مباشرة.</span>
          </div>
        </CardHeader>
        <CardContent>
          {renderSharedFields()}
        </CardContent>
      </Card>
      <Card className="bg-background border border-border shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">اللغة العربية (ar-SA)</CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            جميع الحقول مطلوبة لتحسين ظهور الموقع في نتائج البحث باللغة العربية.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderFields('ar', 'اللغة العربية (ar-SA)')}
        </CardContent>
      </Card>
      <Card className="bg-background border border-border shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">English (en-US)</CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            All fields are required to optimize your site for search engines in English.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderFields('en', 'English (en-US)')}
        </CardContent>
      </Card>
      <div className="mt-8 w-full flex justify-end">
        <Button type="submit" className="min-w-[140px]" disabled={isPending}>
          {isPending ? 'جارٍ الحفظ...' : mode === 'edit' ? 'تحديث' : 'حفظ'}
        </Button>
        {state.success && <span className="text-green-600 text-sm mt-2 ml-4">تم الحفظ بنجاح للغتين.</span>}
        {state.error && <span className="text-red-600 text-sm mt-2 ml-4">{state.error}</span>}
      </div>
    </form>
  );
}
