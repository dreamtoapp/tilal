import InfoTooltip from '@/components/InfoTooltip';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { EntityType } from '@prisma/client';

import { getSeoEntryByEntity } from './actions/seo';

const PAGES = [
  { name: 'الصفحة الرئيسية', entityId: 'home', editUrl: '/dashboard/seo/home' },
  { name: 'من نحن', entityId: 'about', editUrl: '/dashboard/seo/about' },
  { name: 'المدونة', entityId: 'blog', editUrl: '/dashboard/seo/blog' },
] as const;
const LOCALES = [
  { code: 'ar-SA', label: 'العربية' },
  { code: 'en-US', label: 'English' },
] as const;

type SeoStatusResult = {
  entityId: string;
  locale: string;
  hasMetaTitle: boolean;
  hasMetaDescription: boolean;
};

async function fetchSeoStatuses(): Promise<SeoStatusResult[]> {
  // Fetch SEO status for each page and locale
  const results = await Promise.all(
    PAGES.flatMap((page) =>
      LOCALES.map(async (locale) => {
        const entry = await getSeoEntryByEntity(page.entityId, EntityType.PAGE, locale.code);
        return {
          entityId: page.entityId,
          locale: locale.code,
          hasMetaTitle: !!entry?.metaTitle,
          hasMetaDescription: !!entry?.metaDescription,
        };
      })
    )
  );
  return results;
}

export default async function SeoDashboardPage() {
  const statuses = await fetchSeoStatuses();

  return (
    <div>
      <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center mb-4">
        <div className="flex gap-2 flex-wrap justify-end">
          <a href="/dashboard/seo/guide" target="_blank" rel="noopener noreferrer">
            <Button variant="outline">دليل تحسين محركات البحث (SEO)</Button>
          </a>
        </div>
      </div>
      <div className="mb-6 p-4 rounded-lg bg-muted flex items-center gap-3">
        <Icon name="Info" className="text-primary w-6 h-6 shrink-0" />
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary mb-1">لوحة إدارة SEO للصفحات الرئيسية</h1>
          <p className="text-muted-foreground text-sm">
            تحقق من حالة السيو للصفحات الرئيسية (الرئيسية، من نحن، المدونة) لكل لغة. اضغط على زر التعديل لتحديث البيانات
            باستخدام النموذج الموحد الجديد.
          </p>
        </div>
      </div>
      <section>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-xl bg-card shadow">
            <thead>
              <tr className="bg-muted text-foreground">
                <th className="p-3 text-right font-semibold">الصفحة</th>
                {LOCALES.map((locale) => (
                  <th key={locale.code} className="p-3 text-center font-semibold">
                    {locale.label}
                  </th>
                ))}
                <th className="p-3 text-center font-semibold">تعديل</th>
              </tr>
            </thead>
            <tbody>
              {PAGES.map((page) => {
                const arStatus = statuses.find((s) => s.entityId === page.entityId && s.locale === 'ar-SA');
                const enStatus = statuses.find((s) => s.entityId === page.entityId && s.locale === 'en-US');
                return (
                  <tr key={page.entityId} className="border-b last:border-b-0">
                    <td className="p-3 font-medium text-right">{page.name}</td>
                    {[arStatus, enStatus].map((status, idx) => {
                      const missing: string[] = [];
                      if (!status?.hasMetaTitle) missing.push('عنوان Meta');
                      if (!status?.hasMetaDescription) missing.push('وصف Meta');
                      return (
                        <td key={idx} className="p-3 text-center">
                          {status?.hasMetaTitle && status?.hasMetaDescription ? (
                            <span className="inline-flex items-center gap-1 text-success-foreground">
                              <Icon name="CheckCircle" className="w-5 h-5" /> مكتمل
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-warning-foreground">
                              <Icon name="AlertTriangle" className="w-5 h-5" />
                              ناقص
                              <span className="ml-1">
                                <InfoTooltip content={`الحقول الناقصة: ${missing.join('، ')}`} />
                              </span>
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-3 text-center">
                      <a href={page.editUrl}>
                        <Button variant="secondary">تعديل</Button>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      {/* Pixel & Analytics Section */}
      <section className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <span className="font-bold text-primary text-lg">إعدادات البيكسل والتحليلات</span>
          <InfoTooltip content="قم بإدارة أكواد التتبع والتحليلات لجميع المنصات المدعومة من مكان واحد. يدعم Google Analytics, Facebook Pixel, TikTok Pixel, Snapchat Pixel, Pinterest Tag, LinkedIn Insight." />
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <a href="/dashboard/seo/pixels">
            <Button variant="outline">إدارة أكواد البيكسل والتحليلات</Button>
          </a>
        </div>
        <div className="text-xs text-muted-foreground">
          يمكنك ربط Google Analytics, Facebook Pixel, TikTok Pixel, Snapchat Pixel, Pinterest Tag, LinkedIn Insight بسهولة من خلال صفحة الإعدادات المخصصة.
        </div>
      </section>
    </div>
  );
}
