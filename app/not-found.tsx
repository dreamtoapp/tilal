'use client';

import Link from '@/components/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-muted/60 flex items-center justify-center p-4">
      <div className="container max-w-4xl">
        {/* Enhanced Back Button */}


        {/* Main 404 Card */}
        <Card className="shadow-xl border-l-8 border-l-feature-settings card-hover-effect card-border-glow overflow-hidden">
          <CardHeader className="pb-6 text-center relative">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 h-32 w-32 bg-feature-settings-soft rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 h-24 w-24 bg-feature-analytics-soft rounded-full opacity-20 transform -translate-x-12 translate-y-12"></div>

            <CardTitle className="flex flex-col items-center gap-4 text-3xl relative z-10">
              {/* Enhanced Error Icon */}
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-feature-settings-soft flex items-center justify-center animate-pulse">
                  <Icon name="AlertTriangle" className="h-12 w-12 text-feature-settings icon-enhanced" />
                </div>
                {/* <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 text-xs font-bold animate-bounce"
                >
                  404
                </Badge> */}
              </div>

              <div className="space-y-2">
                <h1 className="text-feature-settings font-bold">لم نجد الصفحة التي تبحث عنها</h1>
                <p className="text-lg text-muted-foreground font-normal">
                  لا تقلق! ربما تم نقل الصفحة أو لم تعد متوفرة، لكن كل شيء على ما يرام. يمكنك العودة للصفحة الرئيسية أو استكشاف المتجر.
                </p>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Error Description */}


            {/* Action Buttons */}
            <div className="flex  items-center justify-center gap-4 w-full ">
              {/* Primary Actions */}
              <Card className="shadow-md border-l-4 border-l-feature-analytics card-hover-effect w-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg w-full">
                    <Icon name="Home" className="h-5 w-5 text-feature-analytics icon-enhanced" />
                    العودة للرئيسية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href="/">
                    <Button className="btn-professional w-full bg-feature-analytics hover:bg-feature-analytics/90">
                      <Icon name="Home" className="h-4 w-4 ml-2" />
                      العودة إلى المتجر
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Secondary Actions */}

            </div>

            {/* Quick Links */}
            <div className="text-center pt-2 text-sm text-muted-foreground">
              أو استكشف <Link href="/">الصفحة الرئيسية</Link> أو <Link href="/categories">الأقسام</Link> للعثور على ما تحتاجه.
            </div>

            {/* Technical Actions */}
            {/* Removed technical language to keep the tone friendly */}

          </CardContent>
        </Card>

        {/* Footer Help Text with CTA */}
        <Card className="mt-6 shadow-md border-l-4 border-l-feature-commerce card-hover-effect">
          <CardContent className="py-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                إذا احتجت لأي مساعدة، فريقنا هنا دائمًا لدعمك بكل سرور!
              </p>

              <div className="flex items-center justify-center gap-3">
                <Link href="/contact">
                  <Button className="btn-add">
                    <Icon name="HelpCircle" className="h-4 w-4 ml-2" />
                    تواصل مع الدعم
                  </Button>
                </Link>


              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  استجابة خلال 24 ساعة
                </Badge>
                <Badge variant="outline" className="text-xs">
                  دعم فني متخصص
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
