"use client";
import { Card, CardHeader, CardFooter } from '../../../components/ui/card';
import { Icon } from '@/components/icons/Icon';
import CancelOrder from '../components/CancelOrder';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { setOrderInTransit } from '../actions/setOrderInTransit';

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import WhatsappShareButton from '@/components/WhatsappShareButton';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { debug } from '@/utils/logger';

function AssignedOrderHeader({ order, onStartTrip, alertOpen, setAlertOpen, alertMessage }: any) {
    return (
        <CardHeader className='flex items-center flex-row p-2 justify-between rounded-t-lg bg-muted w-full'>
            <div className='flex items-center gap-2'>
                <Icon name="FileText" size="sm" className="text-info" />
                <span className='text-sm font-medium text-primary-foreground'> {order.orderNumber}</span>
            </div>
            <div>
                {order.status === 'ASSIGNED' && (
                    <>
                        <Button size='lg' className='text-lg' variant='default' onClick={onStartTrip}>
                            <Icon name="Rocket" size="sm" className="ml-2" /> بدء الرحلة
                        </Button>
                        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                            <AlertDialogContent dir="rtl">
                                <AlertDialogHeader className="text-right">
                                    <AlertDialogTitle className="text-red-600 flex items-center gap-2">
                                        <Icon name="AlertTriangle" className="text-red-600" />
                                        رحلة نشطة موجودة
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-right">
                                        {alertMessage || 'لديك رحلة نشطة بالفعل. يرجى إنهاء أو تسليم الرحلة الحالية أولاً.'}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="justify-end">
                                    <AlertDialogCancel autoFocus>إغلاق</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </>
                )}
            </div>
        </CardHeader>
    );
}

