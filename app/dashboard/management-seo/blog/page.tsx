// app/dashboard/seo/blog/page.tsx

import { EntityType } from '@prisma/client';

import { getSeoEntryByEntity } from '../actions/seo';
import UniversalSeoForm from '../home/components/HomeSeoForm';
import { upsertBlogSeo } from './actions/blog-seo-actions';

export default async function SeoBlogPage() {
  // Fetch both locales for blog page
  const arEntry = await getSeoEntryByEntity('blogpage', EntityType.PAGE, 'ar-SA');
  const enEntry = await getSeoEntryByEntity('blogpage', EntityType.PAGE, 'en-US');

  // Compose defaultValues for UniversalSeoForm
  const defaultValues = {
    ar: {
      entityId: arEntry?.entityId || 'blogpage',
      metaTitle: arEntry?.metaTitle || '',
      metaDescription: arEntry?.metaDescription || '',
      entityType: arEntry?.entityType || EntityType.PAGE,
      canonicalUrl: arEntry?.canonicalUrl || '',
      robots: arEntry?.robots || 'index, follow',
      openGraphTitle: arEntry?.openGraphTitle || '',
      openGraphDescription: arEntry?.openGraphDescription || '',
      openGraphImage: arEntry?.openGraphImage || '',
      twitterImage: arEntry?.twitterImage || '',
      schemaOrg: arEntry?.schemaOrg ? JSON.stringify(arEntry?.schemaOrg, null, 2) : '',
      twitterCardType: arEntry?.twitterCardType || 'summary_large_image',
    },
    en: {
      entityId: enEntry?.entityId || 'blogpage',
      metaTitle: enEntry?.metaTitle || '',
      metaDescription: enEntry?.metaDescription || '',
      entityType: enEntry?.entityType || EntityType.PAGE,
      canonicalUrl: enEntry?.canonicalUrl || '',
      robots: enEntry?.robots || 'index, follow',
      openGraphTitle: enEntry?.openGraphTitle || '',
      openGraphDescription: enEntry?.openGraphDescription || '',
      openGraphImage: enEntry?.openGraphImage || '',
      twitterImage: enEntry?.twitterImage || '',
      schemaOrg: enEntry?.schemaOrg ? JSON.stringify(enEntry?.schemaOrg, null, 2) : '',
      twitterCardType: enEntry?.twitterCardType || 'summary_large_image',
    },
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">إدارة SEO صفحة المدونة</h1>
      <p className="mb-6 text-muted-foreground">يمكنك هنا تعديل جميع إعدادات السيو لصفحة المدونة: العنوان والوصف وبيانات Schema.org وغيرها. جميع الحقول مطلوبة لتحسين ظهور الموقع في نتائج البحث.</p>
      <UniversalSeoForm
        defaultValues={defaultValues}
        mode={arEntry || enEntry ? 'edit' : 'create'}
        pageName="blogpage"
        upsertAction={upsertBlogSeo}
      />
    </div>
  );
}
