// app/dashboard/seo/home/page.tsx

import { EntityType } from '@prisma/client';

import { getSeoEntryByEntity } from '../actions/seo';
import { upsertHomeSeo } from './actions/home-seo-actions';
import HomeSeoForm from './components/HomeSeoForm';

export default async function SeoHomePage() {
  // Fetch both locales for homepage
  const arEntry = await getSeoEntryByEntity('home', EntityType.PAGE, 'ar-SA');
  const enEntry = await getSeoEntryByEntity('home', EntityType.PAGE, 'en-US');

  // Compose defaultValues for HomeSeoForm
  const defaultValues = {
    ar: {
      entityId: arEntry?.entityId || 'home',
      metaTitle: arEntry?.metaTitle || '',
      metaDescription: arEntry?.metaDescription || '',
      entityType: arEntry?.entityType || EntityType.PAGE,
      openGraphTitle: arEntry?.openGraphTitle || '',
      openGraphDescription: arEntry?.openGraphDescription || '',
      canonicalUrl: arEntry?.canonicalUrl || '',
      robots: arEntry?.robots || 'index, follow',
      openGraphImage: arEntry?.openGraphImage || '',
      twitterImage: arEntry?.twitterImage || '',
      schemaOrg: arEntry?.schemaOrg ? (typeof arEntry.schemaOrg === 'string' ? arEntry.schemaOrg : JSON.stringify(arEntry.schemaOrg, null, 2)) : '',
      twitterCardType: arEntry?.twitterCardType || 'summary_large_image',
    },
    en: {
      entityId: enEntry?.entityId || 'home',
      metaTitle: enEntry?.metaTitle || '',
      metaDescription: enEntry?.metaDescription || '',
      entityType: enEntry?.entityType || EntityType.PAGE,
      openGraphTitle: enEntry?.openGraphTitle || '',
      openGraphDescription: enEntry?.openGraphDescription || '',
      canonicalUrl: enEntry?.canonicalUrl || '',
      robots: enEntry?.robots || 'index, follow',
      openGraphImage: enEntry?.openGraphImage || '',
      twitterImage: enEntry?.twitterImage || '',
      schemaOrg: enEntry?.schemaOrg ? (typeof enEntry.schemaOrg === 'string' ? enEntry.schemaOrg : JSON.stringify(enEntry.schemaOrg, null, 2)) : '',
      twitterCardType: enEntry?.twitterCardType || 'summary_large_image',
    },
    shared: {
      robots: arEntry?.robots || enEntry?.robots || 'index, follow',
      canonicalUrl: arEntry?.canonicalUrl || enEntry?.canonicalUrl || '',
      openGraphImage: arEntry?.openGraphImage || enEntry?.openGraphImage || '',
      twitterImage: arEntry?.twitterImage || enEntry?.twitterImage || '',
      schemaOrg: (arEntry?.schemaOrg || enEntry?.schemaOrg) ? (typeof (arEntry?.schemaOrg || enEntry?.schemaOrg) === 'string' ? (arEntry?.schemaOrg || enEntry?.schemaOrg) : JSON.stringify(arEntry?.schemaOrg || enEntry?.schemaOrg, null, 2)) : '',
      twitterCardType: arEntry?.twitterCardType || enEntry?.twitterCardType || 'summary_large_image',
    },
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">إدارة SEO الصفحة الرئيسية</h1>
      <p className="mb-6 text-muted-foreground">يمكنك هنا تعديل جميع إعدادات السيو للصفحة الرئيسية: العنوان والوصف وبيانات Schema.org وغيرها. جميع الحقول مطلوبة لتحسين ظهور الموقع في نتائج البحث.</p>
      <HomeSeoForm
        defaultValues={defaultValues}
        mode={arEntry || enEntry ? 'edit' : 'create'}
        pageName="الصفحة الرئيسية"
        upsertAction={upsertHomeSeo}
      />
    </div>
  );
}
