import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';

import { getCustomers } from './actions/getCustomers';
import CustomerUpsert from './components/CustomerUpsert';
import CustomerList from './components/CustomerList';

export default async function CustomerPage() {
  const customers = await getCustomers();

  if (!customers) {
    notFound();
  }

  return (
    <div className='flex flex-col min-h-full space-y-6 bg-background text-foreground'>
      {/* Page Title */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <h1 className='text-3xl font-bold text-primary'>ادارة العملاء</h1>
          <Badge variant="outline" className="border-primary/20 text-primary">{customers.length}</Badge>
        </div>
        <CustomerUpsert
          mode='new'
          title="إضافة عميل جديد"
          description="يرجى إدخال بيانات العميل"
          defaultValues={{
            name: '',
            email: '',
            phone: '',
            password: '',
          }} />
      </div>

      {/* Customer List with Sorting */}
      <CustomerList customers={customers.map(customer => ({
        ...customer,
        name: customer.name || 'No Name'
      }))} />
    </div>
  );
}
