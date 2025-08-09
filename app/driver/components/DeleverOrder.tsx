import React from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import { deleverOrder } from '../actions/deleverOrder';

interface DeleverOrderProps {
  orderId: string;
  orderNumber: string;
  driverId: string;
  driverName: string;
}

function DeleverOrder({ orderId, driverId, driverName }: DeleverOrderProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    // Add your delivery confirmation logic here
    await deleverOrder(orderId);
    router.push(`/driver-trip/driver?driverId=${driverId}&status=InWay&name=${driverName}`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='default'>تسليم الطلبية</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>تأكيد التسليم</DialogTitle>
          <DialogDescription>هل أنت متأكد أنك تريد تسليم هذه الطلبية؟</DialogDescription>
        </DialogHeader>

        <DialogFooter className='flex w-full flex-col items-center gap-8'>
          <Button variant='destructive' className='w-full' onClick={handleConfirm}>
            تأكيد التسليم
          </Button>
          <Button variant='outline' onClick={() => setOpen(false)} className='w-full'>
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleverOrder;
