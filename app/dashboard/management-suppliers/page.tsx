
import { Badge } from '@/components/ui/badge';
import { getSuppliers } from './actions/get-supplier';
import SupplierCard from './components/SupplierCard';
import AddSupplier from './components/SupplierUpsert';

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="flex min-h-screen flex-col p-4 md:p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div className='flex items-center gap-4'>
          <h1 className="text-2xl font-bold text-foreground">إدارة الموردين</h1>
          <Badge variant="outline">{suppliers.length}</Badge>
        </div>


        <AddSupplier
          mode='new'
          title={"إضافة مورد"}
          description={"يرجى إدخال بيانات المورد"}
          defaultValues={{
            type: '',
            name: '',
            email: '',
            phone: '',
            address: '',
          }} />
      </header>

      {/* Supplier list */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>
    </div>
  );
}
