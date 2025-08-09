import { fetchTrackInfo } from '../actions/fetchTrackInfo';
import GoogleMapsButton from '../components/GoogleMapsButton';
import RefreshButton from '../components/RefreshButton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/icons/Icon';

export default async function Page({ params }: { params: Promise<{ orderid: string }> }) {
    const { orderid } = await params;
    const trackInfo = await fetchTrackInfo(orderid);

    // Fallback coordinates if none provided
    const latitude = trackInfo?.latitude || 0;
    const longitude = trackInfo?.longitude || 0;

    // Construct Google Maps URL without API key
    const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;

    if (!trackInfo) {
        return (
            <div className="min-h-screen w-full bg-background p-4 md:p-6">
                <div className="mx-auto max-w-lg w-full">
                    {/* Removed: <BackButton variant="floating" className="mb-6" /> */}

                    <Card className="shadow-xl border-l-4 border-l-feature-commerce card-hover-effect">
                        <CardHeader className="text-center pb-4">
                            <div className="flex justify-center mb-4">
                                <div className="p-4 bg-feature-commerce-soft rounded-full">
                                    <Icon name="AlertCircle" className="h-12 w-12 text-feature-commerce animate-pulse" />
                                </div>
                            </div>
                            <CardTitle className="text-xl text-feature-commerce">لم يبدأ السائق الرحلة بعد</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <p className="text-muted-foreground">
                                سيتم عرض تفاصيل التتبع هنا بمجرد بدء السائق الرحلة.
                            </p>
                            <Badge variant="outline" className="text-feature-commerce border-feature-commerce">
                                في انتظار بدء الرحلة
                            </Badge>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Calculate order status and progress
    // Note: orderStatus is not currently used but may be needed for future features
    const orderStatus = trackInfo?.order?.status || 'pending';
    void orderStatus;
    const isActive = latitude !== 0 && longitude !== 0;

    return (
        <div className="min-h-screen w-full bg-background p-4 md:p-6">
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    {/* Removed: <BackButton variant="gradient" /> */}
                    <div className="flex items-center gap-3">
                        <Badge
                            variant={isActive ? "default" : "secondary"}
                            className={isActive ? "bg-feature-commerce text-white" : ""}
                        >
                            {isActive ? (
                                <>
                                    <Icon name="PlayCircle" className="h-3 w-3 mr-1" />
                                    قيد التتبع
                                </>
                            ) : (
                                <>
                                    <Icon name="Clock" className="h-3 w-3 mr-1" />
                                    في الانتظار
                                </>
                            )}
                        </Badge>
                        <RefreshButton />
                    </div>
                </div>

                {/* Order Header Card */}
                <Card className="shadow-lg border-l-4 border-l-feature-commerce card-hover-effect">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Icon name="Package" className="h-5 w-5 text-feature-commerce icon-enhanced" />
                            طلبية رقم: {trackInfo?.order.orderNumber || 'غير متوفر'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-feature-users-soft">
                                <Icon name="User" className="h-5 w-5 text-feature-users" />
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">العميل</p>
                                    <p className="font-semibold text-feature-users">
                                        {trackInfo?.order.customer?.name || 'غير محدد'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-feature-commerce-soft">
                                <Icon name="DollarSign" className="h-5 w-5 text-feature-commerce" />
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">إجمالي المبلغ</p>
                                    <p className="font-semibold text-feature-commerce">
                                        {trackInfo?.order.amount ? `${trackInfo.order.amount} ريال` : 'غير محدد'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-feature-suppliers-soft">
                                <Icon name="Truck" className="h-5 w-5 text-feature-suppliers" />
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">السائق</p>
                                    <p className="font-semibold text-feature-suppliers">
                                        {trackInfo?.driver.name || 'غير معين'}
                                    </p>
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
                                <Icon name="Truck" className="h-5 w-5 text-feature-suppliers icon-enhanced" />
                                معلومات السائق
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                                    <span className="text-sm text-muted-foreground">اسم السائق</span>
                                    <span className="font-semibold">{trackInfo?.driver.name || 'غير معين'}</span>
                                </div>

                                {trackInfo?.driver.phone && (
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                                        <span className="text-sm text-muted-foreground">رقم الهاتف</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{trackInfo.driver.phone}</span>
                                            <Button variant="outline" size="sm">
                                                <Icon name="Phone" className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {trackInfo?.driver.vehicleType && (
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                                        <span className="text-sm text-muted-foreground">نوع المركبة</span>
                                        <Badge variant="outline">
                                            {trackInfo.driver.vehicleType === 'MOTORCYCLE' && 'دراجة نارية'}
                                            {trackInfo.driver.vehicleType === 'CAR' && 'سيارة'}
                                            {trackInfo.driver.vehicleType === 'VAN' && 'فان'}
                                            {trackInfo.driver.vehicleType === 'TRUCK' && 'شاحنة'}
                                            {trackInfo.driver.vehicleType === 'BICYCLE' && 'دراجة هوائية'}
                                        </Badge>
                                    </div>
                                )}

                                {trackInfo?.driver.vehiclePlateNumber && (
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                                        <span className="text-sm text-muted-foreground">رقم اللوحة</span>
                                        <span className="font-semibold font-mono">
                                            {trackInfo.driver.vehiclePlateNumber}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            <div className="flex items-center justify-center">
                                <Badge
                                    variant={isActive ? "default" : "secondary"}
                                    className={`${isActive ? "bg-green-500 text-white" : "bg-yellow-500 text-white"} px-4 py-2`}
                                >
                                    {isActive ? (
                                        <>
                                            <Icon name="CheckCircle" className="h-4 w-4 mr-2" />
                                            متصل ونشط
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="Clock" className="h-4 w-4 mr-2" />
                                            في الانتظار
                                        </>
                                    )}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Timeline Card */}
                    <Card className="shadow-lg border-l-4 border-l-feature-analytics card-hover-effect">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Icon name="Clock" className="h-5 w-5 text-feature-analytics icon-enhanced" />
                                مراحل الطلبية
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Timeline items */}
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <div>
                                        <p className="font-medium">تم إنشاء الطلبية</p>
                                        <p className="text-xs text-muted-foreground">
                                            {trackInfo?.order.createdAt ? new Date(trackInfo.order.createdAt).toLocaleString('ar-SA') : 'غير محدد'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${trackInfo?.driver ? 'bg-green-500' : 'bg-gray-300'
                                        }`}></div>
                                    <div>
                                        <p className="font-medium">تم تعيين السائق</p>
                                        <p className="text-xs text-muted-foreground">
                                            {trackInfo?.driver ? trackInfo.driver.name : 'لم يتم التعيين بعد'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'
                                        }`}></div>
                                    <div>
                                        <p className="font-medium">بدء الرحلة</p>
                                        <p className="text-xs text-muted-foreground">
                                            {isActive ? 'جاري التوصيل' : 'لم تبدأ بعد'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                    <div>
                                        <p className="font-medium text-muted-foreground">تم التوصيل</p>
                                        <p className="text-xs text-muted-foreground">في انتظار التسليم</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Map Section */}
                <Card className="shadow-lg border-l-4 border-l-feature-analytics card-hover-effect">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Icon name="MapPin" className="h-5 w-5 text-feature-analytics icon-enhanced" />
                            موقع التوصيل المباشر
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {latitude !== 0 && longitude !== 0 ? (
                            <div className="space-y-4">
                                <div className="relative h-96 w-full overflow-hidden rounded-lg border-2 border-border shadow-lg">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        referrerPolicy="no-referrer-when-downgrade"
                                        src={mapUrl}
                                        title="Delivery Location"
                                        className="rounded-lg"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Icon name="Navigation" className="h-4 w-4 text-feature-analytics" />
                                        <span className="text-sm font-medium">الإحداثيات الحالية</span>
                                    </div>
                                    <div className="text-sm font-mono bg-background px-3 py-1 rounded border">
                                        {Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)}
                                    </div>
                                </div>

                                <div className="flex items-center justify-center">
                                    <GoogleMapsButton latitude={Number(latitude)} longitude={Number(longitude)} />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-96 w-full rounded-lg bg-muted border-2 border-dashed border-border">
                                <Icon name="MapPin" className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-center text-muted-foreground mb-2">الموقع غير متوفر</p>
                                <p className="text-center text-sm text-muted-foreground">
                                    سيظهر الموقع المباشر عند بدء السائق بالرحلة
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Order Items Card */}
                {trackInfo?.order.items && trackInfo.order.items.length > 0 && (
                    <Card className="shadow-lg border-l-4 border-l-feature-products card-hover-effect">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Icon name="Package" className="h-5 w-5 text-feature-products icon-enhanced" />
                                محتويات الطلبية ({trackInfo.order.items.length} منتج)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {trackInfo.order.items.map((item: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-feature-products rounded-full"></div>
                                            <div>
                                                <p className="font-medium">{item.product?.name || 'منتج غير محدد'}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    الكمية: {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-feature-products">
                                                {item.price ? `${item.price} ريال` : 'غير محدد'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
} 