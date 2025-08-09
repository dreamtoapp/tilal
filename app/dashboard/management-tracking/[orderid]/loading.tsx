import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/icons/Icon';

export default function Loading() {
    return (
        <div className="min-h-screen w-full bg-background p-4 md:p-6">
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="animate-pulse">
                            <Icon name="PlayCircle" className="h-3 w-3 mr-1" />
                            <Skeleton className="h-4 w-16" />
                        </Badge>
                        <Button variant="outline" size="sm" className="btn-view-outline" disabled>
                            <Icon name="RefreshCw" className="h-4 w-4 mr-1" />
                            تحديث
                        </Button>
                    </div>
                </div>

                {/* Order Header Card */}
                <Card className="shadow-lg border-l-4 border-l-feature-commerce card-hover-effect">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Icon name="Package" className="h-5 w-5 text-feature-commerce/50 animate-pulse icon-enhanced" />
                            <Skeleton className="h-6 w-48" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-feature-users-soft/50">
                                <Icon name="User" className="h-5 w-5 text-feature-users/50 animate-pulse" />
                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground font-medium">العميل</p>
                                    <Skeleton className="h-5 w-24" />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-feature-commerce-soft/50">
                                <Icon name="DollarSign" className="h-5 w-5 text-feature-commerce/50 animate-pulse" />
                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground font-medium">إجمالي المبلغ</p>
                                    <Skeleton className="h-5 w-20" />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-feature-suppliers-soft/50">
                                <Icon name="Truck" className="h-5 w-5 text-feature-suppliers/50 animate-pulse" />
                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground font-medium">السائق</p>
                                    <Skeleton className="h-5 w-28" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Driver Information Card */}
                    <Card className="shadow-lg border-l-4 border-l-feature-suppliers card-hover-effect">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Icon name="Truck" className="h-5 w-5 text-feature-suppliers/50 animate-pulse icon-enhanced" />
                                معلومات السائق
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <span className="text-sm text-muted-foreground">
                                            <Skeleton className="h-4 w-20" />
                                        </span>
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            <div className="flex items-center justify-center">
                                <Badge variant="secondary" className="px-4 py-2 animate-pulse">
                                    <Icon name="Clock" className="h-4 w-4 mr-2" />
                                    <Skeleton className="h-4 w-20" />
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Timeline Card */}
                    <Card className="shadow-lg border-l-4 border-l-feature-analytics card-hover-effect">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Icon name="Clock" className="h-5 w-5 text-feature-analytics/50 animate-pulse icon-enhanced" />
                                مراحل الطلبية
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"></div>
                                        <div className="space-y-1">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Map Section */}
                <Card className="shadow-lg border-l-4 border-l-feature-analytics card-hover-effect">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Icon name="MapPin" className="h-5 w-5 text-feature-analytics/50 animate-pulse icon-enhanced" />
                            موقع التوصيل المباشر
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="relative h-96 w-full overflow-hidden rounded-lg border-2 border-border">
                                <div className="flex flex-col items-center justify-center h-full bg-muted/50">
                                    <Icon name="MapPin" className="h-12 w-12 text-muted-foreground/50 mb-4 animate-pulse" />
                                    <Skeleton className="h-4 w-32 mb-2" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 bg-feature-analytics/50 rounded animate-pulse"></div>
                                    <span className="text-sm font-medium">الإحداثيات الحالية</span>
                                </div>
                                <div className="text-sm font-mono bg-background/50 px-3 py-1 rounded border">
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>

                            <div className="flex items-center justify-center">
                                <Button className="btn-view-outline" disabled>
                                    <div className="h-4 w-4 mr-2 bg-current rounded animate-pulse"></div>
                                    فتح في خرائط جوجل
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Order Items Card */}
                <Card className="shadow-lg border-l-4 border-l-feature-products card-hover-effect">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Icon name="Package" className="h-5 w-5 text-feature-products/50 animate-pulse icon-enhanced" />
                            <span>محتويات الطلبية</span>
                            <Skeleton className="h-6 w-16" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-feature-products/50 rounded-full animate-pulse"></div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 