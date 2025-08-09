'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { format, parse } from 'date-fns';
import { ar } from 'date-fns/locale';
import { toast } from 'sonner'; // For notifications

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Button } from '../../../components/ui/button';
import { createShift } from './actions/createShift';
import { deleteShift } from './actions/deleteShift';
import { fetchShifts } from './actions/fetchShifts';
import { Shift } from '@/types/databaseTypes';

// النصوص العربية
const UI_TEXT = {
  headerTitle: 'إدارة الورديات',
  addShiftButton: 'إضافة وردية جديدة',
  noShiftsMessage: 'لا توجد ورديات متوفرة. اضغط على الزر لإضافة وردية جديدة.',
  shiftName: 'اسم الوردية',
  shiftStartTime: 'وقت البدء',
  shiftEndTime: 'وقت الانتهاء',
  shiftDuration: 'مدة العمل',
  deleteButton: 'حذف',
  cancelButton: 'إلغاء',
  saveButton: 'حفظ',
  placeholder: {
    shiftName: "أدخل اسم الوردية (مثل 'نهار' أو 'ليل')",
  },
  dialogDescription: 'يرجى إدخال تفاصيل الوردية الجديدة أدناه.',
  errors: {
    nameRequired: 'يرجى إدخال اسم الوردية.',
    startTimeRequired: 'يرجى إدخال وقت البدء.',
    endTimeRequired: 'يرجى إدخال وقت الانتهاء.',
    invalidTime: 'وقت البدء يجب أن يكون قبل وقت الانتهاء.',
  },
  successMessages: {
    shiftAdded: 'تمت إضافة الوردية بنجاح!',
    shiftDeleted: 'تم حذف الوردية بنجاح!',
  },
  errorMessages: {
    fetchShifts: 'فشل في تحميل الورديات.',
    addShift: 'فشل في إضافة الوردية.',
    deleteShift: 'فشل في حذف الوردية.',
  },
};

