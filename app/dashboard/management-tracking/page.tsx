import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import Link from '@/components/link';

export default function ManagementTrackingPage() {
    return (
        <div className="min-h-screen w-full bg-background p-4 md:p-6">
            <div className="mx-auto max-w-6xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">إدارة التتبع</h1>
                            <p className="text-muted-foreground">تتبع ومراقبة الطلبات في الوقت الفعلي</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="btn-view-outline">
                            <Icon name="Search" className="h-4 w-4 mr-2" />
                            بحث
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="shadow-lg border-l-4 border-l-feature-commerce card-hover-effect">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">قيد التتبع</p>
                                    <p className="text-2xl font-bold text-feature-commerce">24</p>
                                </div>
                                <Icon name="MapPin" className="h-8 w-8 text-feature-commerce" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-l-4 border-l-feature-suppliers card-hover-effect">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">السائقين النشطين</p>
                                    <p className="text-2xl font-bold text-feature-suppliers">8</p>
                                </div>
                                <Icon name="Truck" className="h-8 w-8 text-feature-suppliers" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-l-4 border-l-feature-products card-hover-effect">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
                                    <p className="text-2xl font-bold text-feature-products">156</p>
                                </div>
                                <Icon name="Package" className="h-8 w-8 text-feature-products" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-l-4 border-l-feature-analytics card-hover-effect">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">متوسط التسليم</p>
                                    <p className="text-2xl font-bold text-feature-analytics">35 دقيقة</p>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-feature-analytics-soft flex items-center justify-center">
                                    <span className="text-feature-analytics font-bold">⏱</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Active Tracking List */}
                <Card className="shadow-lg border-l-4 border-l-feature-commerce card-hover-effect">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Icon name="MapPin" className="h-5 w-5 text-feature-commerce icon-enhanced" />
                            الطلبات قيد التتبع
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Sample tracking entries */}
                            {[
                                { id: '682901b03eb14d5595ae2ad5', orderNumber: 'ORD-2024-001', driver: 'أحمد محمد', status: 'active', customer: 'سارة أحمد' },
                                { id: '682901b03eb14d5595ae2ad6', orderNumber: 'ORD-2024-002', driver: 'محمد علي', status: 'waiting', customer: 'فاطمة محمد' },
                                { id: '682901b03eb14d5595ae2ad7', orderNumber: 'ORD-2024-003', driver: 'علي حسن', status: 'active', customer: 'عبدالله أحمد' },
                            ].map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:shadow-md transition-all duration-150">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${order.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                                            }`}></div>
                                        <div>
                                            <p className="font-semibold">{order.orderNumber}</p>
                                            <p className="text-sm text-muted-foreground">العميل: {order.customer}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">السائق</p>
                                            <p className="font-medium">{order.driver}</p>
                                        </div>

                                        <Badge
                                            variant={order.status === 'active' ? 'default' : 'secondary'}
                                            className={order.status === 'active' ? 'bg-feature-commerce text-white' : ''}
                                        >
                                            {order.status === 'active' ? 'نشط' : 'في الانتظار'}
                                        </Badge>

                                        <Link href={`/dashboard/management-tracking/${order.id}`}>
                                            <Button variant="outline" size="sm" className="btn-view-outline">
                                                <Icon name="Eye" className="h-4 w-4 mr-1" />
                                                تتبع
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty state for when no tracking data */}
                        <div className="text-center py-12 text-muted-foreground">
                            <Icon name="MapPin" className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                            <p className="text-lg font-medium mb-2">لا توجد طلبات قيد التتبع حالياً</p>
                            <p className="text-sm">ستظهر الطلبات هنا عند بدء السائقين برحلاتهم</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 