"use client";

import React from 'react';

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface OrderStatusData {
  status: string;
  _count: { status: number };
}

interface OrderStatusChartProps {
  data: OrderStatusData[];
}

// Use semantic chart colors from Tailwind theme
const SEMANTIC_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const OrderStatusChart: React.FC<OrderStatusChartProps> = ({ data }) => {
  // Transform data for the pie chart
  const chartData = data?.map(item => ({
    name: item.status,
    value: item._count.status,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8" // This fill might be overridden by Cell fill
            dataKey="value"
            label
          >
            {chartData?.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={SEMANTIC_COLORS[index % SEMANTIC_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderStatusChart;
