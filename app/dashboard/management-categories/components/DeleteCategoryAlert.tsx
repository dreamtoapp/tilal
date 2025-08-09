'use client';

import { useState } from 'react';

import {
  Loader2,
  Trash,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { deleteCategory } from '../actions/deleteCategory';

interface DeleteCategoryAlertProps {
  categoryId: string;
}

export default function DeleteCategoryAlert({ categoryId }: DeleteCategoryAlertProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      const result = await deleteCategory(categoryId);
      const Swal = (await import('sweetalert2')).default;
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: '\u062a\u0645 \u0627\u0644\u062d\u0630\u0641 \u0628\u0646\u062c\u0627\u062d',
          text: '\u062a\u0645 \u0625\u0632\u0627\u0644\u0629 \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u062a\u0635\u0646\u064a\u0641 \u0645\u0646 \u0627\u0644\u0646\u0638\u0627\u0645',
          confirmButtonText: '\u062a\u0645',
          confirmButtonAriaLabel: '\u062a\u0623\u0643\u064a\u062f \u0627\u0633\u062a\u0644\u0627\u0645 \u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u0646\u062c\u0627\u062d',
        });
        return;
      }
      Swal.fire({
        icon: 'error',
        title: '\u062a\u0639\u0630\u0631 \u0627\u0644\u062d\u0630\u0641',
        text: result.message || '\u062d\u062f\u062b \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u0645\u062d\u0627\u0648\u0644\u0629 \u0627\u0644\u062d\u0630\u0641. \u064a\u0631\u062c\u0649 \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629 \u0644\u0627\u062d\u0642\u064b\u0627',
        confirmButtonText: '\u062d\u0633\u0646\u0627',
        confirmButtonAriaLabel: '\u062a\u0623\u0643\u064a\u062f \u0627\u0633\u062a\u0644\u0627\u0645 \u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u062e\u0637\u0623',
      });
    } catch {
      const Swal = (await import('sweetalert2')).default;
      Swal.fire({
        icon: 'error',
        title: '\u062e\u0637\u0623 \u063a\u064a\u0631 \u0645\u062a\u0648\u0642\u0639',
        text: '\u062d\u062f\u062b \u0639\u0637\u0644 \u062a\u0642\u0646\u064a \u063a\u064a\u0631 \u0645\u062a\u0648\u0642\u0639. \u064a\u0631\u062c\u0649 \u0625\u0628\u0644\u0627\u063a \u0627\u0644\u062f\u0639\u0645 \u0627\u0644\u0641\u0646\u064a',
        confirmButtonText: '\u062a\u0645 \u0627\u0644\u0625\u0628\u0644\u0627\u063a',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='size-10 flex flex-row-reverse hover:bg-destructive/90 hover:text-destructive-foreground'
          aria-label='فتح نافذة حذف التصنيف'
        >
          <Trash className='h-4 w-4 text-destructive' aria-hidden />
        </Button>
      </DialogTrigger>

      <DialogContent
        className='border-destructive/30 bg-background/95 backdrop-blur-sm'
        role='dialog'
        aria-labelledby='deleteConfirmationHeading'
        dir='rtl'
      >
        <DialogTitle id='deleteConfirmationHeading'>تأكيد الحذف النهائي للتصنيف</DialogTitle>

        <DialogHeader>
          <DialogTitle className='text-right text-xl font-bold text-destructive'>
            ⚠️ تأكيد الحذف النهائي
          </DialogTitle>

          <DialogDescription className='text-right text-sm text-muted-foreground/90'>
            سيتم حذف جميع بيانات التصنيف بما في ذلك:
          </DialogDescription>

          <div className='text-right text-muted-foreground/90'>
            <ul className='list-disc space-y-2 pr-4'>
              <li>المنتجات المرتبطة</li>
              <li>سجل الفئات الفرعية</li>
              <li>بيانات الوصف والترتيب</li>
            </ul>
          </div>
        </DialogHeader>

        <DialogFooter className='flex flex-row-reverse gap-3'>
          <DialogClose asChild>
            <Button
              variant='secondary'
              className='bg-muted/80 hover:bg-accent'
              aria-label='إلغاء عملية الحذف'
            >
              إلغاء الحذف
            </Button>
          </DialogClose>

          <Button
            onClick={handleDelete}
            disabled={isProcessing}
            className='bg-destructive/90 text-destructive-foreground hover:bg-destructive'
            aria-describedby='deleteConfirmationHeading'
          >
            {isProcessing ? (
              <>
                <Loader2 className='ml-2 h-4 w-4 animate-spin' aria-hidden />
                <span>جارِ تنفيذ العملية...</span>
              </>
            ) : (
              'تأكيد الحذف الدائم'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
