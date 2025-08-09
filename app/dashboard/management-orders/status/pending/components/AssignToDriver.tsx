'use client';

import { useRouter } from 'next/navigation';
import { Truck } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface DriverSelectionProps {
  orderId: string;
  currentDriverId?: string;
}

export default function AssignToDriver({ orderId, currentDriverId }: DriverSelectionProps) {
  const router = useRouter();

  const handleNavigateToAssign = () => {
    router.push(`/dashboard/management-orders/assign-driver/${orderId}`);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleNavigateToAssign}
    >
      <Truck className="h-4 w-4 ml-2" />
      {currentDriverId ? 'تغيير السائق' : 'تعيين سائق'}
    </Button>
  );
}
