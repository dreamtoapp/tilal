
interface SalesData {
  day: string;
  value: number;
}

export default function SalesLineChart({
  salesData,
  filterSummary,
  lineColor, // New prop for line/dot color
}: {
  salesData: SalesData[];
  filterSummary: string;
  lineColor?: string; // Optional, with a fallback
}) {
  // Calculate points for SVG polyline
  const maxValue = Math.max(...salesData.map((d) => d.value), 1);
  const defaultLineColor = 'hsl(var(--chart-2))'; // Fallback to CSS variable for chart-2
  const chartHeight = 140;
  const chartWidth = 260;
  const pointGap = chartWidth / (salesData.length - 1 || 1);
  const points = salesData
    .map((d, i) => `${i * pointGap},${chartHeight - (d.value / maxValue) * chartHeight}`)
    .join(' ');

  return (
    <div className='w-full'>
      <div className='mb-2 text-center font-semibold text-primary'>{filterSummary}</div> {/* Use text-primary */}
      <div className='flex flex-col items-center rounded-lg bg-muted p-4'> {/* Use bg-muted */}
        <svg width={chartWidth} height={chartHeight} className='overflow-visible'>
          <polyline
            fill='none'
            stroke={lineColor || defaultLineColor} // Use prop or fallback
            strokeWidth='3'
            points={points}
          />
          {salesData.map((d, i) => (
            <circle
              key={i}
              cx={i * pointGap}
              cy={chartHeight - (d.value / maxValue) * chartHeight}
              r={5}
              fill={lineColor || defaultLineColor} // Use prop or fallback
            />
          ))}
        </svg>
        <div className='mt-2 flex w-full justify-between'>
          {salesData.map((d, i) => (
            <span key={i} className='w-8 text-center text-xs font-medium text-muted-foreground'> {/* Use text-muted-foreground */}
              {d.day}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
