"use client";
import React from 'react';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { OrderAnalyticsData } from '../actions/get-order-analytics';
import OrderStatusChart from './OrderStatusChart';

interface OrderAnalyticsDashboardClientProps {
  data: OrderAnalyticsData;
}

const OrderAnalyticsDashboardClient: React.FC<OrderAnalyticsDashboardClientProps> = ({ data }) => {
  const avgOrderValue = data?.totalOrders && data?.totalRevenue
    ? (data.totalRevenue / data.totalOrders).toFixed(2)
    : '0.00';
  const ordersToday = data?.todayOrdersByStatus?.reduce((sum: number, s: { _count: { status: number } }) => sum + s._count.status, 0) || 0;

  // Custom tooltip for better clarity
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-card-foreground text-card rounded-lg p-3 shadow-lg text-sm rtl:text-right">
          <div className="font-bold mb-1">{item.name}</div>
          {item.count !== undefined && <div>الكمية: <span className="font-bold">{item.count}</span></div>}
          {item.total !== undefined && <div>إجمالي الشراء: <span className="font-bold">{item.total}</span></div>}
        </div>
      );
    }
    return null;
  };

  // Custom YAxis tick to truncate long names
  // const CustomYAxisTick = (props: any) => {
  //   const { x, y, payload } = props;
  //   const name = payload.value.length > 18 ? payload.value.slice(0, 16) + '…' : payload.value;
  //   return (
  //     <Text x={x} y={y} width={110} textAnchor="end" verticalAnchor="middle" fill="hsl(var(--foreground))" fontSize={13} fontWeight={500}>
  //       {name}
  //     </Text>
  //   );
  // };

  return (
    <div dir="rtl" className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-right">
      {/* KPI Cards Row */}
      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-card p-4 rounded-xl shadow-md" aria-label="إجمالي الطلبات">
          <h3 className="text-base font-semibold mb-1">إجمالي الطلبات</h3>
          <span className="text-2xl font-bold text-primary">{data?.totalOrders}</span>
        </div>
        <div className="bg-card p-4 rounded-xl shadow-md" aria-label="إجمالي الإيرادات">
          <h3 className="text-base font-semibold mb-1">إجمالي الإيرادات</h3>
          <span className="text-2xl font-bold text-green-600">{data?.totalRevenue} ر.س</span>
        </div>
        <div className="bg-card p-4 rounded-xl shadow-md" aria-label="متوسط قيمة الطلب">
          <h3 className="text-base font-semibold mb-1">متوسط قيمة الطلب</h3>
          <span className="text-2xl font-bold text-blue-600">{avgOrderValue} ر.س</span>
        </div>
        <div className="bg-card p-4 rounded-xl w-full shadow-md" aria-label="طلبات اليوم">
          <h3 className="text-base font-semibold mb-1">طلبات اليوم</h3>
          <span className="text-2xl font-bold text-amber-600">{ordersToday}</span>
        </div>
      </div>

      {/* First Order Card + Last Order Card Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:col-span-2">
        {/* First Order Card */}
        <div className="bg-card p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">أول طلب</h2>
          {data?.firstOrder ? (
            <div>
              <p>رقم الطلب: <span className="font-extrabold">{data.firstOrder?.orderNumber}</span></p>
              <p>تاريخ الإنشاء: <span className="font-extrabold">{new Date(data.firstOrder.createdAt).toLocaleDateString('ar-EG')}</span></p>
            </div>
          ) : (
            <p>لا توجد طلبات حتى الآن.</p>
          )}
        </div>
        {/* Last Order Card */}
        <div className="bg-card p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">آخر طلب</h2>
          {data?.lastOrder ? (
            <div>
              <p>رقم الطلب: <span className="font-extrabold">{data.lastOrder?.orderNumber}</span></p>
              <p>تاريخ الإنشاء: <span className="font-extrabold">{new Date(data.lastOrder.createdAt).toLocaleDateString('ar-EG')}</span></p>
            </div>
          ) : data?.firstOrder ? (
            <div>
              <p>رقم الطلب: <span className="font-extrabold">{data.firstOrder?.orderNumber}</span></p>
              <p>تاريخ الإنشاء: <span className="font-extrabold">{new Date(data.firstOrder.createdAt).toLocaleDateString('ar-EG')}</span></p>
            </div>
          ) : (
            <p>لا توجد طلبات حتى الآن.</p>
          )}
        </div>
      </div>

      {/* Orders by Status Chart */}
      <div className="bg-card p-6 rounded-2xl shadow-md md:col-span-2">
        <h3 className="text-xl font-bold mb-4">الطلبات حسب الحالة</h3>
        <OrderStatusChart data={data?.ordersByStatus ?? []} />
      </div>
      {/* Sales Trends Chart */}
      <div className="bg-card p-6 rounded-2xl shadow-md md:col-span-2">
        <h3 className="text-xl font-bold mb-4">اتجاهات الطلبات والإيرادات (آخر 30 يومًا)</h3>
        {data?.salesTrends?.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.salesTrends} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="hsl(var(--chart-1))" name="عدد الطلبات" activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-2))" name="الإيرادات (ر.س)" activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-64 flex items-center justify-center text-gray-400">لا توجد بيانات اتجاهات.</div>
        )}
      </div>
      {/* Top Products Chart */}
      <div className="bg-card p-6 rounded-2xl shadow-md">
        <h3 className="text-xl font-bold mb-4">أفضل المنتجات</h3>
        {data?.topProducts?.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.topProducts} margin={{ left: 30, right: 30, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--foreground))', fontSize: 13, fontWeight: 500 }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="count" stroke="hsl(var(--chart-3))" name="الكمية" strokeWidth={3} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-32 flex items-center justify-center text-gray-400">لا توجد بيانات منتجات.</div>
        )}
      </div>
      {/* Top Customers Chart */}
      <div className="bg-card p-6 rounded-2xl shadow-md">
        <h3 className="text-xl font-bold mb-4">أفضل العملاء</h3>
        {data?.topCustomers?.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.topCustomers} margin={{ left: 30, right: 30, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--foreground))', fontSize: 13, fontWeight: 500 }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="total" stroke="hsl(var(--chart-4))" name="إجمالي الشراء (ر.س)" strokeWidth={3} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-32 flex items-center justify-center text-gray-400">لا توجد بيانات عملاء.</div>
        )}
      </div>
      {/* Today's Orders by Status */}
      <div className="bg-card p-6 rounded-2xl shadow-md md:col-span-2">
        <h3 className="text-xl font-bold mb-4">طلبات اليوم حسب الحالة</h3>
        <ul className="list-disc list-inside">
          {data?.todayOrdersByStatus?.length ? (
            data.todayOrdersByStatus.map((item: { status: string; _count: { status: number } }) => (
              <li key={item.status}>
                {item.status}: <span className="font-extrabold">{item._count.status}</span>
              </li>
            ))
          ) : (
            <li>لا توجد طلبات اليوم.</li>
          )}
        </ul>
      </div>
      {/* Export Button */}

    </div>
  );
};

export default OrderAnalyticsDashboardClient;
