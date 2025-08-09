import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';

interface ProductFormFallbackProps {
    errorMessage: string;
    hasCategories: boolean;
    hasSuppliers: boolean;
}

export default function ProductFormFallback({
    errorMessage,
    hasCategories,
    hasSuppliers
}: ProductFormFallbackProps) {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-500">
            {/* Error Alert */}
            <Alert variant="destructive" className="card-hover-effect">
                <Icon name="AlertTriangle" className="h-4 w-4 icon-enhanced" />
                <AlertTitle>لا يمكن إنشاء منتج جديد</AlertTitle>
                <AlertDescription className="mt-2 animate-in slide-in-from-left-2 duration-300">
                    {errorMessage}
                </AlertDescription>
            </Alert>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Categories Status Card */}
                <Card className={`shadow-lg border-l-4 card-hover-effect card-border-glow transition-all duration-300 ${hasCategories
                    ? 'border-l-feature-products bg-feature-products-soft/5'
                    : 'border-l-destructive bg-destructive/5'
                    }`}>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Icon name="Tag" className={`h-5 w-5 icon-enhanced ${hasCategories ? 'text-feature-products' : 'text-destructive'
                                }`} />
                            <span>فئات المنتجات</span>
                            <div className={`w-3 h-3 rounded-full animate-pulse ${hasCategories ? 'bg-feature-products' : 'bg-destructive'
                                }`} />
                        </CardTitle>
                        <CardDescription>
                            {hasCategories
                                ? 'الفئات متوفرة ويمكن استخدامها ✓'
                                : 'لا توجد فئات متاحة. يجب إضافة فئة واحدة على الأقل'}
                        </CardDescription>
                    </CardHeader>

                    {!hasCategories && (
                        <CardContent>
                            <Button asChild variant="outline" size="sm" className="btn-edit-outline btn-professional">
                                <Link href="/dashboard/management-categories">
                                    <Icon name="Settings" className="w-4 h-4 me-2 icon-enhanced" />
                                    إدارة الفئات
                                </Link>
                            </Button>
                        </CardContent>
                    )}
                </Card>

                {/* Suppliers Status Card */}
                <Card className={`shadow-lg border-l-4 card-hover-effect card-border-glow transition-all duration-300 ${hasSuppliers
                    ? 'border-l-feature-suppliers bg-feature-suppliers-soft/5'
                    : 'border-l-feature-settings bg-feature-settings-soft/5'
                    }`}>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Icon name="Building2" className={`h-5 w-5 icon-enhanced ${hasSuppliers ? 'text-feature-suppliers' : 'text-feature-settings'
                                }`} />
                            <span>الموردين</span>
                            <div className={`w-3 h-3 rounded-full animate-pulse ${hasSuppliers ? 'bg-feature-suppliers' : 'bg-feature-settings'
                                }`} />
                        </CardTitle>
                        <CardDescription>
                            {hasSuppliers
                                ? 'الموردين متوفرين ويمكن استخدامهم ✓'
                                : 'لا توجد موردين. يمكن إضافة منتج بدون مورد ولكن يُفضل إضافة موردين'}
                        </CardDescription>
                    </CardHeader>

                    {!hasSuppliers && (
                        <CardContent>
                            <Button asChild variant="outline" size="sm" className="btn-edit-outline btn-professional">
                                <Link href="/dashboard/management-suppliers">
                                    <Icon name="Settings" className="w-4 h-4 me-2 icon-enhanced" />
                                    إدارة الموردين
                                </Link>
                            </Button>
                        </CardContent>
                    )}
                </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="flex items-center gap-2 btn-view-outline btn-professional"
                >
                    <Icon name="RefreshCw" className="w-4 h-4 icon-enhanced" />
                    إعادة المحاولة
                </Button>

                <Button asChild variant="outline" className="btn-cancel-outline btn-professional">
                    <Link href="/dashboard/management-products">
                        العودة لقائمة المنتجات
                    </Link>
                </Button>
            </div>

            {/* Help Section */}
            <Card className="shadow-lg border-l-4 border-l-feature-analytics card-hover-effect">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon name="HelpCircle" className="h-5 w-5 text-feature-analytics icon-enhanced" />
                        تحتاج مساعدة؟
                    </CardTitle>
                </CardHeader>
                <CardContent className="bg-feature-analytics-soft/10">
                    <p className="text-sm text-muted-foreground mb-4">
                        لإنشاء منتج جديد، تحتاج إلى:
                    </p>
                    <div className="grid gap-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card card-hover-effect">
                            <Icon name="Tag" className="h-4 w-4 text-feature-products icon-enhanced" />
                            <span className="text-sm">فئة واحدة على الأقل (مطلوبة)</span>
                            <div className={`ml-auto w-2 h-2 rounded-full ${hasCategories ? 'bg-feature-products' : 'bg-destructive'}`} />
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card card-hover-effect">
                            <Icon name="Building2" className="h-4 w-4 text-feature-suppliers icon-enhanced" />
                            <span className="text-sm">مورد واحد على الأقل (مُستحسن)</span>
                            <div className={`ml-auto w-2 h-2 rounded-full ${hasSuppliers ? 'bg-feature-suppliers' : 'bg-feature-settings'}`} />
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card card-hover-effect">
                            <Icon name="Settings" className="h-4 w-4 text-feature-settings icon-enhanced" />
                            <span className="text-sm">اتصال فعال بقاعدة البيانات</span>
                            <div className="ml-auto w-2 h-2 rounded-full bg-feature-products" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 