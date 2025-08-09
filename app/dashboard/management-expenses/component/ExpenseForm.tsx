'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

// Define type for the submitted expense data
interface ExpenseFormData {
  amount: number;
  note: string;
  category: string;
}

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => Promise<void>; // Use specific type
  initialData?: { amount?: number; note?: string; category?: string };
  onCancel?: () => void;
}

export default function ExpenseForm({ onSubmit, initialData, onCancel }: ExpenseFormProps) {
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [note, setNote] = useState(initialData?.note || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ amount: parseFloat(amount), note, category });
      toast.success('تم الحفظ بنجاح');
      setAmount(''); // Reset form fields
      setNote('');
      setCategory('');
      if (onCancel) onCancel();
    } catch (e) {
      let errorMessage = 'حدث خطأ غير متوقع';
      if (e instanceof Error) errorMessage = e.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='mb-4'>
      <CardContent>
        <form className='flex flex-col gap-4 py-4' onSubmit={handleSubmit}>
          <div>
            <label className='mb-1 block font-medium'>المبلغ *</label>
            <Input
              type='number'
              step='0.01'
              min='0.01'
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className='mb-1 block font-medium'>التصنيف</label>
            <Input
              type='text'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder='تصنيف المصروف (اختياري)'
            />
          </div>
          <div>
            <label className='mb-1 block font-medium'>الوصف / الملاحظة</label>
            <Input
              type='text'
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder='ملاحظة (اختياري)'
            />
          </div>
          <div className='flex justify-end gap-2'>
            {onCancel && (
              <Button type='button' variant='outline' onClick={onCancel}>
                إلغاء
              </Button>
            )}
            <Button type='submit' disabled={loading}>
              {loading ? '...جارٍ الحفظ' : 'حفظ'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
