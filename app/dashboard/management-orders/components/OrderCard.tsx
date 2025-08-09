'use client';
import React, { useMemo, useState } from 'react';

import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Icon } from '@/components/icons/Icon';

import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import {
    Button,
    buttonVariants,
} from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    ORDER_STATUS,
    OrderStatus,
} from '@/constant/order-status';
import { Order } from '@/types/databaseTypes';
import { useRouter } from 'next/navigation';
import { updateOrderStatus } from '../actions/update-order-status';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useRefresh } from './RefreshContext';

// Enhanced status styles with better color coding
const STATUS_STYLES = {
    [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    [ORDER_STATUS.IN_TRANSIT]: 'bg-blue-100 text-blue-800 border-blue-300',
    [ORDER_STATUS.DELIVERED]: 'bg-green-100 text-green-800 border-green-300',
    [ORDER_STATUS.CANCELED]: 'bg-red-100 text-red-800 border-red-300',
    [ORDER_STATUS.ASSIGNED]: 'bg-indigo-100 text-indigo-800 border-indigo-300',
};

const STATUS_TRANSLATIONS = {
    [ORDER_STATUS.PENDING]: 'قيد الانتظار',
    [ORDER_STATUS.IN_TRANSIT]: 'في الطريق',
    [ORDER_STATUS.DELIVERED]: 'تم التسليم',
    [ORDER_STATUS.CANCELED]: 'ملغي',
    [ORDER_STATUS.ASSIGNED]: 'في السيارة',
    Default: 'غير محدد',
};

// Enhanced status icons with better color coding
const StatusIcon = ({ status }: { status: OrderStatus }) => {
    const icons: Record<OrderStatus, React.ReactNode> = {
        [ORDER_STATUS.PENDING]: <Icon name="Clock" className="h-4 w-4 text-yellow-700" />,
        [ORDER_STATUS.IN_TRANSIT]: <Icon name="Truck" className="h-4 w-4 text-blue-700" />,
        [ORDER_STATUS.DELIVERED]: <Icon name="CheckCircle" className="h-4 w-4 text-green-700" />,
        [ORDER_STATUS.CANCELED]: <Icon name="X" className="h-4 w-4 text-red-700" />,
        [ORDER_STATUS.ASSIGNED]: <Icon name="Box" className="h-4 w-4 text-indigo-700" />,
    };
    return icons[status.toUpperCase() as OrderStatus] || <Icon name="Package" className="h-4 w-4 text-muted-foreground" />;
};

// Enhanced order header with better visual hierarchy
const OrderHeader = ({ order, statusStyle }: { order: Order, statusStyle: string }) => {
    const createdAt = useMemo(
        () => formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: ar }),
        [order.createdAt],
    );

    return (
        <CardHeader className="flex flex-col pb-3 space-y-2">
            <div className="flex items-center justify-between">
                <Badge className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium ${statusStyle}`}>
                    <StatusIcon status={order.status as OrderStatus} />
                    <span>{STATUS_TRANSLATIONS[order.status as OrderStatus] || STATUS_TRANSLATIONS.Default}</span>
                </Badge>
                <div className="text-left">
                    <CardTitle className="text-lg font-bold text-feature-commerce flex items-center gap-1">
                        <Icon name="CreditCard" className="h-4 w-4" />
                        {order.amount.toFixed(2)} ر.س
                    </CardTitle>
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center gap-1.5 cursor-help">
                            <Icon name="Calendar" className="h-3 w-3" />
                            <span>{createdAt}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>تاريخ الإنشاء: {new Date(order.createdAt).toLocaleDateString('ar-SA')}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </CardHeader>
    );
};

// Enhanced customer actions with click-to-call and WhatsApp integration
const CustomerCardAction = ({
    phone,
    customerName,
}: {
    phone: string;
    customerName: string;
}) => {
    const handleCall = () => {
        if (phone) {
            window.open(`tel:${phone}`, '_self');
        }
    };

    const handleWhatsApp = () => {
        if (phone) {
            const message = `مرحباً ${customerName}، نود التواصل معك بخصوص طلبك.`;
            const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
    };

    const handleSMS = () => {
        if (phone) {
            const message = `مرحباً ${customerName}، نود التواصل معك بخصوص طلبك.`;
            const smsUrl = `sms:${phone}?body=${encodeURIComponent(message)}`;
            window.open(smsUrl, '_self');
        }
    };

    if (!phone) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 border-muted/30 text-muted-foreground"
                        disabled
                    >
                        <Icon name="Phone" className="h-3 w-3" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>رقم الهاتف غير متوفر</p>
                </TooltipContent>
            </Tooltip>
        );
    }

    return (
        <div className="flex items-center gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                        onClick={handleCall}
                    >
                        <Icon name="Phone" className="h-3 w-3" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>اتصال: {phone}</p>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                        onClick={handleWhatsApp}
                    >
                        <Icon name="Whatsapp" className="h-3 w-3" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>واتساب: {phone}</p>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                        onClick={handleSMS}
                    >
                        <Icon name="MessageSquare" className="h-3 w-3" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>رسالة نصية: {phone}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
};

// Collapsible Order Items component
const OrderItemsPreview = ({ items }: { items: any[] }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between p-2 h-auto bg-muted/30 hover:bg-muted/50"
                >
                    <div className="flex items-center gap-2">
                        <Icon name="Package" className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">
                            المنتجات ({items.length})
                        </span>
                    </div>
                    <Icon
                        name={isOpen ? "ChevronUp" : "ChevronDown"}
                        className="h-3 w-3 text-muted-foreground"
                    />
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 p-2">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                        <span className="truncate flex-1">{item.product.name || `منتج ${index + 1}`}</span>
                        <span className="text-muted-foreground ml-2">
                            {item.quantity || 1} × {item.price || 0} ر.س
                        </span>
                    </div>
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
};

// Enhanced order content with better layout and more information
const OrderContent = ({ order }: { order: Order }) => (
    <CardContent className="space-y-3 text-foreground">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Icon name="List" className="h-4 w-4 text-feature-commerce" />
                <CardTitle className="text-sm font-semibold text-feature-commerce">
                    {order.orderNumber}
                </CardTitle>
            </div>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={`/dashboard/show-invoice/${order.id}`}
                        className={buttonVariants({
                            variant: 'outline',
                            size: 'icon',
                            className: 'h-7 w-7 border-feature-commerce/20 hover:bg-feature-commerce/10',
                        })}
                    >
                        <Icon name="Receipt" className="h-3 w-3" />
                    </Link>
                </TooltipTrigger>
                <TooltipContent>عرض الفاتورة</TooltipContent>
            </Tooltip>
        </div>

        <div className="flex items-center justify-between">
            <CardDescription className="flex items-center gap-2 text-sm">
                <Icon name="User" className="h-4 w-4 text-feature-users" />
                <span className="font-medium">{order.customer.name || 'عميل غير معروف'}</span>
            </CardDescription>
            <CustomerCardAction
                phone={order.customer.phone || ''}
                customerName={order.customer.name || 'عميل غير معروف'}
            />
        </div>

        {/* Collapsible Order Items Preview */}
        {order.items && order.items.length > 0 && (
            <OrderItemsPreview items={order.items} />
        )}

        {/* Delivery Address */}
        {(order as any).deliveryAddress && (
            <div className="flex items-start gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                <Icon name="MapPin" className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-xs font-medium text-blue-800">عنوان التوصيل:</p>
                    <p className="text-xs text-blue-700 truncate">{(order as any).deliveryAddress}</p>
                </div>
            </div>
        )}

        {/* Payment Status Badge */}
        <div className="flex items-center gap-2">
            <Badge
                variant={(order as any).paymentStatus === 'PAID' ? 'default' : 'secondary'}
                className={`text-xs ${(order as any).paymentStatus === 'PAID'
                    ? 'bg-green-100 text-green-800 border-green-300'
                    : 'bg-red-100 text-red-800 border-red-300'
                    }`}
            >
                <Icon
                    name={(order as any).paymentStatus === 'PAID' ? 'CheckCircle' : 'X'}
                    className="h-3 w-3 mr-1"
                />
                {(order as any).paymentStatus === 'PAID' ? 'مدفوع' : 'غير مدفوع'}
            </Badge>
            <span className="text-xs text-muted-foreground">
                {(order as any).paymentMethod || 'نقداً'}
            </span>
        </div>




    </CardContent>
);

// Status-specific action buttons
const StatusActions = ({ order }: { order: Order }) => {
    const router = useRouter();
    const { triggerRefresh } = useRefresh();
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [isCanceling, setIsCanceling] = useState(false);

    const handleAssignDriver = () => {
        router.push(`/dashboard/management-orders/assign-driver/${order.id}`);
    };



    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            toast.error('يرجى إدخال سبب الإلغاء');
            return;
        }

        setIsCanceling(true);
        try {
            const result = await updateOrderStatus({
                orderId: order.id,
                newStatus: 'CANCELED' as any,
                notes: cancelReason.trim(),
            });

            if (result.success) {
                toast.success(result.message);
                setShowCancelDialog(false);
                setCancelReason('');
                // Trigger refresh to update the order list and reflect new status
                triggerRefresh();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error canceling order:', error);
            toast.error('حدث خطأ أثناء إلغاء الطلب');
        } finally {
            setIsCanceling(false);
        }
    };

    // Render different actions based on order status
    switch (order.status) {
        case ORDER_STATUS.PENDING:
            return (
                <>
                    <div className="flex gap-2 w-full" data-testid="order-status-pending">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAssignDriver}
                            className="h-8 px-2 text-xs flex-1"
                            style={{ width: '70%' }}
                            data-testid="assign-driver-btn"
                        >
                            <Icon name="UserPlus" className="h-3 w-3 ml-1" />
                            تعيين سائق
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowCancelDialog(true)}
                            className="h-8 px-2 text-xs"
                            data-testid="cancel-order-btn"
                        >
                            <Icon name="X" className="h-3 w-3 ml-1" />
                            إلغاء الطلبية
                        </Button>
                    </div>

                    <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                        <DialogContent data-testid="cancel-order-dialog">
                            <DialogHeader>
                                <DialogTitle>إلغاء الطلب</DialogTitle>
                                <DialogDescription>
                                    رقم الطلب: {order.orderNumber}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">سبب الإلغاء:</label>
                                    <Textarea
                                        placeholder="أدخل سبب إلغاء الطلب..."
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        className="mt-1 w-full"
                                        rows={3}
                                        data-testid="cancel-reason-textarea"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowCancelDialog(false)}
                                    disabled={isCanceling}
                                    data-testid="cancel-dialog-close-btn"
                                >
                                    إلغاء
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleCancelOrder}
                                    disabled={isCanceling || !cancelReason.trim()}
                                    data-testid="confirm-cancel-btn"
                                >
                                    {isCanceling ? 'جاري الإلغاء...' : 'تأكيد الإلغاء'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            );

        case ORDER_STATUS.ASSIGNED:
            return (
                <div className="flex items-center justify-between gap-2 p-2 bg-feature-suppliers/5 border border-feature-suppliers/20 rounded-md w-full" data-testid="order-status-assigned">
                    <div className="flex items-center gap-2">
                        <Icon name="Truck" className="h-4 w-4 text-feature-suppliers" />
                        <span className="text-sm font-medium text-feature-suppliers" data-testid="driver-name">
                            {order.driver?.name || 'غير معروف'}
                        </span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/management-orders/assign-driver/${order.id}`)}
                        className="h-6 px-2 text-xs"
                        data-testid="reassign-driver-btn"
                    >
                        <Icon name="UserPlus" className="h-3 w-3 ml-1" />
                        إعادة تعيين
                    </Button>
                </div>
            );

        case ORDER_STATUS.IN_TRANSIT:
            return (
                <div className="flex items-center justify-between gap-2 p-2 bg-feature-commerce-soft border border-feature-commerce/20 rounded-md w-full" data-testid="order-status-in-transit">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-feature-commerce" data-testid="driver-tracking-info">
                            {order.driver?.name || 'غير معروف'} - في الطريق
                        </span>
                    </div>
                    <Link
                        href={`/dashboard/management-tracking/${order.id}`}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-md p-0 text-feature-commerce hover:bg-feature-commerce/10 hover:text-feature-commerce transition-colors duration-150 border border-feature-commerce/30"
                        title="تتبع موقع السائق"
                        data-testid="track-driver-btn"
                    >
                        <Icon name="Navigation" className="h-3 w-3" />
                    </Link>
                </div>
            );

        case ORDER_STATUS.DELIVERED:
            return (
                <div className="flex items-center gap-1" data-testid="order-status-delivered">
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                        <Icon name="CheckCircle" className="h-3 w-3 ml-1" />
                        تم التسليم
                    </Badge>
                </div>
            );

        case ORDER_STATUS.CANCELED:
            return (
                <div className="w-full" data-testid="order-status-canceled">
                    {order.resonOfcancel && (
                        <Collapsible className="group">
                            <div className="bg-red-50 border border-red-200 rounded-md p-2 w-full">
                                <CollapsibleTrigger asChild>
                                    <div className="flex items-center gap-2 cursor-pointer hover:text-red-800 transition-colors">
                                        <Icon name="AlertCircle" className="h-4 w-4 text-red-600 flex-shrink-0" />
                                        <div className="text-sm text-red-700 line-clamp-1 group-hover:line-clamp-none flex-1" data-testid="cancel-reason">
                                            {order.resonOfcancel}
                                        </div>
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className="text-red-700 mt-2 pt-2 border-t border-red-200 text-sm">
                                        {order.resonOfcancel}
                                    </div>
                                </CollapsibleContent>
                            </div>
                        </Collapsible>
                    )}
                </div>
            );

        default:
            return null;
    }
};

