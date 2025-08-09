// app/dashboard/orders-management/status/pending/components/OrderTable.tsx
'use client';

import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  User,
  CreditCard,
  FileText,
  Phone,
  MapPin,
  Package,
  Clock,
  MousePointerBan,
  Home,
  Building2,
  Landmark,
  ClipboardCopy,
} from 'lucide-react';

import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Order } from '@/types/databaseTypes';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import GoogleMapsLink from '@/components/GoogleMapsLink';

import AssignToDriver from './AssignToDriver';
import CancelOrderDialog from './CancelOrderDialog';

interface OrderTableProps {
  orders: Order[];
  currentPage: number;
  pageSize: number;
  updatePage: (page: number) => void;
  totalPages: number;
  sortBy?: 'createdAt' | 'amount' | 'orderNumber';
  sortOrder?: 'asc' | 'desc';
  orderType?: 'pending' | 'assigned';
}

export default function OrderTable({
  orders,
  currentPage,
  updatePage,
  totalPages,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  orderType = 'pending',
}: OrderTableProps) {
  // Note: sortBy and sortOrder are not currently used in the implementation
  // They are kept for future feature development
  void sortBy;
  void sortOrder;

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => updatePage(i)}
          className="h-8 w-8"
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updatePage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="flex gap-1">
          {pages}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => updatePage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Enhanced Admin Order Card with full information
  const AdminOrderCard = ({ order }: { order: Order }) => {
    // Calculate order age for priority
    const orderAge = Date.now() - new Date(order.createdAt).getTime();
    const isUrgent = orderAge > 24 * 60 * 60 * 1000; // older than 24 hours

    return (
      <Card className={cn(
        "flex flex-col h-full border-l-4 border rounded-lg overflow-hidden",
        isUrgent ? "border-l-status-urgent" : "border-l-status-pending"
      )}>
        <CardHeader className="pb-3 bg-card border-b rounded-t-lg">
          {/* Standalone badges row at the top */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-status-pending-soft text-status-pending border-status-pending gap-1 shadow-sm text-[10px] px-2 py-0.5">
              <MousePointerBan className="h-3 w-3" />
              قيد الانتظار
            </Badge>
            <Badge variant="outline" className="bg-status-priority-soft text-status-priority border-status-priority gap-1 text-[10px] px-2 py-0.5">
              <CreditCard className="h-3 w-3" />
              {order.paymentMethod}
            </Badge>
            <Badge variant="outline" className="bg-feature-analytics-soft text-feature-analytics border-feature-analytics gap-1 text-[10px] px-2 py-0.5">
              <Package className="h-3 w-3" />
              {order.items?.length || 0} صنف
            </Badge>
            <Badge variant="outline" className="bg-muted text-muted-foreground border-muted gap-1 text-[10px] px-2 py-0.5">
              <Clock className="h-3 w-3 text-feature-settings" />
              {Math.floor(orderAge / (1000 * 60 * 60))} ساعة
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col items-start w-full">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <Link href={`/dashboard/show-invoice/${order.id}`} className="text-primary font-semibold">
                  طلب #{order.orderNumber}
                </Link>
              </CardTitle>
            </div>
            <div className="flex flex-col items-end min-w-[100px] sm:min-w-[140px]">
              <span className="font-bold text-lg text-status-high-value flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-status-high-value" />
                {order.amount} ر.س
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-4">
          {/* Client Information Section - Full Width, Single Column, RTL */}
          <div className="w-full space-y-3 text-right" dir="rtl">
            <div className="flex flex-row-reverse items-center gap-2 justify-end">
              <span className="text-sm text-foreground font-medium">{order.customer.name}</span>
              <User className="h-4 w-4 text-status-priority" />
            </div>
            <div className="flex flex-row-reverse items-center gap-2 justify-end">
              <span className="text-sm text-foreground font-medium">{order.customer.phone}</span>
              <Phone className="h-4 w-4 text-status-high-value" />
            </div>
            {/* Address Row with Details Button */}
            <div className="flex flex-row-reverse items-center gap-2 justify-end mt-2">

              {order.address?.district && (
                <span className="text-xs text-muted-foreground">{order.address.district}</span>
              )}
              {order.address?.street && (
                <span className="text-xs text-muted-foreground">· {order.address.street}</span>
              )}
              {order.address?.label && (
                <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">{order.address.label}</span>
              )}
              <MapPin className="h-4 w-4 text-feature-analytics" />

            </div>
            <div className="flex  items-center gap-2  justify-center">


              {order.address?.latitude && order.address?.longitude && (
                <GoogleMapsLink
                  latitude={order.address.latitude}
                  longitude={order.address.longitude}
                  label="عرض على الخريطة"
                  variant="outline"
                  size="sm"
                  showExternalIcon={true}
                  className=" text-feature-analytics"
                />
              )}
            </div>
          </div>

          {/* Time Information - Remove order date card */}

          {/* Items Preview (if available) */}
          {order.items && order.items.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4 text-feature-products" />
                  أصناف الطلب
                </h4>
                {/* Collapsible Items Section replaced with Dialog */}
                <div className="grid grid-cols-1 gap-2">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 border rounded-lg">
                      <Package className="h-3 w-3 text-feature-products" />
                      <span className="text-xs flex-1 font-medium text-foreground">{item.product?.name || `صنف ${index + 1}`}</span>
                      <Badge variant="outline" className="text-xs bg-feature-products-soft text-feature-products border-feature-products rounded-md">
                        {item.quantity || 1}
                      </Badge>
                    </div>
                  ))}
                </div>
                {order.items.length > 2 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button type="button" className="mt-2 text-xs text-primary underline cursor-pointer">
                        عرض المزيد ({order.items.length - 2})
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>كل أصناف الطلب</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 gap-2 mt-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 border rounded-lg">
                            <Package className="h-3 w-3 text-feature-products" />
                            <span className="text-xs flex-1 font-medium text-foreground">{item.product?.name || `صنف ${index + 1}`}</span>
                            <Badge variant="outline" className="text-xs bg-feature-products-soft text-feature-products border-feature-products rounded-md">
                              {item.quantity || 1}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </>
          )}

          {/* Admin Notes Section */}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t mt-auto">
          <div className="flex flex-row-reverse gap-3 w-full justify-end">
            <AssignToDriver orderId={order.id} />
            <CancelOrderDialog orderId={order.id} />
          </div>
          {/* Address Details Button and Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs text-primary hover:underline">
                <MapPin className="h-4 w-4" />
                تفاصيل العنوان
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>تفاصيل عنوان التوصيل</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                {/* Main Address Block */}
                <div className="flex items-center gap-2 mb-2">
                  <Home className="h-4 w-4 text-primary" />
                  <span className="font-bold">{order.address?.label || '—'}</span>
                  {/* Copy Address Button */}
                  <button
                    className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                    onClick={() => {
                      const fullAddress = [
                        order.address?.label,
                        order.address?.district,
                        order.address?.street,
                        order.address?.buildingNumber,
                        order.address?.floor && `دور: ${order.address.floor}`,
                        order.address?.apartmentNumber && `شقة: ${order.address.apartmentNumber}`,
                        order.address?.landmark && `علامة: ${order.address.landmark}`
                      ].filter(Boolean).join(', ');
                      navigator.clipboard.writeText(fullAddress);
                    }}
                    title="نسخ العنوان"
                  >
                    <ClipboardCopy className="h-4 w-4" />
                    نسخ
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span><span className="font-semibold">الحي:</span> {order.address?.district || '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span><span className="font-semibold">الشارع:</span> {order.address?.street || '—'}</span>
                  <span className="mx-2">|</span>
                  <span><span className="font-semibold">مبنى:</span> {order.address?.buildingNumber || '—'}</span>
                  {order.address?.floor && <span className="mx-2">|</span>}
                  {order.address?.floor && <span><span className="font-semibold">دور:</span> {order.address.floor}</span>}
                  {order.address?.apartmentNumber && <span className="mx-2">|</span>}
                  {order.address?.apartmentNumber && <span><span className="font-semibold">شقة:</span> {order.address.apartmentNumber}</span>}
                </div>
                {order.address?.landmark && (
                  <div className="flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-primary" />
                    <span><span className="font-semibold">علامة مميزة:</span> {order.address.landmark}</span>
                  </div>
                )}
                {order.address?.deliveryInstructions && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span><span className="font-semibold">تعليمات:</span> {order.address.deliveryInstructions}</span>
                  </div>
                )}
                {/* Coordinates and Google Maps Link */}
                {(order.address?.latitude && order.address?.longitude) && (
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-semibold">الإحداثيات:</span>
                    <span>{order.address.latitude}, {order.address.longitude}</span>
                    <GoogleMapsLink
                      latitude={order.address.latitude}
                      longitude={order.address.longitude}
                      label="عرض على الخريطة"
                      variant="ghost"
                      size="sm"
                    />
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Orders Grid */}
      {orders.length === 0 ? (
        <Card className="border-dashed border-2 border-muted bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-20 w-20 text-muted-foreground/50 mb-6" />
            <h3 className="text-xl font-bold text-foreground mb-3">
              {orderType === 'assigned' ? 'لا توجد طلبات مُخصصة للسائقين' : 'لا توجد طلبات قيد الانتظار'}
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              {orderType === 'assigned'
                ? 'جميع الطلبات المُخصصة تم تسليمها أو لا توجد طلبات مُخصصة حالياً'
                : 'جميع الطلبات تمت معالجتها أو لا توجد طلبات جديدة في الوقت الحالي'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <AdminOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {orders.length > 0 && (
        <Card className="border shadow-sm">
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-muted/30">
            <div className="text-sm font-medium text-muted-foreground">
              عرض <span className="font-bold text-foreground">{orders.length}</span> من إجمالي <span className="font-bold text-foreground">{Math.ceil(totalPages * orders.length)}</span> طلب
            </div>
            {renderPagination()}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