// دالة لتحويل التوقيت إلى تنسيق عربي
const formatTimeToArabic = (time: string) => {
  const [hours, minutes] = time.split(':');
  const period = Number(hours) >= 12 ? 'م' : 'ص';
  const formattedHours = Number(hours) % 12 || 12; // تحويل إلى 12 ساعة
  return `${formattedHours}:${minutes} ${period}`;
};

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Partial<Shift>[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newShift, setNewShift] = useState<Partial<Shift>>({
    name: '',
    startTime: '',
    endTime: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch shifts on page load
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const shiftsData = await fetchShifts();
        setShifts(shiftsData);
      } catch (error) {
        console.error('Error fetching shifts:', error);
        toast.error(UI_TEXT.errorMessages.fetchShifts);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Handle dialog submission
  const handleAddShift = useCallback(async () => {
    if (!newShift.name || !newShift.startTime || !newShift.endTime) {
      setErrors({
        name: !newShift.name ? UI_TEXT.errors.nameRequired : '',
        startTime: !newShift.startTime ? UI_TEXT.errors.startTimeRequired : '',
        endTime: !newShift.endTime ? UI_TEXT.errors.endTimeRequired : '',
      });
      return;
    }

    // Validate that startTime is earlier than endTime
    const start = parse(newShift.startTime, 'HH:mm', new Date());
    const end = parse(newShift.endTime, 'HH:mm', new Date());

    if (start >= end) {
      setErrors({
        ...errors,
        endTime: UI_TEXT.errors.invalidTime,
      });
      return;
    }

    try {
      const createdShift = await createShift({
        ...newShift,
        startTime: format(start, 'HH:mm'), // Convert to 24-hour format for storage
        endTime: format(end, 'HH:mm'), // Convert to 24-hour format for storage
      } as Shift);

      setShifts([...shifts, createdShift]);
      setIsDialogOpen(false); // Close the dialog
      setNewShift({ name: '', startTime: '', endTime: '' }); // Reset form
      setErrors({});
      toast.success(UI_TEXT.successMessages.shiftAdded);
    } catch (error) {
      console.error('Error creating shift:', error);
      toast.error(UI_TEXT.errorMessages.addShift);
    }
  }, [newShift, shifts, errors]);

  // Handle shift deletion
  const handleDeleteShift = useCallback(async (id: string) => {
    try {
      await deleteShift(id);
      setShifts((prevShifts) => prevShifts.filter((shift) => shift.id !== id));
      toast.success(UI_TEXT.successMessages.shiftDeleted);
    } catch (error) {
      console.error('Error deleting shift:', error);
      toast.error(UI_TEXT.errorMessages.deleteShift);
    }
  }, []);

  // Memoized shifts list
  const shiftsList = useMemo(() => {
    if (isLoading) {
      return (
        <div className='flex h-40 items-center justify-center'>
          <p className='text-muted-foreground'>جاري التحميل...</p>
        </div>
      );
    }

    if (shifts.length === 0) {
      return (
        <div className='col-span-full flex flex-col items-center justify-center space-y-4'>
          <p className='text-center text-muted-foreground'>{UI_TEXT.noShiftsMessage}</p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className='bg-primary text-primary-foreground'
          >
            {UI_TEXT.addShiftButton}
          </Button>
        </div>
      );
    }

    return (
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {shifts.map((shift) => {
          const start = parse(shift.startTime!, 'HH:mm', new Date());
          const end = parse(shift.endTime!, 'HH:mm', new Date());

          return (
            <Card
              key={shift.id}
              className='transition-all duration-300 hover:border-primary hover:shadow-lg'
            >
              <CardHeader>
                <CardTitle>{shift.name}</CardTitle>
                <CardDescription>
                  {formatTimeToArabic(format(start, 'hh:mm a', { locale: ar }))} -{' '}
                  {formatTimeToArabic(format(end, 'hh:mm a', { locale: ar }))}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  {UI_TEXT.shiftDuration}:{' '}
                  {Math.abs((end.getTime() - start.getTime()) / (1000 * 60 * 60)).toFixed(2)} ساعات
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => handleDeleteShift(shift.id!)}
                  aria-label={`${UI_TEXT.deleteButton} ${shift.name}`}
                >
                  {UI_TEXT.deleteButton}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    );
  }, [shifts, isLoading, handleDeleteShift]);

  return (
    <div className='mx-auto max-w-6xl space-y-6 rounded-lg bg-background p-6 shadow-md'>
      {/* Header */}
      <h1 className='text-center text-3xl font-bold text-primary'>{UI_TEXT.headerTitle}</h1>

      {/* Add Shift Button */}
      <div className='flex justify-end'>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className='bg-green-600 text-white hover:bg-green-700'
          aria-label={UI_TEXT.addShiftButton}
        >
          {UI_TEXT.addShiftButton}
        </Button>
      </div>

      {/* Shifts List */}
      {shiftsList}

      {/* Add Shift Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{UI_TEXT.addShiftButton}</DialogTitle>
            <DialogDescription>{UI_TEXT.dialogDescription}</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            {/* Name Field */}
            <div>
              <Label htmlFor='shiftName' className='block text-sm font-medium'>
                {UI_TEXT.shiftName}
              </Label>
              <Input
                id='shiftName'
                value={newShift.name || ''}
                onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
                placeholder={UI_TEXT.placeholder.shiftName}
                className='mt-1 block w-full border-input focus:border-primary focus:ring-primary'
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className='mt-1 text-xs text-red-500'>{errors.name}</p>}
            </div>

            {/* Start Time Field */}
            <div>
              <Label htmlFor='startTime' className='block text-sm font-medium'>
                {UI_TEXT.shiftStartTime}
              </Label>
              <Input
                id='startTime'
                type='time'
                value={newShift.startTime || ''}
                onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                className='mt-1 block w-full border-input focus:border-primary focus:ring-primary'
                aria-invalid={!!errors.startTime}
              />
              {errors.startTime && <p className='mt-1 text-xs text-red-500'>{errors.startTime}</p>}
            </div>

            {/* End Time Field */}
            <div>
              <Label htmlFor='endTime' className='block text-sm font-medium'>
                {UI_TEXT.shiftEndTime}
              </Label>
              <Input
                id='endTime'
                type='time'
                value={newShift.endTime || ''}
                onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                className='mt-1 block w-full border-input focus:border-primary focus:ring-primary'
                aria-invalid={!!errors.endTime}
              />
              {errors.endTime && <p className='mt-1 text-xs text-red-500'>{errors.endTime}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsDialogOpen(false)}
              aria-label={UI_TEXT.cancelButton}
            >
              {UI_TEXT.cancelButton}
            </Button>
            <Button onClick={handleAddShift} aria-label={UI_TEXT.saveButton}>
              {UI_TEXT.saveButton}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
