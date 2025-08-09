'use client';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function ConfirmDeleteDialog({
  onConfirm,
  children,
  title,
  description,
}: {
  onConfirm: () => void;
  children: React.ReactNode;
  title?: string; // Make props optional
  description?: string; // Make props optional
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle className='text-red-600'>{title || 'تأكيد الحذف'}</DialogTitle> {/* Use prop or default */}
        </DialogHeader>
        <div className='py-2 text-right text-base'>
          {description || 'هل أنت متأكد من هذا الإجراء؟ لا يمكن التراجع عنه.'} {/* Use prop or default */}
        </div>
        <DialogFooter className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => setOpen(false)}>
            إلغاء
          </Button>
          <Button
            variant='destructive'
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            تأكيد الحذف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
