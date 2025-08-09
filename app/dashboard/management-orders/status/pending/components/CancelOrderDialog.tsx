// app/dashboard/orders-management/status/pending/components/CancelOrderDialog.tsx
'use client';

import { useState } from 'react';

import { X } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import cancelOrder from '../actions/cancel-order';

interface CancelOrderDialogProps {
  orderId: string;
}

export default function CancelOrderDialog({ orderId }: CancelOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');

  const handleCancel = async () => {
    await cancelOrder(orderId, reason);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors duration-150"
        >
          <X className="h-4 w-4" />

        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد أنك تريد إلغاء هذا الطلب؟</AlertDialogTitle>
          <AlertDialogDescription>
            سيتم إلغاء الطلب ولن يتمكن العميل من استعادته.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-2">
          <Textarea
            placeholder="أدخل سبب الإلغاء"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel}>تأكيد</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
