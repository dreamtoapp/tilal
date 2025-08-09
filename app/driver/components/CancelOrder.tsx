"use client";

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
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { cancelOrder } from '../actions/cancelOrder';

interface CancelOrderProps {
  orderId: string;
  orderNumber: string;
  driverId: string;
  driverName: string;
}

function CancelOrder({ orderId, orderNumber, }: CancelOrderProps) {
  const router = useRouter();
  const [reason, setReason] = React.useState('');
  const [invoiceDigits, setInvoiceDigits] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);

  // Get last 4 digits of the displayed order number
  const requiredDigits = orderNumber.slice(-4);
  const isReasonValid = reason.trim().length > 0;
  const isDigitsValid = invoiceDigits === requiredDigits;

  const handleConfirm = async () => {
    if (isReasonValid && isDigitsValid) {
      await cancelOrder(orderId, reason);
      router.refresh();

      setIsOpen(false);
      setReason('');
      setInvoiceDigits('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='destructive'>الغاء الطلبية</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تأكيد إلغاء الطلبية</DialogTitle>
          <DialogDescription>
            يرجى إدخال التفاصيل المطلوبة لإلغاء الطلبية رقم: <strong>{orderNumber}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <Textarea
            rows={3}
            placeholder='اكتب سبب الإلغاء هنا...'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className='text-right'
            autoFocus
          />
          <Input
            placeholder={`الرجاء إدخال الأرقام الأربعة الأخيرة (${requiredDigits})`}
            value={invoiceDigits}
            onChange={(e) => setInvoiceDigits(e.target.value)}
            className='text-right'
          />
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            إلغاء
          </Button>
          <Button
            variant='destructive'
            onClick={handleConfirm}
            disabled={!isReasonValid || !isDigitsValid}
          >
            تأكيد الإلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CancelOrder;
