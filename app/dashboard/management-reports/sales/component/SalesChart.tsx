interface SalesData {
  day: string;
  value: number;
}

export default function SalesChart({
  salesData,
  filterSummary,
  barColor, // New prop for bar color
}: {
  salesData: SalesData[];
  filterSummary: string;
  barColor?: string; // Optional, with a fallback
}) {
  // Find the maximum value for scaling
  const maxValue = Math.max(...salesData.map((d) => d.value), 1);
  const defaultBarColor = 'hsl(var(--primary))'; // Fallback to CSS variable for primary

  return (
    <div className='w-full'>
      <div className='mb-2 text-center font-semibold text-primary'>{filterSummary}</div> {/* Use text-primary */}
      <div className='flex h-56 w-full items-end justify-between gap-3 overflow-x-auto rounded-lg bg-muted p-4'> {/* Use bg-muted */}
        {salesData.map((d, i) => (
          <div key={i} className='flex w-full flex-col items-center'>
            {/* Value label above the bar */}
            <span
              className='mb-1 text-xs font-bold text-primary' // Use text-primary
              aria-label={`قيمة المبيعات: ${d.value} ر.س`}
            >
              {d.value.toLocaleString('ar-EG')}
            </span>
            <div
              className='rounded-t-lg shadow-md transition-all duration-300 focus:outline-none' // Removed hover:bg-blue-600
              style={{
                height: `${(d.value / maxValue) * 140}px`,
                width: '28px',
                backgroundColor: barColor || defaultBarColor, // Use prop or fallback
              }}
              title={`${d.value.toLocaleString('ar-EG')} ر.س`}
              tabIndex={0}
              aria-label={`مبيعات يوم ${d.day}: ${d.value} ر.س`}
            ></div>
            <span className='mt-1 text-xs font-medium text-muted-foreground'>{d.day}</span> {/* Use text-muted-foreground */}
          </div>
        ))}
      </div>
    </div>
  );
}
