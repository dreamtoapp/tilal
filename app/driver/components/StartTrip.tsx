'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import React from 'react';

import { Button } from '../../../components/ui/button';
import { startTrip } from '../actions/startTrip';
import { Icon } from '@/components/icons/Icon';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

interface Props {
  orderId: string;
  driverId: string;
  latitude: string;
  longitude: string;
  driverName: string;
}

function StartTrip({ orderId, driverId, latitude, longitude }: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleStartTrip = async () => {
    setLoading(true);
    try {
      if (!orderId) {
        toast.error('لا يوجد سائق لهذا الطلب');
        setLoading(false);
        return;
      }
      const result = await startTrip(orderId, driverId, latitude, longitude);
      if (!result.success) {
        toast.error(result.error ?? 'حدث خطأ غير متوقع');
        setLoading(false);
        return;
      }
      setOpen(false);
      router.push('/driver');
    } catch (error) {
      let errorMessage = 'فشل في الحصول على الموقع';
      if (error instanceof Error) errorMessage = error.message;
      else if (typeof error === 'string') errorMessage = error;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='default' size="icon" className='flex items-center justify-center gap-4'>
          <Icon name="Rocket" size="xl" className="text-white" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>تأكيد بدء الرحلة</AlertDialogTitle>
          <AlertDialogDescription>
            هل أنت متأكد أنك تريد بدء الرحلة لهذا الطلب؟ لا يمكنك بدء أكثر من رحلة في نفس الوقت.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={handleStartTrip} disabled={loading}>
            {loading ? 'جاري البدء...' : 'بدء الرحلة'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default StartTrip;
