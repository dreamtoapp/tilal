import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';

import { getDrivers } from './actions/getDrivers';
import DriverCard from './components/DriverCard';
import DriverUpsert from './components/DriverUpsert';

export default async function DriversPage() {
  const drivers = await getDrivers();

  if (!drivers) {
    notFound();
  }

  return (
    <div className='space-y-6 bg-background p-6 text-foreground'>
      {/* Page Title */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <h1 className='text-3xl font-bold text-primary'>ادارة السائقين</h1>
          <Badge variant="outline" className="border-border text-primary">{drivers.length}</Badge>
        </div>
        <DriverUpsert
          mode='new'
          title="إضافة سائق جديد"
          description="يرجى إدخال بيانات السائق"
          defaultValues={{
            name: '',
            email: '',
            phone: '',
            addressLabel: 'المنزل',
            district: '',
            street: '',
            buildingNumber: '',
            floor: '',
            apartmentNumber: '',
            landmark: '',
            deliveryInstructions: '',
            password: '',
            vehicleType: 'CAR',
            vehiclePlateNumber: '',
            vehicleColor: '',
            vehicleModel: '',
            driverLicenseNumber: '',
            experience: '',
            maxOrders: '',
          }} />
      </div>

      {/* Driver List */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {drivers.length > 0 ? (
          drivers.map((driver) => (
            <DriverCard key={driver.id} driver={{
              ...driver,
              name: driver.name || '',
              experience: driver.experience?.toString() || '',
              maxOrders: driver.maxOrders?.toString() || '3',
            }} />
          ))
        ) : (
          <div className='col-span-full text-center text-muted-foreground'>
            لا يوجد سائقون متاحون. يرجى إضافة سائق جديد.
          </div>
        )}
      </div>
    </div>
  );
}
