import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Icon } from '@/components/icons/Icon';
import Link from '@/components/link';

import OrderAnalyticsDashboard from '../../components/OrderAnalyticsDashboard';
import type { GetOrderAnalyticsResult, OrderAnalyticsData } from '../../actions/get-order-analytics';

interface OrderAnalyticsViewProps {
    analyticsResult: GetOrderAnalyticsResult;
}

export default function OrderAnalyticsView({
    analyticsResult
}: OrderAnalyticsViewProps) {
    // Extract analytics data from result
    const analyticsData: OrderAnalyticsData = analyticsResult.success ? analyticsResult.data! : {
        totalOrders: 0,
        ordersByStatus: [],
        totalRevenue: 0,
        todayOrdersByStatus: [],
        unfulfilledOrders: 0,
        returnsCount: 0,
        salesTrends: [],
        topProducts: [],
        topCustomers: []
    };

    // Calculate performance metrics
    const totalOrders = analyticsData.totalOrders || 0;
    const pendingOrders = analyticsData.ordersByStatus?.find(s => s.status === 'PENDING')?._count?.status || 0;
    const deliveredOrders = analyticsData.ordersByStatus?.find(s => s.status === 'DELIVERED')?._count?.status || 0;
    const inWaydOrders = analyticsData.ordersByStatus?.find(s => s.status === 'IN_TRANSIT')?._count?.status || 0;
    const cancelOrders = analyticsData.ordersByStatus?.find(s => s.status === 'CANCELED')?._count?.status || 0;

    const deliveryRate = totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;
    const pendingRate = totalOrders > 0 ? Math.round((pendingOrders / totalOrders) * 100) : 0;
    const cancellationRate = totalOrders > 0 ? Math.round((cancelOrders / totalOrders) * 100) : 0;
    const inTransitRate = totalOrders > 0 ? Math.round((inWaydOrders / totalOrders) * 100) : 0;

    // Performance insights
    const getPerformanceInsight = () => {
        if (deliveryRate >= 80) {
            return { type: 'success', message: 'أداء ممتاز في التسليم!', icon: 'CheckCircle' };
        } else if (pendingRate >= 50) {
            return { type: 'warning', message: 'يوجد عدد كبير من الطلبات المعلقة', icon: 'AlertTriangle' };
        } else if (cancellationRate >= 20) {
            return { type: 'error', message: 'معدل الإلغاء مرتفع - يحتاج مراجعة', icon: 'X' };
        }
        return { type: 'info', message: 'الأداء ضمن المعدل الطبيعي', icon: 'Info' };
    };

    const insight = getPerformanceInsight();

    // Status cards data
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
            description: 'جميع الطلبات المسجلة',
            percentage: 100
        },
        {
            title: 'قيد الانتظار',
            value: pendingOrders,
            href: '/dashboard/management-orders?status=PENDING',
            icon: 'MousePointerBan',
            borderColor: 'border-l-yellow-500',
            textColor: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            iconColor: 'text-yellow-500',
            description: 'طلبات تحتاج معالجة',
            percentage: pendingRate
        },
        {
            title: 'في الطريق',
            value: inWaydOrders,
            href: '/dashboard/management-orders?status=IN_TRANSIT',
            icon: 'Truck',
            borderColor: 'border-l-blue-500',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-500',
            description: 'طلبات قيد التوصيل',
            percentage: inTransitRate
        },
        {
            title: 'تم التسليم',
            value: deliveredOrders,
            href: '/dashboard/management-orders?status=DELIVERED',
            icon: 'CheckCircle',
            borderColor: 'border-l-green-500',
            textColor: 'text-green-600',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-500',
            description: 'طلبات مكتملة بنجاح',
            percentage: deliveryRate
        },
        {
            title: 'ملغي',
            value: cancelOrders,
            href: '/dashboard/management-orders?status=CANCELED',
            icon: 'X',
            borderColor: 'border-l-red-500',
            textColor: 'text-red-600',
            bgColor: 'bg-red-50',
            iconColor: 'text-red-500',
            description: 'طلبات تم إلغاؤها',
            percentage: cancellationRate
        }
    ];

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-feature-analytics rounded-full"></div>
                <h1 className="text-3xl font-bold text-foreground">تحليلات الطلبات المتقدمة</h1>
            </div>

            {/* Performance Insight Alert */}
            <Alert className={`border-l-4 border-l-${insight.type === 'success' ? 'green' : insight.type === 'warning' ? 'yellow' : insight.type === 'error' ? 'red' : 'blue'}-500`}>
                <Icon name={insight.icon} className="h-4 w-4" />
                <AlertDescription className="font-medium">
                    {insight.message}
                </AlertDescription>
            </Alert>

            {/* Status Cards Section */}
            <Card className="shadow-lg border-l-4 border-l-feature-analytics">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon name="Calendar" className="h-5 w-5 text-feature-analytics icon-enhanced" />
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
                        {statusCards.map((card, index) => (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <Link href={card.href}>
                                        <Card className={`cursor-pointer shadow-md border-l-4 ${card.borderColor} hover:shadow-lg transition-shadow`}>
                                            <CardContent className="flex flex-col items-center justify-center gap-2 p-4">
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

                                                {card.title !== 'إجمالي الطلبات' && totalOrders > 0 && (
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
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{card.description}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Analytics Dashboard */}
            <Card className="shadow-lg border-l-4 border-l-feature-analytics card-hover-effect">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Icon name="BarChart3" className="h-5 w-5 text-feature-analytics icon-enhanced" />
                        التقارير والإحصائيات التفصيلية
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <OrderAnalyticsDashboard analyticsData={analyticsResult} />
                </CardContent>
            </Card>
        </div>
    );
} 