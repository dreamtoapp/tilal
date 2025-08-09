import { useState } from 'react';
import { Button } from '@/components/ui/button'; // Import Button
interface Product {
  name: string;
  qty: number;
  unitPrice: number;
  total: number;
}

interface TopProductsTotals {
  totalTopQty: number;
  totalTopSales: number;
  totalAllQty: number;
  totalAllSales: number;
  remaining: number;
}

function formatNumber(val: number | undefined | null) {
  if (val === null || val === undefined) return '-';
  return val.toLocaleString('ar-EG');
}

export default function TopProductsTable({
  products,
  totals,
  allProducts,
}: {
  products: Product[];
  totals: TopProductsTotals;
  allProducts: Product[];
}) {
  const [showAll, setShowAll] = useState(false);
  const displayProducts = showAll ? allProducts : products;
  const sumQty = displayProducts.reduce((sum, p) => sum + (p.qty || 0), 0);
  const sumTotal = displayProducts.reduce((sum, p) => sum + (p.total || 0), 0);

  return (
    <div className='overflow-x-auto rounded-lg border border-border bg-card shadow'> {/* Added border and bg-card to outer div */}
      <table className='min-w-full text-sm'><thead className="border-b border-border"><tr className="bg-muted"><th className='px-4 py-3 text-right font-medium text-muted-foreground'>المنتج</th><th className='px-4 py-3 text-right font-medium text-muted-foreground'>الكمية</th><th className='px-4 py-3 text-right font-medium text-muted-foreground'>سعر الوحدة</th>
        <th className='px-4 py-3 text-right font-medium text-muted-foreground'>الإجمالي</th>
      </tr>
      </thead>
        <tbody className="text-card-foreground">
          {displayProducts.map((p, i) => (
            <tr key={i} className="border-b border-border hover:bg-muted/50"><td className='px-4 py-3'>{p.name}</td><td className='px-4 py-3'>{formatNumber(p.qty)}</td><td className='px-4 py-3'>{formatNumber(p.unitPrice)}</td><td className='px-4 py-3'>{formatNumber(p.total)}</td></tr>
          ))}
          {/* Totals row */}
          <tr className='border-b border-border bg-muted/50 font-semibold'><td className='px-4 py-3'>الإجمالي</td><td className='px-4 py-3'>{formatNumber(sumQty)}</td><td className='px-4 py-3'></td><td className='px-4 py-3'>{formatNumber(sumTotal)}</td></tr>
          {/* Show All button */}
          {!showAll && totals.remaining > 0 && (
            <tr className="border-none"><td colSpan={4} className='py-3 text-center'>
              <Button
                variant="link"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAll(true);
                }}
              >
                عرض الكل ({formatNumber(totals.remaining)} منتج آخر)
              </Button>
            </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
