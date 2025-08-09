'use client';

export default function ChartTypeSwitcher({
    type,
    onTypeChange,
}: {
    type: string;
    onTypeChange: (type: string) => void;
}) {
    return (
        <div className='flex items-center gap-2'>
            <button
                type='button'
                className={`rounded border px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
                    ${type === 'bar'
                        ? 'bg-primary text-primary-foreground shadow hover:bg-primary/90'
                        : 'border-border bg-transparent text-primary hover:bg-accent hover:text-accent-foreground'}`}
                onClick={() => onTypeChange('bar')}
            >
                عمودى
            </button>
            <button
                type='button'
                className={`rounded border px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
                    ${type === 'line'
                        ? 'bg-primary text-primary-foreground shadow hover:bg-primary/90'
                        : 'border-border bg-transparent text-primary hover:bg-accent hover:text-accent-foreground'}`}
                onClick={() => onTypeChange('line')}
            >
                خطى
            </button>
            <button
                type='button'
                className={`rounded border px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
                    ${type === 'pie'
                        ? 'bg-primary text-primary-foreground shadow hover:bg-primary/90'
                        : 'border-border bg-transparent text-primary hover:bg-accent hover:text-accent-foreground'}`}
                onClick={() => onTypeChange('pie')}
            >
                دائرى
            </button>
        </div>
    );
} 