'use client';
import { useState } from 'react';
import { toast } from 'sonner';

import { sendInvoiceEmail } from '@/app/dashboard/show-invoice/actions/sendInvoiceEmail';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/icons/Icon';

function SendOrderViaEmail({
  invoiceNumber,
  orderId,
  email,
}: {
  invoiceNumber: string;
  orderId: string;
  email: string;
}) {
  const [ccEmail, setCcEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendInvoice = async () => {
    setIsLoading(true);
    toast.info('جارٍ إرسال الفاتورة...');
    try {
      await sendInvoiceEmail({
        to: email,
        cc: ccEmail || undefined,
        orderNumber: invoiceNumber,
        orderId: orderId,
      });
      toast.success('تم إرسال الفاتورة بنجاح!');
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast.error('فشل في إرسال الفاتورة.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="btn-add w-full sm:w-auto flex items-center gap-2 shadow-md">
          <Icon name="Mail" className="h-4 w-4" />
          إرسال الفاتورة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Icon name="Send" className="h-5 w-5 text-feature-commerce icon-enhanced" />
            إرسال الفاتورة عبر البريد الإلكتروني
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            تأكيد إرسال الفاتورة رقم: <span className="font-medium text-foreground">{invoiceNumber}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Primary Email Display */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">البريد الإلكتروني الأساسي</Label>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
              <Icon name="Mail" className="h-4 w-4 text-green-600" />
              <span className="text-green-700 font-medium">{email}</span>
            </div>
          </div>

          {/* CC Email Input */}
          <div className="space-y-2">
            <Label htmlFor="ccEmail" className="text-sm font-medium text-foreground">
              نسخة كربونية (اختياري)
            </Label>
            <div className="relative">
              <Icon name="Copy" className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="ccEmail"
                type="email"
                placeholder="أدخل بريد إلكتروني إضافي..."
                value={ccEmail}
                onChange={(e) => setCcEmail(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {/* CC Email Preview */}
          {ccEmail && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">سيتم إرسال نسخة إلى</Label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <Icon name="Copy" className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700 font-medium">{ccEmail}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3">
          <DialogTrigger asChild>
            <Button variant="outline" className="btn-cancel-outline">
              إلغاء
            </Button>
          </DialogTrigger>
          <Button
            onClick={handleSendInvoice}
            disabled={isLoading}
            className="btn-add"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                جارٍ الإرسال...
              </>
            ) : (
              <>
                <Icon name="Send" className="h-4 w-4" />
                تأكيد وإرسال
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SendOrderViaEmail;
