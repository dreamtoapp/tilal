'use client';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

// Using CSS variables defined by Tailwind for theme colors
// Ensure these CSS variables are available globally (e.g., from globals.css or layout)
// Using CSS variables defined in globals.css for chart colors
const CHART_COLORS = {
    // Main color for single series charts (line, bar)
    main: 'hsl(var(--chart-1))', // Using --chart-1 as the primary chart color
    // Palette for multi-series charts (pie)
    palette: [
        'hsl(var(--chart-1))',
        'hsl(var(--chart-2))',
        'hsl(var(--chart-3))',
        'hsl(var(--chart-4))',
        'hsl(var(--chart-5))',
    ]
};

export default function AnalyticsChart({
    salesByMonth,
    chartType,
}: {
    salesByMonth: { month: string; sales: number }[];
    chartType: string;
}) {
    if (chartType === 'line') {
        return (
            <div className='h-80 w-full'>
                <ResponsiveContainer width='100%' height='100%'>
                    <LineChart data={salesByMonth}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='month' tick={{ fontSize: 12 }} angle={-30} textAnchor='end' />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value) => [value, 'المبيعات']} />
                        <Legend verticalAlign='top' height={36} />
                        <Line
                            type='monotone'
                            dataKey='sales'
                            stroke={CHART_COLORS.main}
                            name='المبيعات'
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
    if (chartType === 'pie') {
        return (
            <div className='flex h-80 w-full items-center justify-center'>
                <PieChart width={360} height={320}>
                    <Pie
                        data={salesByMonth}
                        dataKey='sales'
                        nameKey='month'
                        cx='50%'
                        cy='50%'
                        outerRadius={100}
                        label
                    >
                        {salesByMonth.map((_entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={CHART_COLORS.palette[idx % CHART_COLORS.palette.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'المبيعات']} />
                    <Legend />
                </PieChart>
            </div>
        );
    }
    // Default: bar
    return (
        <div className='h-80 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={salesByMonth} layout='horizontal'>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='month' tick={{ fontSize: 12 }} angle={-30} textAnchor='end' />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => [value, 'المبيعات']} />
                    <Legend verticalAlign='top' height={36} />
                    <Bar dataKey='sales' fill={CHART_COLORS.main} name='المبيعات' radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
} 