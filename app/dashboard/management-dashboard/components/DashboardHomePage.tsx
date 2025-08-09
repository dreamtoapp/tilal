'use client';

import { useEffect, useState } from 'react';
import Link from '@/components/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardHomePageProps {
  summary: {
    orders: { total: number; today: number; pending: number; completed: number; cancelled: number; assigned: number };
    sales: { total: number; today: number };
    customers: { total: number; today: number };
    products: { total: number; outOfStock: number };
    drivers: { total: number };
    salesByMonth: { name: string; sales: number }[];
    topProducts: { name: string; sales: number; quantity: number }[];
    orderStatus: { name: string; value: number }[];
    recentOrders: { id: string; orderNumber: string; customer: string; amount: number; status: string; date: string }[];
  };
}

const statusLabels: Record<string, string> = {
  DELIVERED: 'تم التوصيل',
  IN_TRANSIT: 'قيد التوصيل',
  ASSIGNED: 'تم التعيين',
  CANCELED: 'ملغي',
  PENDING: 'قيد الانتظار',
};

const statusColors: Record<string, string> = {
  DELIVERED: 'bg-success/10 text-success border-success/20',
  IN_TRANSIT: 'bg-info/10 text-info border-info/20',
  ASSIGNED: 'bg-accent/10 text-accent-foreground border-accent/20',
  CANCELED: 'bg-destructive/10 text-destructive border-destructive/20',
  PENDING: 'bg-warning/10 text-warning border-warning/20',
};

function formatNumberEn(num: number) {
  return num.toLocaleString('en-US');
}

function formatCurrency(amount: number) {
  return `${amount.toLocaleString('en-US')} ر.س`;
}

const statusHints: Record<string, string> = {
  DELIVERED: 'تم توصيل الطلب بنجاح',
  IN_TRANSIT: 'الطلب في الطريق للعميل',
  ASSIGNED: 'تم تعيين سائق للطلب',
  CANCELED: 'تم إلغاء الطلب',
  PENDING: 'في انتظار معالجة الطلب',
};

function getStatusHint(status: string): string {
  return statusHints[status] || 'حالة غير معروفة';
}

