import { redirect } from 'next/navigation';
import { fetchCompany } from './actions/fetchCompany';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Receipt, Share2, Palette, Settings } from 'lucide-react';
import Link from 'next/link';

export default async function SettingsPage() {
  const companyData = await fetchCompany();

  // Redirect to company profile by default
  redirect('/dashboard/management/settings/company-profile');

  // This code won't execute due to redirect, but keeping for fallback
  const settingsSections = [
    {
      id: 'company-profile',
      title: 'معلومات الشركة',
      description: 'البيانات الأساسية للشركة والاتصال',
      icon: Building2,
      href: '/dashboard/management/settings/company-profile',
      isComplete: !!(companyData?.fullName && companyData?.email && companyData?.phoneNumber),
    },
    {
      id: 'location',
      title: 'الموقع والعنوان',
      description: 'العنوان الفعلي وإحداثيات الموقع',
      icon: MapPin,
      href: '/dashboard/management/settings/location',
      isComplete: !!(companyData?.address && companyData?.latitude && companyData?.longitude),
    },
    {
      id: 'tax-info',
      title: 'المعلومات الضريبية',
      description: 'الرقم الضريبي ورمز QR',
      icon: Receipt,
      href: '/dashboard/management/settings/tax-info',
      isComplete: !!(companyData?.taxNumber),
    },
    {
      id: 'social-media',
      title: 'الروابط الاجتماعية',
      description: 'روابط وسائل التواصل الاجتماعي',
      icon: Share2,
      href: '/dashboard/management/settings/social-media',
      isComplete: !!(companyData?.facebook || companyData?.instagram || companyData?.twitter),
    },
    {
      id: 'branding',
      title: 'الشعار والهوية',
      description: 'الشعار والهوية البصرية',
      icon: Palette,
      href: '/dashboard/management/settings/branding',
      isComplete: !!(companyData?.logo),
    },
    {
      id: 'platform',
      title: 'إعدادات المنصة',
      description: 'إعدادات عامة للمنصة',
      icon: Settings,
      href: '/dashboard/management/settings/platform',
      isComplete: false,
    },
  ];

  const completedSections = settingsSections.filter(section => section.isComplete).length;
  const totalSections = settingsSections.length;
  const completionPercentage = Math.round((completedSections / totalSections) * 100);

  return (
    <div className="container mx-auto bg-background p-6 text-foreground" dir="rtl">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">إعدادات المنصة</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          إدارة جميع إعدادات منصتك من مكان واحد
        </p>
      </div>

      {/* Progress Overview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">تقدم الإعدادات</h2>
          <span className="text-sm text-muted-foreground">
            {completedSections} من {totalSections} مكتمل
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {completionPercentage}% مكتمل
        </p>
      </div>

      {/* Settings Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <Card key={section.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${section.isComplete ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                  {section.isComplete && (
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {section.description}
                </p>
                <Link href={section.href}>
                  <Button
                    variant={section.isComplete ? "outline" : "default"}
                    className="w-full"
                  >
                    {section.isComplete ? 'تعديل' : 'إعداد'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
