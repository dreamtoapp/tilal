'use client';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { UserRole } from '@/constant/enums';

import AdminMaintenanceDashboard from './component/admin-dashboard';
import TenantMaintenanceDashboard from './component/tenant-dashboard';

export default function MaintenancePage() {
  // Use a union type for role: UserRole | 'tenant'
  const [role, setRole] = useState<UserRole | 'tenant'>(UserRole.ADMIN);

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6 flex items-center gap-4'>
        <span className='font-semibold'>Role Preview:</span>
        <Button
          variant={role === UserRole.ADMIN ? 'default' : 'outline'}
          onClick={() => setRole(UserRole.ADMIN)}
        >
          Admin
        </Button>
        <Button
          variant={role === 'tenant' ? 'default' : 'outline'}
          onClick={() => setRole('tenant')}
        >
          Tenant
        </Button>
      </div>
      {role === UserRole.ADMIN ? <AdminMaintenanceDashboard /> : <TenantMaintenanceDashboard />}
    </div>
  );
}
