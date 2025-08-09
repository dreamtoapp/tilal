import React from 'react';

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface OrderAnalyticsChartProps {
  data: {
    salesTrends: { date: string; total: number; }[];
    orderStatusDistribution: { status: string; count: number }[];
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF66C3']; // Example colors

const OrderAnalyticsChart: React.FC<OrderAnalyticsChartProps> = ({ data }) => {
  // Data for the Pie Chart (Order Status Distribution)
  const orderStatusData = data.orderStatusDistribution.map(item => ({
    name: item.status,
    value: item.count,
  }));

  return (
    <div>
      <h3 className="text-lg font-semibold mt-4 mb-2">توزيع الطلبات حسب الحالة:</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={orderStatusData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {orderStatusData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Placeholder for Sales Trends Chart - Implementation needed */}
      <h3 className="text-lg font-semibold mt-8 mb-2">اتجاهات المبيعات (تحتاج إلى تنفيذ):</h3>
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">مخطط اتجاهات المبيعات سيتم إضافته هنا.</p>
      </div>
    </div>
  );
};

export default OrderAnalyticsChart;
