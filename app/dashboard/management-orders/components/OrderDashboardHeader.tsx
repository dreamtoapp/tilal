'use client';
import { useMemo } from 'react';
import { Icon } from '@/components/icons/Icon';

import Link from '@/components/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface OrderDashboardHeaderProps {
    initialFilter: string;
    totalOrders: number;
    pendingOrders: number;
    deliveredOrders: number;
    inWaydOrders: number;
    cancelOrders: number;
}

const OrderDashboardHeader = function OrderDashboardHeader({
    initialFilter,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    inWaydOrders,
    cancelOrders,
}: OrderDashboardHeaderProps) {

    // Calculate performance metrics
    const metrics = useMemo(() => {
        if (totalOrders === 0) return {
            deliveryRate: 0,
            pendingRate: 0,
            cancellationRate: 0,
            inTransitRate: 0
        };

        return {
            deliveryRate: Math.round((deliveredOrders / totalOrders) * 100),
            pendingRate: Math.round((pendingOrders / totalOrders) * 100),
            cancellationRate: Math.round((cancelOrders / totalOrders) * 100),
            inTransitRate: Math.round((inWaydOrders / totalOrders) * 100)
        };
    }, [totalOrders, pendingOrders, deliveredOrders, inWaydOrders, cancelOrders]);

    // Enhanced card style with hover animations - removed scale to prevent scroll issues
    const cardStyle = 'flex flex-col items-center justify-center gap-2 p-4';

    // Status cards data with enhanced styling
    const statusCards = [
        {
            title: 'إجمالي الطلبات',
            value: totalOrders,
            href: '/dashboard/management-orders',
            icon: 'Package',
            borderColor: 'border-l-feature-commerce',
            textColor: 'text-feature-commerce',
            bgColor: 'bg-feature-commerce-soft',
            iconColor: 'text-feature-commerce',
            filter: 'All',
            description: 'جميع الطلبات المسجلة',
            percentage: 100
        },
        {
            title: 'قيد الانتظار',
            value: pendingOrders,
            href: '?status=Pending',
            icon: 'MousePointerBan',
            borderColor: 'border-l-yellow-500',
            textColor: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            iconColor: 'text-yellow-500',
            filter: 'Pending',
            description: 'طلبات تحتاج معالجة',
            percentage: metrics.pendingRate
        },
        {
            title: 'في الطريق',
            value: inWaydOrders,
            href: '?status=InWay',
            icon: 'Truck',
            borderColor: 'border-l-blue-500',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-500',
            filter: 'InWay',
            description: 'طلبات قيد التوصيل',
            percentage: metrics.inTransitRate
        },
        {
            title: 'تم التسليم',
            value: deliveredOrders,
            href: '?status=Delivered',
            icon: 'CheckCircle',
            borderColor: 'border-l-green-500',
            textColor: 'text-green-600',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-500',
            filter: 'Delivered',
            description: 'طلبات مكتملة بنجاح',
            percentage: metrics.deliveryRate
        },
        {
            title: 'ملغي',
            value: cancelOrders,
            href: '?status=canceled',
            icon: 'X',
            borderColor: 'border-l-red-500',
            textColor: 'text-red-600',
            bgColor: 'bg-red-50',
            iconColor: 'text-red-500',
            filter: 'Cancelled',
            description: 'طلبات تم إلغاؤها',
            percentage: metrics.cancellationRate
        }
    ];

    // Performance insights
    const getPerformanceInsight = () => {
        if (metrics.deliveryRate >= 80) {
            return { type: 'success', message: 'أداء ممتاز في التسليم!', icon: 'CheckCircle' };
        } else if (metrics.pendingRate >= 50) {
            return { type: 'warning', message: 'يوجد عدد كبير من الطلبات المعلقة', icon: 'AlertTriangle' };
        } else if (metrics.cancellationRate >= 20) {
            return { type: 'error', message: 'معدل الإلغاء مرتفع - يحتاج مراجعة', icon: 'X' };
        }
        return { type: 'info', message: 'الأداء ضمن المعدل الطبيعي', icon: 'Info' };
    };

    const insight = getPerformanceInsight();

    return (
        <div className="space-y-4">
            {/* Status Cards */}
            <Card className="shadow-lg border-l-4 border-l-feature-commerce">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon name="Calendar" className="h-5 w-5 text-feature-commerce icon-enhanced" />
                        حالة الطلبات
                        {totalOrders > 0 && (
                            <Badge variant="outline" className="ml-auto">
                                إجمالي: {totalOrders} طلب
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {statusCards.map((card) => (
                            <Tooltip key={card.filter}>
                                <TooltipTrigger asChild>
                                    <Link href={card.href}>
                                        <Card
                                            className={`
                                                cursor-pointer shadow-md border-l-4 ${card.borderColor} 
                                                ${initialFilter === card.filter ? `${card.bgColor} shadow-xl` : ''}
                                            `}
                                        >
                                            <CardContent className={cardStyle}>
                                                <div className="flex items-center gap-2 w-full">
                                                    <div className={`p-2 rounded-lg ${card.bgColor}`}>
                                                        <Icon name={card.icon} className={`h-4 w-4 ${card.iconColor} icon-enhanced`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-medium text-muted-foreground">
                                                            {card.title}
                                                        </p>
                                                        <p className={`text-xl font-bold ${card.textColor}`}>
                                                            {card.value}
                                                        </p>
                                                    </div>
                                                </div>

                                                {card.filter !== 'All' && totalOrders > 0 && (
                                                    <div className="w-full space-y-1">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="text-muted-foreground">النسبة</span>
                                                            <span className={`font-semibold ${card.textColor}`}>
                                                                {card.percentage}%
                                                            </span>
                                                        </div>
                                                        <Progress
                                                            value={card.percentage}
                                                            className="h-1"
                                                        />
                                                    </div>
                                                )}

                                                {initialFilter === card.filter && (
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <div className={`h-1.5 w-1.5 rounded-full ${card.iconColor.replace('text-', 'bg-')} animate-pulse`} />
                                                        <span>العرض الحالي</span>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="text-center">
                                        <p className="font-semibold">{card.title}</p>
                                        <p className="text-sm text-muted-foreground">{card.description}</p>
                                        {card.filter !== 'All' && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {card.percentage}% من إجمالي الطلبات
                                            </p>
                                        )}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Performance Overview Card - Compact */}
            <Card className="shadow-lg border-l-4 border-l-feature-analytics">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon name="TrendingUp" className="h-5 w-5 text-feature-analytics icon-enhanced" />
                        نظرة عامة على الأداء
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">معدل التسليم</span>
                                <Badge variant={metrics.deliveryRate >= 80 ? "default" : "secondary"} className="text-xs">
                                    {metrics.deliveryRate}%
                                </Badge>
                            </div>
                            <Progress value={metrics.deliveryRate} className="h-1.5" />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">قيد المعالجة</span>
                                <Badge variant={metrics.pendingRate >= 50 ? "destructive" : "outline"} className="text-xs">
                                    {metrics.pendingRate}%
                                </Badge>
                            </div>
                            <Progress value={metrics.pendingRate} className="h-1.5" />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">في التوصيل</span>
                                <Badge variant="outline" className="text-xs">
                                    {metrics.inTransitRate}%
                                </Badge>
                            </div>
                            <Progress value={metrics.inTransitRate} className="h-1.5" />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">معدل الإلغاء</span>
                                <Badge variant={metrics.cancellationRate >= 20 ? "destructive" : "outline"} className="text-xs">
                                    {metrics.cancellationRate}%
                                </Badge>
                            </div>
                            <Progress value={metrics.cancellationRate} className="h-1.5" />
                        </div>
                    </div>

                    {/* Performance Insight */}
                    <Alert className={`border-${insight.type === 'success' ? 'green' : insight.type === 'warning' ? 'yellow' : insight.type === 'error' ? 'red' : 'blue'}-200 py-2`}>
                        <Icon name={insight.icon} className="h-4 w-4" />
                        <AlertDescription className="text-sm">{insight.message}</AlertDescription>
                    </Alert>

                    {/* Quick Actions Hint */}
                    <Alert className="border-feature-analytics/30 py-2">
                        <Icon name="Clock" className="h-4 w-4 text-feature-analytics" />
                        <AlertDescription className="text-xs">
                            <strong>نصيحة:</strong> انقر على أي بطاقة للتصفية حسب حالة الطلب. استخدم البحث أعلاه للعثور على طلبات محددة بسرعة.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrderDashboardHeader; 