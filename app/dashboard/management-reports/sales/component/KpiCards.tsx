import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Kpi {
  label: string;
  value: string;
  icon: string;
}

export default function KpiCards({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4'> {/* Increased gap */}
      {kpis.map((kpi, i) => (
        <Card key={i} className='text-center shadow-lg'> {/* Use default card border, increased shadow slightly */}
          <CardHeader className="p-4"> {/* Adjusted padding */}
            <div className='mb-2 text-3xl text-muted-foreground'>{kpi.icon}</div> {/* Icon color muted */}
            <CardTitle className='mt-1 text-2xl font-bold text-primary'>{kpi.value}</CardTitle> {/* Value as primary, larger */}
            <CardDescription className='mt-1 text-sm font-medium text-muted-foreground'>{kpi.label}</CardDescription> {/* Label muted and smaller */}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
