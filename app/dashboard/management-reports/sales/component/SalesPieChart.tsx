
interface SalesData {
  day: string;
  value: number;
}

export default function SalesPieChart({
  salesData,
  filterSummary,
  colors: propColors, // New prop for colors array
}: {
  salesData: SalesData[];
  filterSummary: string;
  colors?: string[]; // Optional, with a fallback
}) {
  const total = salesData.reduce((sum, d) => sum + d.value, 0) || 1;
  let cumulative = 0;

  const defaultColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--primary))', // Adding a few more fallbacks
    'hsl(var(--accent))'
  ];
  const chartColors = propColors && propColors.length > 0 ? propColors : defaultColors;

  const slices = salesData.map((d, i) => {
    const start = (cumulative / total) * 2 * Math.PI;
    cumulative += d.value;
    const end = (cumulative / total) * 2 * Math.PI;
    const x1 = 80 + 70 * Math.sin(start);
    const y1 = 80 - 70 * Math.cos(start);
    const x2 = 80 + 70 * Math.sin(end);
    const y2 = 80 - 70 * Math.cos(end);
    const largeArc = end - start > Math.PI ? 1 : 0;
    const pathData = `M80,80 L${x1},${y1} A70,70 0 ${largeArc} 1 ${x2},${y2} Z`;
    return (
      <path key={i} d={pathData} fill={chartColors[i % chartColors.length]} stroke='hsl(var(--card))' strokeWidth={2} /> // Use card background for stroke
    );
  });

  return (
    <div className='w-full'>
      <div className='mb-2 text-center font-semibold text-primary'>{filterSummary}</div> {/* Use text-primary */}
      <div className='flex flex-col items-center rounded-lg bg-muted p-4'> {/* Use bg-muted */}
        <svg width={160} height={160} viewBox='0 0 160 160'>
          {slices}
        </svg>
        <div className='mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2'> {/* Adjusted gap */}
          {salesData.map((d, i) => (
            <span key={i} className='flex items-center text-xs font-medium text-muted-foreground'> {/* Use text-muted-foreground */}
              <span
                className='ml-1 inline-block h-3 w-3 rounded-full rtl:ml-0 rtl:mr-1' // Adjusted margin for RTL
                style={{ backgroundColor: chartColors[i % chartColors.length] }}
              ></span>
              {d.day}: {d.value.toLocaleString('ar-EG')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
