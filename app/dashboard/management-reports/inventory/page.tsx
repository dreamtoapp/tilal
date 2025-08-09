import { getInventory } from './actions/getInventory';
import { InventoryTable } from './components/InventoryTable';

export default async function InventoryReportPage() {
  const products = await getInventory();

  return (
    <div className='rtl mx-auto max-w-6xl px-4 py-10 text-right md:px-6'> {/* Adjusted padding */}
      <div className="flex justify-between items-center mb-8"> {/* Increased bottom margin */}
        <h1 className='text-3xl font-bold text-foreground'>تقرير المخزون</h1> {/* Changed text-primary to text-foreground for consistency */}
      </div>
      <InventoryTable products={products} />
    </div>
  );
}