// Main OrderCard component with practical hover effects
interface OrderCardProps {
    order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
    const statusStyle = STATUS_STYLES[order.status as OrderStatus] || STATUS_STYLES[ORDER_STATUS.PENDING];

    // Determine border color based on status
    const getBorderColor = (status: string) => {
        switch (status) {
            case ORDER_STATUS.PENDING:
                return 'border-l-yellow-500';
            case ORDER_STATUS.IN_TRANSIT:
                return 'border-l-blue-500';
            case ORDER_STATUS.DELIVERED:
                return 'border-l-green-500';
            case ORDER_STATUS.CANCELED:
                return 'border-l-red-500';
            case ORDER_STATUS.ASSIGNED:
                return 'border-l-indigo-500';
            default:
                return 'border-l-feature-commerce';
        }
    };

    const borderColor = getBorderColor(order.status);

    return (
        <Card className={`
            shadow-sm border-l-4 ${borderColor} 
            transition-all duration-200 hover:shadow-md hover:border-l-opacity-80
            bg-gradient-to-br from-background to-muted/10
        `}>
            <OrderHeader order={order} statusStyle={statusStyle} />
            <OrderContent order={order} />
            <CardFooter className="flex justify-end gap-2">
                <StatusActions order={order} />
            </CardFooter>
        </Card>
    );
} 