function AssignedOrderDetails({ order }: any) {
    return (
        <Collapsible>
            <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between w-full cursor-pointer bg-muted/60 rounded px-3 py-2">
                    <span className="font-bold text-base">إجمالي الطلب: {order.amount ?? 'غير متوفر'}</span>
                    <Icon name="ChevronDown" size="sm" className="text-muted-foreground" />
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className='mt-3 p-2 rounded bg-background border border-border text-xs text-muted-foreground'>
                    {Array.isArray(order.items) && order.items.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-xs text-right border border-border rounded">
                                <thead>
                                    <tr className="bg-muted/40">
                                        <th className="px-2 py-1">المنتج</th>
                                        <th className="px-2 py-1">الكمية</th>
                                        <th className="px-2 py-1">السعر للوحدة</th>
                                        <th className="px-2 py-1">الإجمالي</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item: any, idx: number) => (
                                        <tr key={item.productId || idx} className="border-t border-border">
                                            <td className="px-2 py-1">{item.product?.name || 'غير محدد'}</td>
                                            <td className="px-2 py-1">{item.quantity}</td>
                                            <td className="px-2 py-1">{item.price}</td>
                                            <td className="px-2 py-1">{(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div>لا توجد منتجات في هذا الطلب.</div>
                    )}
                    {order.createdAt && (
                        <div className='mt-1'>تاريخ الإنشاء: {new Date(order.createdAt).toLocaleString('ar-EG')}</div>
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

function AssignedOrderAddress({ order }: any) {
    return (
        <div className='flex flex-col gap-1 bg-muted/40 rounded p-2 mt-1 text-sm font-normal'>
            <div className='flex items-center gap-2'>
                <Icon name="MapPin" size="sm" className='text-info h-4 w-4' />
                <span className='font-bold'>العنوان:</span>
                <span className='text-sm'>{order.address?.label || ''}</span>
            </div>
            {order.address?.district && (
                <div className='flex items-center gap-2'><Icon name="Home" size="xs" className='text-muted-foreground h-4 w-4 ' /><span>الحي:</span><span>{order.address.district}</span></div>
            )}
            {order.address?.street && (
                <div className='flex items-center gap-2'><Icon name="Road" size="xs" className='text-muted-foreground h-4 w-4' /><span>الشارع:</span><span>{order.address.street}</span></div>
            )}
            {order.address?.buildingNumber && (
                <div className='flex items-center gap-2'><Icon name="Building" size="xs" className='text-muted-foreground h-4 w-4' /><span>رقم المبنى:</span><span>{order.address.buildingNumber}</span></div>
            )}
            {order.address?.floor && (
                <div className='flex items-center gap-2'><Icon name="Layers" size="xs" className='text-muted-foreground' /><span>الدور:</span><span>{order.address.floor}</span></div>
            )}
            {order.address?.apartmentNumber && (
                <div className='flex items-center gap-2'><Icon name="DoorOpen" size="xs" className='text-muted-foreground' /><span>الشقة:</span><span>{order.address.apartmentNumber}</span></div>
            )}
            {order.address?.landmark && (
                <div className='flex items-center gap-2'><Icon name="Star" size="xs" className='text-muted-foreground' /><span>علامة مميزة:</span><span>{order.address.landmark}</span></div>
            )}
        </div>
    );
}

function AssignedOrderFooter({ order, driverId }: any) {
    return (
        <CardFooter className='w-full flex justify-between items-center gap-4'>
            {order.status === 'ASSIGNED' && (<CancelOrder
                orderId={order.id}
                orderNumber={order.orderNumber ?? ''}
                driverId={driverId}
                driverName={order.customerName ?? ''}
            />)}

            <div className='flex gap-2 items-center'>
                {order.customer?.phone && (
                    <a href={`tel:${order.customer.phone}`} className='flex items-center justify-center rounded-lg bg-muted/80 text-primary h-9 w-9  '>
                        <Icon name="Phone" size="sm" />
                    </a>
                )}
                {order.address?.latitude && order.address?.longitude && (
                    <WhatsappShareButton
                        message={`موقع التوصيل على الخريطة: https://www.google.com/maps?q=${order.address.latitude},${order.address.longitude}`}
                        size="icon"
                    />
                )}
            </div>
        </CardFooter>
    );
}

export default function AssignedOrderCard({ order, driverId }: { order: any; driverId: string }) {
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const router = useRouter();
    const handleStartTrip = async () => {
        const res = await setOrderInTransit(order.id, driverId);
        debug('setOrderInTransit result:', res);
        if (res.success && !res.error) {
            await Swal.fire({
                icon: 'success', // This shows a green checkmark (universal for success)
                title: 'الرحلة جاهزة للانطلاق',
                text: 'الطلب الآن في حالة انتظارك لبدء الرحلة. سيتم توجيهك لصفحة الرحلة النشطة للمتابعة من هناك.',
                confirmButtonText: 'انتقل إلى الرحلة النشطة',
            });
            router.push('/driver');
        } else if (res.error === 'ACTIVE_TRIP_EXISTS') {
            setAlertMessage('لديك رحلة نشطة بالفعل. يرجى إنهاء أو تسليم الرحلة الحالية أولاً.');
            setAlertOpen(true);
        } else if (res.error === 'Order not assigned to this driver') {
            await Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'هذا الطلب غير مخصص لك.',
                confirmButtonText: 'موافق',
            });
        } else if (res.error === 'Order not in ASSIGNED status') {
            await Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'لا يمكن بدء الرحلة إلا إذا كان الطلب في حالة تعيين.',
                confirmButtonText: 'موافق',
            });
        } else if (res.error === 'Order not found') {
            await Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'الطلب غير موجود.',
                confirmButtonText: 'موافق',
            });
        } else if (res.error) {
            await Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: res.error,
                confirmButtonText: 'موافق',
            });
        }
    };

    return (
        <Card className='rounded-lg border border-border bg-background shadow-md mb-4'>
            <AssignedOrderHeader order={order} onStartTrip={handleStartTrip} alertOpen={alertOpen} setAlertOpen={setAlertOpen} alertMessage={alertMessage} />
            <div className='p-4 flex flex-col gap-2'>
                <AssignedOrderDetails order={order} />
                <div className='flex flex-col sm:flex-row gap-2 justify-between'>
                    <div className='flex items-center gap-2 mt-2'>
                        <Icon name="User" size="sm" className='text-muted-foreground' />
                        <span className='text-sm'>{order.customer?.name || ''}</span>
                    </div>
                </div>
                <AssignedOrderAddress order={order} />
                {order.notes && (
                    <div className='flex items-center gap-2 mt-2 bg-yellow-50 rounded p-2'>
                        <Icon name="Info" size="sm" className='text-yellow-600' />
                        <span className='text-sm'>{order.notes}</span>
                    </div>
                )}
            </div>
            <div className='w-full h-px bg-border my-2' />
            <AssignedOrderFooter order={order} driverId={driverId} />
        </Card>
    );
} 