export default function DashboardHomePage({ summary: initialSummary }: DashboardHomePageProps) {
  const [summary, setSummary] = useState(initialSummary);

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/dashboard-summary');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSummary(data);
    } catch (e) {
      // Handle error silently
    }
  };

  useEffect(() => {
    const refreshListener = () => fetchSummary();
    window.addEventListener('order-data-refresh', refreshListener);
    return () => window.removeEventListener('order-data-refresh', refreshListener);
  }, []);

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">مرحباً بك في لوحة التحكم</h1>
          <p className="text-muted-foreground">نظرة عامة على أداء المتجر</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            <Icon name="CheckCircle" className="h-3 w-3 ml-1" />
            متصل
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 xl:gap-5">
        {/* Each Card: reduced padding, min-w-0, compact font, hover effect */}
        <Card className="min-w-0 transition-transform duration-150 hover:scale-[1.03] hover:shadow-lg p-0">
          <CardContent className="p-3 md:p-4 xl:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">الطلبات اليوم</p>
                <p className="text-xl md:text-2xl font-bold">{formatNumberEn(summary.orders.today)}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                  من إجمالي {formatNumberEn(summary.orders.total)} طلب
                </p>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 bg-info/10 rounded-lg flex items-center justify-center">
                <Icon name="ClipboardList" className="h-5 w-5 md:h-6 md:w-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0 transition-transform duration-150 hover:scale-[1.03] hover:shadow-lg p-0">
          <CardContent className="p-3 md:p-4 xl:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">المبيعات اليوم</p>
                <p className="text-xl md:text-2xl font-bold">{formatCurrency(summary.sales.today)}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                  من إجمالي {formatCurrency(summary.sales.total)}
                </p>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="DollarSign" className="h-5 w-5 md:h-6 md:w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0 transition-transform duration-150 hover:scale-[1.03] hover:shadow-lg p-0">
          <CardContent className="p-3 md:p-4 xl:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">العملاء الجدد</p>
                <p className="text-xl md:text-2xl font-bold">{formatNumberEn(summary.customers.today)}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                  من إجمالي {formatNumberEn(summary.customers.total)} عميل
                </p>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name="Users" className="h-5 w-5 md:h-6 md:w-6 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Orders Card */}
        <Card className="min-w-0 transition-transform duration-150 hover:scale-[1.03] hover:shadow-lg p-0">
          <CardContent className="p-3 md:p-4 xl:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">الطلبات المعلقة</p>
                <p className="text-xl md:text-2xl font-bold">{formatNumberEn(summary.orders.pending)}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                  تحتاج إلى معالجة
                </p>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Icon name="Clock" className="h-5 w-5 md:h-6 md:w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Orders Card */}
        <Card className="min-w-0 transition-transform duration-150 hover:scale-[1.03] hover:shadow-lg p-0">
          <CardContent className="p-3 md:p-4 xl:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">الطلبات المُخصصة</p>
                <p className="text-xl md:text-2xl font-bold">{formatNumberEn(summary.orders.assigned)}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                  تم تعيينها لسائقين
                </p>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name="UserCheck" className="h-5 w-5 md:h-6 md:w-6 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Zap" className="h-5 w-5" />
            إجراءات سريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/dashboard/management-orders/status/pending">
                <Icon name="Clock" className="h-5 w-5" />
                <span className="text-sm">الطلبات المعلقة</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/dashboard/management-products">
                <Icon name="Package" className="h-5 w-5" />
                <span className="text-sm">إدارة المنتجات</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/dashboard/management-users/customer">
                <Icon name="Users" className="h-5 w-5" />
                <span className="text-sm">العملاء</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/dashboard/management-users/drivers">
                <Icon name="Truck" className="h-5 w-5" />
                <span className="text-sm">السائقون</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Icon name="ClipboardList" className="h-5 w-5" />
                آخر الطلبات
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/management-orders">
                  عرض الكل
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                      <Icon name="Package" className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{formatCurrency(order.amount)}</p>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${statusColors[order.status] || 'bg-muted text-muted-foreground'}`}
                    >
                      {statusLabels[order.status] || order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Icon name="Star" className="h-5 w-5" />
                المنتجات الأكثر مبيعاً
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/management-products">
                  عرض الكل
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.topProducts.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">الكمية: {product.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{formatCurrency(product.sales)}</p>
                    <p className="text-xs text-muted-foreground">المبيعات</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Activity" className="h-5 w-5" />
            حالة النظام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-success/10 border border-success/20">
              <Icon name="CheckCircle" className="h-6 w-6 text-success mx-auto mb-2" />
              <p className="text-sm font-medium text-success">الطلبات المكتملة</p>
              <p className="text-lg font-bold text-success">{formatNumberEn(summary.orders.completed)}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-info/10 border border-info/20">
              <Icon name="Clock" className="h-6 w-6 text-info mx-auto mb-2" />
              <p className="text-sm font-medium text-info">قيد التوصيل</p>
              <p className="text-lg font-bold text-info">{formatNumberEn(summary.orderStatus.find(s => s.name === 'IN_TRANSIT')?.value || 0)}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <Icon name="XCircle" className="h-6 w-6 text-destructive mx-auto mb-2" />
              <p className="text-sm font-medium text-destructive">الطلبات الملغاة</p>
              <p className="text-lg font-bold text-destructive">{formatNumberEn(summary.orders.cancelled)}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50 border border-muted">
              <Icon name="Package" className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-muted-foreground">غير متوفر</p>
              <p className="text-lg font-bold text-muted-foreground">{formatNumberEn(summary.products.outOfStock)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="TrendingUp" className="h-5 w-5" />
              اتجاه المبيعات الشهرية
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              آخر 6 أشهر من المبيعات
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary.salesByMonth}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `${value.toLocaleString()} ر.س`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value: any) => [`${value.toLocaleString()} ر.س`, 'المبيعات']}
                    labelStyle={{
                      color: 'hsl(var(--foreground))',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Circle" className="h-5 w-5" />
              توزيع حالة الطلبات
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              انقر على القطاعات لرؤية التفاصيل
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.orderStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  >
                    {summary.orderStatus.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={[
                          '#10b981', // Emerald green for ASSIGNED
                          '#f59e0b', // Amber for PENDING
                          '#3b82f6', // Blue for IN_TRANSIT
                          '#ef4444', // Red for CANCELED
                          '#8b5cf6'  // Purple for DELIVERED
                        ][index % 5]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value: any) => [
                      `${value} طلب`,
                      'الطلبات'
                    ]}
                    labelStyle={{
                      color: 'hsl(var(--foreground))',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {summary.orderStatus.map((status, index) => (
                <div key={status.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{
                        backgroundColor: [
                          '#10b981', // Emerald green for ASSIGNED
                          '#f59e0b', // Amber for PENDING
                          '#3b82f6', // Blue for IN_TRANSIT
                          '#ef4444', // Red for CANCELED
                          '#8b5cf6'  // Purple for DELIVERED
                        ][index % 5]
                      }}
                    />
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        {statusLabels[status.name] || status.name}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {getStatusHint(status.name)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-foreground">
                      {status.value}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {((status.value / summary.orders.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="BarChart3" className="h-5 w-5" />
            أداء المنتجات الأكثر مبيعاً
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            أعلى 8 منتجات من حيث المبيعات
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.topProducts.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `${value.toLocaleString()} ر.س`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: any) => [
                    `${value.toLocaleString()} ر.س`,
                    'المبيعات'
                  ]}
                  labelStyle={{
                    color: 'hsl(var(--foreground))',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                />
                <Bar
                  dataKey="sales"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
