'use client';

import { useState } from 'react';

import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/utils';
import { Order } from '@/types/databaseTypes';
import { TimeAgo } from '@/components/ui/time-ago';
import { OrderStatus } from '@prisma/client';

interface InWayOrdersViewProps {
  orders: Order[];
  inWayCount: number;
  currentPage: number;
  pageSize: number;
  selectedDriverId: string;
}

// View Mode Toggle Component
interface ViewModeToggleProps {
  viewMode: 'list' | 'map';
  onViewModeChange: (mode: 'list' | 'map') => void;
}

function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex rounded-md border border-input gap-2">
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('list')}
          className="transition-all duration-150"
        >
          <Icon name="Filter" className="h-4 w-4 ml-2 icon-enhanced" />
          قائمة
        </Button>
        <Button
          variant={viewMode === 'map' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('map')}
          className="transition-all duration-150"
        >
          <Icon name="Map" className="h-4 w-4 ml-2 icon-enhanced" />
          خريطة
        </Button>
      </div>
    </div>
  );
}

// Sort Controls Component
interface SortControlsProps {
  driverSort: 'asc' | 'desc';
  onDriverSortChange: (sort: 'asc' | 'desc') => void;
}

function SortControls({ driverSort, onDriverSortChange }: SortControlsProps) {
  return (
    <Card className="shadow-sm border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Filter" className="h-4 w-4 text-feature-analytics" />
            <span className="text-sm font-semibold">ترتيب حسب السائق:</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDriverSortChange(driverSort === 'asc' ? 'desc' : 'asc')}
            className="gap-2 transition-all duration-150"
          >
            <Icon name="Truck" className="h-4 w-4 text-feature-commerce" />
            {driverSort === 'asc' ? 'أ إلى ي' : 'ي إلى أ'}
            <span className="transition-transform duration-150 text-xs">{driverSort === 'asc' ? '▲' : '▼'}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Individual Order Card Component
interface OrderCardProps {
  order: Order;
}

function OrderCard({ order }: OrderCardProps) {
  const isHighValue = order.amount > 500;

  return (
    <Card className={cn(
      "card-hover-effect shadow-lg border-l-4 border rounded-lg overflow-hidden h-fit",
      order.status === OrderStatus.IN_TRANSIT
        ? "border-l-feature-commerce bg-feature-commerce-soft"
        : "border-l-amber-500 bg-amber-50"
    )}>
      <CardHeader className="pb-3 bg-card border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon name="FileText" className="h-4 w-4 text-muted-foreground icon-enhanced" />
            <Link
              href={`/dashboard/show-invoice/${order.id}`}
              className="text-primary hover:text-primary/90 font-semibold hover:underline transition-colors duration-150"
            >
              طلب #{order.orderNumber}
            </Link>
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            {order.status !== OrderStatus.IN_TRANSIT && (
              <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-500 gap-1 shadow-sm text-xs">
                <Icon name="MapPin" className="h-3 w-3 animate-pulse" />
                لم يبدأ الرحلة
              </Badge>
            )}
            {order.status === OrderStatus.IN_TRANSIT && (
              <Badge className="bg-feature-commerce text-white gap-1 shadow-sm text-xs">
                <Icon name="Truck" className="h-3 w-3" />
                في الطريق
              </Badge>
            )}
            {isHighValue && (
              <Badge className="bg-status-high-value text-white gap-1 shadow-sm text-xs">
                <Icon name="DollarSign" className="h-3 w-3" />
                قيمة عالية
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        {/* Customer & Driver Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2 border-b pb-2">
              <Icon name="User" className="h-4 w-4 text-feature-users" />
              معلومات العميل
            </h4>
            <div className="space-y-2 pr-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">الاسم:</span>
                <span className="text-sm text-foreground font-medium">{order.customer.name || 'غير معروف'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="PhoneCall" className="h-3 w-3 text-feature-users" />
                <span className="text-sm text-foreground font-medium">{order.customer.phone || 'غير متوفر'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2 border-b pb-2">
              <Icon name="Truck" className="h-4 w-4 text-feature-commerce" />
              معلومات السائق
            </h4>
            <div className="space-y-2 pr-4">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all duration-150",
                  order.status === OrderStatus.IN_TRANSIT
                    ? "bg-feature-commerce-soft border-feature-commerce shadow-sm"
                    : "bg-amber-100 border-amber-500"
                )}>
                  {order.status === OrderStatus.IN_TRANSIT ? (
                    <Icon name="Truck" className="h-4 w-4 text-feature-commerce" />
                  ) : (
                    <Icon name="MapPin" className="h-4 w-4 text-amber-600 animate-pulse" />
                  )}
                </div>
                <span className="text-sm font-medium">{order.driver?.name || 'لم يتم تعيين'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Calendar" className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  <TimeAgo date={order.createdAt} />
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Order Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
            <Icon name="DollarSign" className="h-4 w-4 text-status-high-value" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground">المبلغ الإجمالي</p>
              <p className="text-lg font-bold text-status-high-value">{order.amount} ر.س</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
            <Icon name="Navigation" className={cn(
              "h-4 w-4",
              order.status === OrderStatus.IN_TRANSIT ? "text-feature-commerce" : "text-amber-600"
            )} />
            <div>
              <p className="text-xs font-semibold text-muted-foreground">حالة التوصيل</p>
              <p className={cn(
                "text-sm font-bold",
                order.status === OrderStatus.IN_TRANSIT ? "text-feature-commerce" : "text-amber-600"
              )}>
                {order.status === OrderStatus.IN_TRANSIT ? "جاري التوصيل" : "في الانتظار"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3 pt-3 border-t bg-muted/30 p-4">
        <Link
          href={`/dashboard/show-invoice/${order.id}`}
          className="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md gap-2 flex-1"
        >
          <Icon name="Search" className="h-4 w-4" />
          عرض التفاصيل
        </Link>

        <div className="flex items-center gap-2">
          {order.driverId ? (
            <a
              href={`tel:${order.driverId}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md p-0 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-150 border border-blue-200"
              title={`اتصل بالسائق: ${order.driverId}`}
              style={{ direction: 'ltr' }}
            >
              <Icon name="PhoneCall" className="h-4 w-4" />
            </a>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 text-muted-foreground border border-muted"
              title="لا يوجد رقم سائق"
              disabled
            >
              <Icon name="PhoneCall" className="h-4 w-4" />
            </Button>
          )}

          <Link
            href={`/dashboard/management-tracking/${order.id}`}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-md p-0 text-sm font-medium transition-colors duration-150 border",
              "text-feature-commerce hover:bg-feature-commerce-soft hover:text-feature-commerce border-feature-commerce"
            )}
            title="تتبع الطلب"
          >
            <Icon name="MapPin" className="h-4 w-4" />
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

// Orders List Component
interface OrdersListProps {
  orders: Order[];
  driverSort: 'asc' | 'desc';
  onDriverSortChange: (sort: 'asc' | 'desc') => void;
}

function OrdersList({ orders, driverSort, onDriverSortChange }: OrdersListProps) {
  // Sort orders by driver name
  const sortedOrders = [...orders].sort((a, b) => {
    const nameA = a.driver?.name || '';
    const nameB = b.driver?.name || '';

    if (driverSort === 'asc') {
      return nameA.localeCompare(nameB, 'ar');
    } else {
      return nameB.localeCompare(nameA, 'ar');
    }
  });

  return (
    <div className="space-y-4">
      <SortControls
        driverSort={driverSort}
        onDriverSortChange={onDriverSortChange}
      />

      {/* Orders Cards Grid with stable layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-max">
        {sortedOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

// Map View Component
function MapView() {
  return (
    <Card className="h-[500px] card-hover-effect shadow-lg border">
      <CardContent className="p-4 h-full">
        <div className="flex h-full items-center justify-center bg-muted/30 rounded-lg hover:bg-muted/40 transition-colors duration-200">
          <div className="text-center">
            <Icon name="Map" className="h-12 w-12 mx-auto text-feature-commerce icon-enhanced" />
            <h3 className="mt-2 text-lg font-medium text-foreground">خريطة تتبع الطلبات</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
              هنا ستظهر خريطة تفاعلية تعرض مواقع جميع الطلبات قيد التوصيل في الوقت الفعلي.
            </p>
            <div className="mt-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-feature-commerce-soft text-feature-commerce text-xs font-semibold rounded-full border border-feature-commerce">
                <Icon name="Truck" className="h-3 w-3" />
                قريباً
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <Card className="card-hover-effect shadow-lg border border-dashed border-feature-commerce">
      <CardContent className="flex flex-col items-center justify-center py-10">
        <div className="relative">
          <Icon name="Truck" className="h-16 w-16 text-feature-commerce icon-enhanced" />
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-feature-commerce-soft border border-feature-commerce rounded-full animate-pulse"></div>
        </div>
        <h3 className="mt-4 text-lg font-medium text-foreground">لا توجد طلبات في الطريق</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          لا توجد طلبات قيد التوصيل حالياً. سيتم عرض الطلبات هنا عندما يبدأ السائقون رحلاتهم.
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="MapPin" className="h-3 w-3" />
          <span>تحديث تلقائي كل 30 ثانية</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Component
export default function InWayOrdersView({ orders }: InWayOrdersViewProps) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [driverSort, setDriverSort] = useState<'asc' | 'desc'>('asc');

  return (
    <div className="space-y-6">
      {/* Header with fixed height to prevent layout shifts */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 min-h-[60px]">
        <ViewModeToggle
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Content based on orders availability and view mode */}
      {orders.length > 0 ? (
        viewMode === 'list' ? (
          <OrdersList
            orders={orders}
            driverSort={driverSort}
            onDriverSortChange={setDriverSort}
          />
        ) : (
          <MapView />
        )
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
