"use client";
import React from "react";
import Image from 'next/image';
import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { unassignOrder } from '../actions/unassign-order';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export default function AssignedOrdersView({ drivers }: { drivers: any[] }) {
    const [removingOrderId, setRemovingOrderId] = React.useState<string | null>(null);
    const [localDrivers, setLocalDrivers] = React.useState(drivers);
    const [viewOrder, setViewOrder] = React.useState<any | null>(null);
    const [unassignOrderId, setUnassignOrderId] = React.useState<string | null>(null);
    const [notification, setNotification] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleUnassign = async (orderId: string) => {
        setRemovingOrderId(orderId);
        try {
            const res = await unassignOrder(orderId);
            if (res.success) {
                setLocalDrivers((prev) => prev.map(driver => ({
                    ...driver,
                    driverOrders: driver.driverOrders.filter((o: any) => o.id !== orderId)
                })));
                setNotification({ type: 'success', message: 'تمت إزالة الطلب من السائق بنجاح!' });
            } else {
                setNotification({ type: 'error', message: 'حدث خطأ أثناء إزالة الطلب: ' + (res.error || '') });
            }
        } catch (error) {
            setNotification({ type: 'error', message: 'حدث خطأ غير متوقع أثناء إزالة الطلب' });
        }
        setRemovingOrderId(null);
        setUnassignOrderId(null);

        // Auto-hide notification after 3 seconds
        setTimeout(() => setNotification(null), 3000);
    };

    if (!localDrivers.length || localDrivers.every(d => !d.driverOrders.length)) {
        return <div className="text-center text-muted-foreground py-10">لا توجد طلبات مُخصصة لأي سائق حالياً.</div>;
    }

    return (
        <>
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border ${notification.type === 'success'
                    ? 'bg-green-500/90 text-white border-green-600'
                    : 'bg-red-500/90 text-white border-red-600'
                    }`}>
                    <div className="flex items-center gap-2">
                        <Icon
                            name={notification.type === 'success' ? 'CheckCircle' : 'XCircle'}
                            className="h-5 w-5"
                        />
                        <span>{notification.message}</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localDrivers.filter(d => d.driverOrders.length).map(driver => (
                    <Card key={driver.id} className="shadow-lg border-l-4 border-l-feature-analytics">
                        <CardHeader className="flex flex-row items-center gap-3 pb-2">
                            {driver.image && <Image src={driver.image} alt={driver.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover border" />}
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Icon name="UserCheck" className="h-5 w-5 text-feature-analytics" />
                                {driver.name || 'سائق بدون اسم'}
                            </CardTitle>
                            <Badge className="ml-auto bg-feature-analytics-soft text-feature-analytics">{driver.driverOrders.length} طلب</Badge>
                        </CardHeader>
                        <CardContent>
                            <Separator className="mb-3" />
                            <ul className="space-y-3 max-h-96 overflow-y-auto pr-1">
                                <Accordion type="single" collapsible className="flex flex-col gap-y-3">
                                    {driver.driverOrders.map((order: any) => (
                                        <AccordionItem value={order.id} key={order.id} className="border-none bg-transparent p-0 mb-3">
                                            <div className="bg-gradient-to-br from-background/80 to-muted/30 rounded-xl p-3 border border-border/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-border/60 flex items-center justify-between gap-2">
                                                <AccordionTrigger className="flex-1 text-right min-w-0">
                                                    <div className="flex flex-col gap-1 min-w-0">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <div className="w-2 h-2 bg-status-pending rounded-full animate-pulse shrink-0"></div>
                                                            <span className="font-bold text-foreground text-xl truncate">طلب #{order.orderNumber}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Icon name="DollarSign" className="h-4 w-4 text-status-pending" />
                                                            <span className="text-lg font-semibold text-status-pending">{order.amount} ر.س</span>
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                                <div className="flex gap-2 items-center ml-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="p-2.5 hover:bg-feature-analytics-soft hover:border-feature-analytics text-feature-analytics transition-all duration-200"
                                                        onClick={e => { e.stopPropagation(); setViewOrder(order); }}
                                                    >
                                                        <Icon name="FileText" className="h-4 w-4 text-feature-analytics" />
                                                    </Button>
                                                    <AlertDialog open={unassignOrderId === order.id} onOpenChange={(open) => !open && setUnassignOrderId(null)}>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="p-2.5 hover:bg-feature-analytics-soft hover:border-feature-analytics text-feature-analytics transition-all duration-200"
                                                                disabled={removingOrderId === order.id}
                                                                onClick={e => { e.stopPropagation(); setUnassignOrderId(order.id); }}
                                                            >
                                                                <Icon name="Undo" className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className="flex items-center gap-2">
                                                                    <Icon name="UserX" className="h-5 w-5 text-destructive" />
                                                                    إزالة الطلب من السائق
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    هل أنت متأكد من إزالة الطلب من السائق؟ سيعود الطلب إلى قائمة قيد الانتظار.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleUnassign(order.id)}
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                >
                                                                    إزالة
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                            <AccordionContent className="pt-4">
                                                {/* Minimal Customer Information */}
                                                <div className="bg-gradient-to-r from-feature-users-soft/50 to-feature-users-soft/30 rounded-lg p-4 border border-feature-users/30 flex items-center gap-3 mb-3">
                                                    <div className="p-1.5 bg-feature-users-soft rounded-lg">
                                                        <Icon name="User" className="h-5 w-5 text-feature-users" />
                                                    </div>
                                                    <span className="font-semibold text-feature-users text-base">{order.customer?.name || 'غير محدد'}</span>
                                                </div>
                                                {/* Address Information with Enhanced Design */}
                                                {order.address && (
                                                    <div className="bg-gradient-to-r from-feature-products-soft/50 to-feature-products-soft/30 rounded-lg p-4 border border-feature-products/30">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="p-1.5 bg-feature-products-soft rounded-lg">
                                                                    <Icon name="MapPin" className="h-4 w-4 text-feature-products" />
                                                                </div>
                                                                {order.address.label && (
                                                                    <Badge variant="outline" className="text-xs bg-feature-products-soft text-feature-products border-feature-products font-medium">
                                                                        {order.address.label}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {/* Enhanced Google Maps Link */}
                                                            {order.address.latitude && order.address.longitude && (
                                                                <a
                                                                    href={`https://www.google.com/maps?q=${order.address.latitude},${order.address.longitude}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-1.5 text-xs bg-feature-products text-white px-3 py-1.5 rounded-lg hover:bg-feature-products/90 transition-all duration-200 shadow-sm"
                                                                >
                                                                    <Icon name="ExternalLink" className="h-3 w-3" />
                                                                    فتح في الخرائط
                                                                </a>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex items-center gap-3 p-2 bg-background/50 rounded-md">
                                                                <span className="text-muted-foreground font-medium min-w-[80px]">الحي:</span>
                                                                <span className="font-semibold text-feature-products">{order.address.district || 'غير محدد'}</span>
                                                            </div>
                                                            {order.address.street && (
                                                                <div className="flex items-center gap-3 p-2 bg-background/50 rounded-md">
                                                                    <span className="text-muted-foreground font-medium min-w-[80px]">الشارع:</span>
                                                                    <span className="font-semibold text-feature-products">{order.address.street}</span>
                                                                </div>
                                                            )}
                                                            {order.address.buildingNumber && (
                                                                <div className="flex items-center gap-3 p-2 bg-background/50 rounded-md">
                                                                    <span className="text-muted-foreground font-medium min-w-[80px]">رقم المبنى:</span>
                                                                    <span className="font-semibold text-feature-products">{order.address.buildingNumber}</span>
                                                                </div>
                                                            )}
                                                            {order.address.floor && (
                                                                <div className="flex items-center gap-3 p-2 bg-background/50 rounded-md">
                                                                    <span className="text-muted-foreground font-medium min-w-[80px]">الطابق:</span>
                                                                    <span className="font-semibold text-feature-products">{order.address.floor}</span>
                                                                </div>
                                                            )}
                                                            {order.address.apartmentNumber && (
                                                                <div className="flex items-center gap-3 p-2 bg-background/50 rounded-md">
                                                                    <span className="text-muted-foreground font-medium min-w-[80px]">رقم الشقة:</span>
                                                                    <span className="font-semibold text-feature-products">{order.address.apartmentNumber}</span>
                                                                </div>
                                                            )}
                                                            {order.address.landmark && (
                                                                <div className="flex items-center gap-3 p-2 bg-background/50 rounded-md">
                                                                    <span className="text-muted-foreground font-medium min-w-[80px]">معلم:</span>
                                                                    <span className="font-semibold text-feature-products">{order.address.landmark}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {/* Order Details Dialog */}
            <Dialog open={!!viewOrder} onOpenChange={open => !open && setViewOrder(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Icon name="FileText" className="h-5 w-5 text-feature-analytics" />
                            تفاصيل الطلب
                        </DialogTitle>
                    </DialogHeader>
                    {viewOrder && (
                        <div className="space-y-3 text-right">
                            <div>
                                <span className="font-bold">رقم الطلب:</span> {viewOrder.orderNumber}
                            </div>
                            <div>
                                <span className="font-bold">العميل:</span> {viewOrder.customer?.name || '—'}
                            </div>
                            <div>
                                <span className="font-bold">المبلغ:</span> {viewOrder.amount} ر.س
                            </div>
                            <div>
                                <span className="font-bold">العنوان:</span> {viewOrder.address?.district || ''} {viewOrder.address?.street ? '، ' + viewOrder.address.street : ''}
                            </div>
                            <div>
                                <span className="font-bold">الأصناف:</span>
                                <ul className="list-disc pr-5 mt-1">
                                    {viewOrder.items?.map((item: any, idx: number) => (
                                        <li key={idx} className="text-sm">
                                            {item.product?.name || 'صنف'} × {item.quantity} - {item.price} ر.س
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <DialogClose asChild>
                                <Button className="mt-4 w-full" variant="outline">إغلاق</Button>
                            </DialogClose>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
} 