import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/icons/Icon';

import { getOrderData } from '../actions/Actions';
import { getDriver } from '../actions/driver-list';
import ConfirmDriver from '../components/ConfirmDriver';
import SendOrderViaEmail from '../components/SendOrderViaEmail';

// Order Type Definition



interface ParamsProp {
  searchParams: Promise<{ status?: string }>;
  params: Promise<{ invoiceid: string }>;
}

export default async function InvoicePage({ params, searchParams }: ParamsProp) {
  const orderId = (await params).invoiceid;
  const order = await getOrderData(orderId as string);
  const resolvedSearchParams = await searchParams;
  const status = resolvedSearchParams.status;
  let drivers;
  if (status) {
    drivers = await getDriver();
  }

  // Calculate totals
  const subtotal = order?.amount || 0;
  const taxRate = 0.15;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  // Status color mapping with Arabic labels
  const getStatusInfo = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          label: 'قيد الانتظار',
          className: 'bg-amber-50 text-amber-800 border border-amber-200',
          iconName: 'Clock'
        };
      case 'delivered':
        return {
          label: 'تم التوصيل',
          className: 'bg-green-50 text-green-800 border border-green-200',
          iconName: 'CheckCircle2'
        };
      case 'cancelled':
        return {
          label: 'ملغي',
          className: 'bg-red-50 text-red-800 border border-red-200',
          iconName: 'CheckCircle2'
        };
      case 'in_transit':
        return {
          label: 'في الطريق',
          className: 'bg-blue-50 text-blue-800 border border-blue-200',
          iconName: 'CheckCircle2'
        };
      default:
        return {
          label: status || 'غير محدد',
          className: 'bg-gray-50 text-gray-800 border border-gray-200',
          iconName: 'CheckCircle2'
        };
    }
  };

  const statusInfo = getStatusInfo(order?.status || '');

  // After fetching drivers, type it as any[] if not already typed
  const driversTyped = (drivers ?? []) as any[];

  return (
    <div className="font-cairo p-4 bg-background" dir="rtl">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          {/* Clean Header Card */}
          <Card className="shadow-sm border-0 bg-muted/30">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left side - Order info with BackButton */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="space-y-1">
                      <h1 className="text-2xl font-bold text-foreground">
                        الطلبات المسلمة
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        رقم الطلب: {order?.orderNumber || '—'}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <Badge className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium ${statusInfo.className}`}>
                    <Icon name={statusInfo.iconName} className="w-4 h-4" />
                    {statusInfo.label}
                  </Badge>
                </div>

                {/* Right side - Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {order && (
                    <SendOrderViaEmail
                      orderId={orderId}
                      invoiceNumber={order.orderNumber}
                      email={order.customerEmail}
                    />
                  )}
                  {status === 'ship' && (
                    <ConfirmDriver
                      orderNo={order?.orderNumber || ''}
                      driverList={driversTyped.filter((d: any) => d.name !== null) as { id: string; name: string; }[]}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Invoice Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Customer Information Card */}
          <Card className="shadow-lg border-l-4 border-l-feature-users lg:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Icon name="User" className="h-5 w-5 text-feature-users icon-enhanced" />
                معلومات العميل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Icon name="User" className="h-4 w-4 text-feature-users" />
                  <div>
                    <p className="text-sm text-muted-foreground">اسم العميل</p>
                    <p className="font-medium text-foreground">{order?.customerName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Icon name="Mail" className="h-4 w-4 text-feature-users" />
                  <div>
                    <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                    <p className="font-medium text-foreground">{order?.customerEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Icon name="FileText" className="h-4 w-4 text-feature-users" />
                  <div>
                    <p className="text-sm text-muted-foreground">رقم الطلب</p>
                    <p className="font-medium text-foreground">{order?.orderNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Icon name="Calendar" className="h-4 w-4 text-feature-users" />
                  <div>
                    <p className="text-sm text-muted-foreground">الوردية</p>
                    <p className="font-medium text-foreground">{order?.shift}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Icon name="CheckCircle2" className="h-4 w-4 text-feature-users" />
                  <div>
                    <p className="text-sm text-muted-foreground">حالة الطلب</p>
                    <Badge className={`rounded-md ${getStatusInfo(order?.status || '').className}`}>
                      {order?.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items Card */}
          <Card className="shadow-lg border-l-4 border-l-feature-products lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Icon name="Package" className="h-5 w-5 text-feature-products icon-enhanced" />
                عناصر الطلب
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Mobile Cards View */}
              <div className="block lg:hidden space-y-3">
                {order?.items.map((item, index) => (
                  <Card key={index} className="border border-muted overflow-hidden rounded-lg">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-foreground">{item.productName}</h4>
                          <Badge variant="outline" className="bg-feature-products-soft text-feature-products border-feature-products">
                            {item.quantity}x
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">السعر الواحد:</span>
                          <span className="font-medium">{item.price.toFixed(2)} ر.س</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>الإجمالي:</span>
                          <span className="text-feature-products">{(item.quantity * item.price).toFixed(2)} ر.س</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="text-right p-4 font-medium text-foreground">المنتج</th>
                        <th className="text-right p-4 font-medium text-foreground">الكمية</th>
                        <th className="text-right p-4 font-medium text-foreground">السعر</th>
                        <th className="text-right p-4 font-medium text-foreground">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order?.items.map((item, index) => (
                        <tr key={index} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                          <td className="p-4 font-medium text-foreground">{item.productName}</td>
                          <td className="p-4">
                            <Badge variant="outline" className="bg-feature-products-soft text-feature-products border-feature-products">
                              {item.quantity}
                            </Badge>
                          </td>
                          <td className="p-4 text-foreground">{item.price.toFixed(2)} ر.س</td>
                          <td className="p-4 font-medium text-feature-products">{(item.quantity * item.price).toFixed(2)} ر.س</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary Card */}
          <Card className="shadow-lg border-l-4 border-l-feature-analytics lg:col-span-3">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Icon name="Calculator" className="h-5 w-5 text-feature-analytics icon-enhanced" />
                ملخص الفاتورة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Subtotal */}
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                  <Icon name="DollarSign" className="h-5 w-5 text-feature-analytics" />
                  <div>
                    <p className="text-sm text-muted-foreground">الإجمالي الفرعي</p>
                    <p className="text-xl font-bold text-foreground">{subtotal.toFixed(2)} ر.س</p>
                  </div>
                </div>

                {/* Tax */}
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                  <Icon name="Calculator" className="h-5 w-5 text-feature-analytics" />
                  <div>
                    <p className="text-sm text-muted-foreground">الضريبة (15%)</p>
                    <p className="text-xl font-bold text-foreground">{taxAmount.toFixed(2)} ر.س</p>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center gap-3 p-4 rounded-lg bg-feature-analytics-soft border border-feature-analytics md:col-span-2 lg:col-span-1">
                  <Icon name="Receipt" className="h-5 w-5 text-feature-analytics" />
                  <div>
                    <p className="text-sm text-feature-analytics">المبلغ الإجمالي</p>
                    <p className="text-2xl font-bold text-feature-analytics">{total.toFixed(2)} ر.س</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
