'use client';

import {
  useId,
  useState,
  useTransition,
} from 'react';

import { toast } from 'sonner';

import { Icon } from '@/components/icons/Icon';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { subscribeToNewsletter } from '../../actions/newsletter';

const Newsletter = () => {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const formId = useId();
  const emailId = useId();

  // Enhanced form submission with better UX
  const handleSubmit = async (formData: FormData) => {
    const emailValue = formData.get('email') as string;

    // Client-side validation
    if (!emailValue || !emailValue.includes('@')) {
      toast.error('خطأ في التحقق', {
        description: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await subscribeToNewsletter(formData);

        if (result.error) {
          throw new Error(result.error);
        }

        // Success state
        setIsSuccess(true);
        setEmail('');

        toast.success('تم التسجيل بنجاح! 🎉', {
          description: 'شكرًا لتسجيلك في النشرة الإخبارية. ستصلك أحدث العروض والمنتجات.',
          duration: 5000,
        });

        // Reset success state after 3 seconds
        setTimeout(() => setIsSuccess(false), 3000);

      } catch (error) {
        toast.error('فشل في التسجيل', {
          description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
        });
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4" role="status" aria-live="polite">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-full">
          <Icon name="CheckCircle2" className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">تم التسجيل بنجاح!</h3>
          <p className="text-sm text-muted-foreground">
            شكرًا لانضمامك إلى النشرة الإخبارية. ستصلك أحدث العروض قريباً.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center md:text-right">
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 flex items-center justify-center md:justify-start gap-2">
          <Icon name="Mail" className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
          <span>اشترك في النشرة الإخبارية</span>
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          احصل على أحدث العروض والمنتجات الجديدة مباشرة في بريدك الإلكتروني
        </p>
      </div>

      <form
        id={formId}
        action={handleSubmit}
        className="space-y-4"
        noValidate
      >
        <div className="relative">
          <Input
            id={emailId}
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="أدخل بريدك الإلكتروني"
            className="pr-12 focus:ring-2 focus:ring-primary transition-all duration-200"
            aria-label="عنوان البريد الإلكتروني للاشتراك في النشرة الإخبارية"
            aria-describedby={`${emailId}-description`}
            disabled={isPending}
            required
            autoComplete="email"
          />
          <Icon
            name="Mail"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none"
          />
          <div id={`${emailId}-description`} className="sr-only">
            أدخل عنوان بريدك الإلكتروني لتلقي أحدث العروض والمنتجات
          </div>
        </div>

        <Button
          type="submit"
          className="w-full relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          disabled={isPending || !email.trim()}
          aria-describedby={`${formId}-submit-description`}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isPending ? (
              <>
                <Icon name="Loader2" className="animate-spin h-4 w-4" />
                <span>جاري التسجيل...</span>
              </>
            ) : (
              <>
                <Icon name="Send" className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                <span>اشترك الآن</span>
              </>
            )}
          </span>

          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </Button>

        <div id={`${formId}-submit-description`} className="sr-only">
          اضغط للاشتراك في النشرة الإخبارية وتلقي أحدث العروض
        </div>

        {/* Privacy notice */}
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          بالاشتراك، أنت توافق على{' '}
          <Link
            href="/policies/privacy"
            className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-sm"
          >
            سياسة الخصوصية
          </Link>
          {' '}ويمكنك إلغاء الاشتراك في أي وقت.
        </p>
      </form>
    </div>
  );
};

export default Newsletter;
