'use client'; // Mark this as a Client Component
import { useState } from 'react';

import { toast } from 'sonner'; // Import toast for client-side notifications
import { Loader2, Mail, CheckSquare, Square, Trash2 } from 'lucide-react'; // Import lucide icons
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';
import { Badge } from '@/components/ui/badge'; // Import Badge component
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { deleteSubscriber } from '../actions/newsletter';
import { sendBulkEmail } from '../actions/sendBulkEmail';
import { Icon } from '@/components/icons/Icon';

interface Subscriber {
  id: string;
  email: string;
  createdAt: Date;
}

export default function SubscriberTable({ subscribers }: { subscribers: Subscriber[] }) {
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false); // State to track loading

  // Handle bulk email sending
  async function handleSendBulkEmail(formData: FormData) {
    setIsSending(true); // Start loading
    try {
      // Add selected emails to the form data
      selectedEmails.forEach((email) => {
        formData.append('selectedEmails', email);
      });
      const result = await sendBulkEmail(formData);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
      }
    } catch {
      toast.error('فشل في إرسال البريد الإلكتروني');
    } finally {
      setIsSending(false); // Stop loading
    }
  }

  // Handle subscriber deletion
  async function handleDeleteSubscriber(id: string) {
    const result = await deleteSubscriber(id);
    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      toast.success(result.success);
    }
  }

  // Select/Deselect All Checkboxes
  const toggleAllCheckboxes = (checked: boolean) => {
    const emails = checked ? subscribers.map((sub) => sub.email) : [];
    setSelectedEmails(emails);
  };

  // Handle WhatsApp/SMS button click (placeholder for now)
  const handleSendWhatsAppSMS = () => {
    if (selectedEmails.length === 0) {
      toast.error('يرجى اختيار مستلم واحد على الأقل');
      return;
    }
    toast.info('سيتم إضافة وظيفة إرسال WhatsApp/SMS قريبًا!');
  };

  return (
    <>
      {/* Bulk Email Form */}
      <form action={handleSendBulkEmail} className='mx-auto mb-8 max-w-2xl'>
        <h2 className='mb-4 text-center text-xl font-semibold text-primary'>
          إرسال منشور إلكتروني
        </h2>
        <div className='space-y-4'>
          <Input name='subject' placeholder='العنوان' required className='w-full' />
          <textarea
            name='message'
            placeholder='الرسالة'
            rows={5}
            className='w-full resize-none rounded border p-2 focus:outline-none focus:ring-2 focus:ring-primary'
            required
          ></textarea>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <Button
              type='submit'
              className='flex w-full items-center justify-center bg-blue-600 transition-all hover:bg-blue-700 md:w-auto'
              disabled={isSending} // Disable button while loading
            >
              {isSending ? (
                <Loader2 className={iconVariants({ size: 'xs', animation: 'spin', className: 'mr-2' })} /> // Use direct import + CVA
              ) : (
                <Mail className={iconVariants({ size: 'xs', className: 'mr-2' })} /> // Use direct import + CVA
              )}
              {isSending ? 'جاري الإرسال...' : 'إرسال البريد الإلكتروني'}
            </Button>
            <Button
              type='button'
              className='flex w-full items-center justify-center bg-green-600 transition-all hover:bg-green-700 md:w-auto'
              onClick={handleSendWhatsAppSMS}
            >
              <Icon name="Whatsapp" className={iconVariants({ size: 'xs', className: 'mr-2' })} /> إرسال WhatsApp
            </Button>
            <Button
              type='button'
              className='flex w-full items-center justify-center bg-green-600 transition-all hover:bg-green-700 md:w-auto'
              onClick={handleSendWhatsAppSMS}
            >
              <Icon name="MessageSquare" className={iconVariants({ size: 'xs', className: 'mr-2' })} /> إرسال SMS
            </Button>
          </div>
        </div>
      </form>

      {/* Select All / Deselect All Buttons */}
      <div className='mt-4 flex items-center justify-between'>
        {/* Left Side: Buttons */}
        <div className='flex gap-3'>
          <Button
            variant='outline'
            onClick={() => toggleAllCheckboxes(true)}
            aria-label='تحديد جميع المشتركين'
            className='flex items-center gap-2'
          >
            <CheckSquare className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */} تحديد الكل
          </Button>
          <Button
            variant='secondary'
            onClick={() => toggleAllCheckboxes(false)}
            aria-label='إلغاء تحديد جميع المشتركين'
            className='flex items-center gap-2'
          >
            <Square className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */} إلغاء التحديد
          </Button>
        </div>
        {/* Right Side: Badges */}
        <div className='flex gap-3'>
          <Badge variant='secondary'>عدد المشتركين: {subscribers.length}</Badge>
          <Badge className='bg-primary text-white hover:bg-primary/90'>
            {selectedEmails.length} مختار
          </Badge>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className='mt-6 overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center'>تحديد</TableHead>
              <TableHead className='text-center'>البريد الإلكتروني</TableHead>
              <TableHead className='hidden text-center md:table-cell'>تاريخ الاشتراك</TableHead>
              <TableHead className='text-center'>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell className='text-center'>
                  <input
                    type='checkbox'
                    value={subscriber.email}
                    checked={selectedEmails.includes(subscriber.email)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEmails([...selectedEmails, subscriber.email]);
                      } else {
                        setSelectedEmails(
                          selectedEmails.filter((email) => email !== subscriber.email),
                        );
                      }
                    }}
                    className='h-4 w-4 accent-primary'
                  />
                </TableCell>
                <TableCell className='text-center font-medium'>{subscriber.email}</TableCell>
                <TableCell className='hidden text-center md:table-cell'>
                  {new Date(subscriber.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className='text-center'>
                  <div className='flex justify-center space-x-2'>
                    {/* Delete Subscriber */}
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleDeleteSubscriber(subscriber.id)}
                      className='bg-red-600 transition-all hover:bg-red-700'
                    >
                      <Trash2 className={iconVariants({ size: 'xs' })} /> {/* Use direct import + CVA */}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
