'use client';

import { useState } from 'react';
import { Icon } from '@/components/icons/Icon';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SimplifiedOrderSummaryProps {
    order: any;
}

const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'pending':
            return 'bg-status-pending/10 text-status-pending border-status-pending/30';
        case 'delivered':
            return 'bg-status-delivered/10 text-status-delivered border-status-delivered/30';
        case 'cancelled':
            return 'bg-status-canceled/10 text-status-canceled border-status-canceled/30';
        case 'in_transit':
            return 'bg-feature-commerce/10 text-feature-commerce border-feature-commerce/30';
        default:
            return 'bg-muted/10 text-muted-foreground border-muted/30';
    }
};

const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'pending':
            return 'قيد الإنتظار';
        case 'delivered':
            return 'تم التوصيل';
        case 'cancelled':
            return 'ملغي';
        case 'in_transit':
            return 'في الطريق';
        default:
            return 'حالة غير معروفة';
    }
};

export default function SimplifiedOrderSummary({ order }: SimplifiedOrderSummaryProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Calculate total from items to ensure accuracy
    const calculateTotalFromItems = () => {
        if (!order.items || order.items.length === 0) return 0;
        return order.items.reduce((total: number, item: any) => {
            const itemTotal = (item.price || 0) * (item.quantity || 1);
            return total + itemTotal;
        }, 0);
    };

    // Use calculated total or fallback to order.amount
    const orderTotal = calculateTotalFromItems() || order.amount || 0;
    const itemsCount = order.items?.length || 0;

    return (
        <Card className="shadow-lg border-l-4 border-l-feature-commerce">
            <CardContent className="p-3">
                {/* Compact Header Row with Total & Count */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded-md bg-feature-commerce/10">
                            <Icon name="Package" className="h-3 w-3 text-feature-commerce" />
                        </div>
                        <span className="text-sm font-bold">#{order.orderNumber || order.id.slice(0, 8)}</span>
                        <Badge className={`px-2 py-0.5 text-xs ${getStatusBadgeColor(order.status)}`}>
                            {getStatusText(order.status)}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-feature-commerce font-bold">
                                {orderTotal.toFixed(2)} ريال
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">
                                {itemsCount} منتج
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="h-5 w-5 p-0"
                    >
                        <Icon
                            name={isExpanded ? "ChevronUp" : "ChevronDown"}
                            className="h-3 w-3"
                        />
                    </Button>
                </div>

                {/* Compact Grid Layout */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* Customer Info */}
                    <div className="flex items-center gap-1.5">
                        <Icon name="User" className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">العميل:</span>
                        <span className="font-medium truncate">{order.customer?.name || 'غير محدد'}</span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-1.5">
                        <Icon name="Phone" className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="font-mono" dir="ltr">{order.customer?.phone || 'غير محدد'}</span>
                    </div>

                    {/* Address */}
                    {order.location?.address && (
                        <div className="flex items-center gap-1.5">
                            <Icon name="MapPin" className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground">العنوان:</span>
                            <span className="font-medium truncate">{order.location.address}</span>
                        </div>
                    )}

                    {/* Date */}
                    {order.createdAt && (
                        <div className="flex items-center gap-1.5">
                            <Icon name="Calendar" className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground">التاريخ:</span>
                            <span className="font-medium">{new Date(order.createdAt).toLocaleDateString('ar-SA')}</span>
                        </div>
                    )}
                </div>

                {/* Expanded Products Section */}
                {isExpanded && (
                    <div className="mt-2 pt-2 border-t border-border">
                        {order.items && order.items.length > 0 && (
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Icon name="Package" className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs font-medium text-muted-foreground">المنتجات:</span>
                                </div>
                                {order.items.map((item: any, index: number) => {
                                    const itemPrice = item.price || 0;
                                    const itemQuantity = item.quantity || 1;
                                    const itemTotal = itemPrice * itemQuantity;

                                    return (
                                        <div key={index} className="flex items-center justify-between text-xs bg-muted/20 rounded px-2 py-1">
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium truncate">{item.product?.name || item.name || 'منتج غير محدد'}</span>
                                                {itemQuantity > 1 && (
                                                    <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                                                        {itemQuantity}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-muted-foreground text-xs">
                                                    {itemPrice.toFixed(2)} ريال
                                                </div>
                                                {itemQuantity > 1 && (
                                                    <div className="text-feature-commerce font-medium text-xs">
                                                        {itemTotal.toFixed(2)} ريال
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* Total Verification */}
                                <div className="flex items-center justify-between text-xs bg-muted/30 rounded px-2 py-1 mt-2">
                                    <span className="font-medium">المجموع:</span>
                                    <span className="font-bold text-feature-commerce">
                                        {orderTotal.toFixed(2)} ريال
                                    </span>
                                </div>
                            </div>
                        )}

                        {order.paymentMethod && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs">
                                <Icon name="CreditCard" className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">طريقة الدفع:</span>
                                <span className="font-medium">{order.paymentMethod}</span>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 