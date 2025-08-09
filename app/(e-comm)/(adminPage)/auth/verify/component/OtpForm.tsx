'use client';
import {
  useEffect,
  useState,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Loader2, AlertTriangle, CheckCircle, Phone, MessageCircle } from 'lucide-react';

import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Alert } from '@/components/ui/alert';

import { otpViaWhatsApp, verifyTheUser, resendOTP } from '../action/otp-via-whatsapp';

export default function OtpForm({ phone }: { phone: string }) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode>('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(60);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [otpFromBackEnd, setOtpFromBackEnd] = useState('');
  const [whatsappGuidanceURL, setWhatsappGuidanceURL] = useState<string>('');
  const [showWhatsappGuidance, setShowWhatsappGuidance] = useState(false);

  const userPhone = phone || '';

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  // Check if user has a phone number for display
  const hasPhoneNumber = userPhone && userPhone.trim() !== '';

  useEffect(() => {
    if (!hasPhoneNumber) {
      setError(
        <div className='mb-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700'>
          <p className='flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5' />
            <span>
              رقم الهاتف غير متوفر في الحساب.
              <Link href='/profile' className='ml-2 text-primary underline'>
                تحديث البيانات الشخصية
              </Link>
            </span>
          </p>
        </div>,
      );
    }
  }, [hasPhoneNumber]);

  const handleSendOTP = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await otpViaWhatsApp();

      if (result.success) {
        if ('token' in result && result.token) {
          setOtpFromBackEnd(result.token);
        } else {
          setOtpFromBackEnd('');
        }
        setIsOTPSent(true);

        // Check if it's a fake OTP (WhatsApp failed)
        if ('isFake' in result && result.isFake) {
          setSuccess('تم إرسال رمز التحقق (وهمي) - خطأ في WhatsApp');
          if ('whatsappGuidanceURL' in result && result.whatsappGuidanceURL) {
            result.whatsappGuidanceURL.then(url => {
              setWhatsappGuidanceURL(url);
              setShowWhatsappGuidance(true);
            });
          }
        } else {
          setSuccess('تم إرسال رمز التحقق عبر WhatsApp بنجاح');
          setShowWhatsappGuidance(false);
        }

        setTimer(60);
        // Show OTP in dev mode
        if (
          process.env.NODE_ENV === 'development' &&
          'token' in result && result.token
        ) {
          const Swal = (await import('sweetalert2')).default;
          await Swal.fire({
            icon: 'info',
            title: 'رمز التحقق (وضع التطوير)',
            text: `OTP: ${result.token}`,
            confirmButtonText: 'نسخ',
            didOpen: () => {
              navigator.clipboard.writeText(result.token);
            }
          });
        }
      } else {
        setError(result.message || 'حدث خطأ أثناء الإرسال');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('حدث خطأ أثناء الإرسال. حاول مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await resendOTP();

      if (result.success) {
        if ('token' in result && result.token) {
          setOtpFromBackEnd(result.token);
        } else {
          setOtpFromBackEnd('');
        }

        // Check if it's a fake OTP (WhatsApp failed)
        if ('isFake' in result && result.isFake) {
          setSuccess('تم إعادة إرسال رمز التحقق (وهمي) - خطأ في WhatsApp');
          if ('whatsappGuidanceURL' in result && result.whatsappGuidanceURL) {
            result.whatsappGuidanceURL.then(url => {
              setWhatsappGuidanceURL(url);
              setShowWhatsappGuidance(true);
            });
          }
        } else {
          setSuccess('تم إعادة إرسال رمز التحقق عبر WhatsApp');
          setShowWhatsappGuidance(false);
        }

        setTimer(60);
      } else {
        setError(result.message || 'حدث خطأ أثناء إعادة الإرسال');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setError('حدث خطأ أثناء إعادة الإرسال');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (otp.length !== 4) {
      return setError('الرجاء إدخال رمز التحقق المكون من 4 أرقام');
    }

    setIsLoading(true);

    try {
      const result = await verifyTheUser(otp);

      if (result.success) {
        const Swal = (await import('sweetalert2')).default;
        await Swal.fire({
          icon: 'success',
          title: 'تم التحقق بنجاح!',
          text: 'جاري تحويلك...',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        setError('');
        setSuccess('');
        setOtp('');
        setIsOTPSent(false);
        setTimer(0);
        setOtpFromBackEnd('');
        setIsLoading(false);

        router.push(redirectTo);
      } else {
        setError(result.message || 'رمز التحقق غير صحيح');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('حدث خطأ أثناء التحقق من الرمز');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (timer > 0 && isOTPSent) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isOTPSent]);

  return (
    <>
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-sm shadow-lg border-l-4 border-feature-users card-hover-effect card-border-glow p-6 space-y-4">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-5 w-5 text-feature-users icon-enhanced" />
              <span className="text-xl font-bold">تفعيل الحساب</span>
            </div>
            <CardDescription className="text-sm mb-2">
              لأمان حسابك، يرجى إدخال رمز التحقق المرسل إلى واتساب.
            </CardDescription>
            <div className="flex items-center gap-2 justify-center bg-muted/60 rounded-md px-4 py-2 mb-2">
              <Phone className="h-4 w-4 text-feature-users icon-enhanced" />
              <span className="font-bold text-feature-users text-lg">{phone}</span>
            </div>
            <div className="text-xs text-muted-foreground">الخطوة 2 من 3</div>
          </CardHeader>
          <CardContent className="space-y-6">
            {success && (
              <Alert variant="default" className="flex items-center gap-2 border-l-4 border-green-500 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{success}</span>
              </Alert>
            )}
            {showWhatsappGuidance && whatsappGuidanceURL && (
              <Alert variant="default" className="flex flex-col gap-3 border-l-4 border-blue-500 bg-blue-50 text-blue-800">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">للاستلام، يرجى إرسال رسالة إلى رقم WhatsApp أولاً</span>
                </div>
                <a
                  href={whatsappGuidanceURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  إرسال رسالة WhatsApp
                </a>
                <p className="text-xs text-blue-700">
                  انقر على الزر أعلاه لفتح WhatsApp مع رسالة جاهزة. أرسل الرسالة ثم حاول مرة أخرى.
                </p>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </Alert>
            )}
            {process.env.NODE_ENV === 'development' && isOTPSent && otpFromBackEnd && (
              <div className="mt-2 text-xs text-muted-foreground p-2 bg-yellow-50 border border-yellow-200 rounded">
                <span>رمز الاختبار (Dev): </span>
                <span className="font-mono font-bold text-yellow-700">{otpFromBackEnd}</span>
              </div>
            )}
            {!isOTPSent ? (
              <>
                <div className="text-xs text-muted-foreground mt-1 mb-1">سيتم إرسال رمز التحقق إلى رقم الهاتف المسجل في حسابك.</div>
                <Button
                  className="w-full btn-add bg-feature-users hover:bg-feature-users/90 text-white text-base py-1.5"
                  onClick={handleSendOTP}
                  disabled={isLoading || !hasPhoneNumber}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    'إرسال الرمز عبر واتساب'
                  )}
                </Button>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <label className="block text-sm font-medium mb-1">أدخل رمز التحقق</label>
                <div className="flex items-center justify-center gap-2" dir="ltr">
                  <InputOTP
                    maxLength={4}
                    value={otp}
                    onChange={setOtp}
                    disabled={isLoading}
                    autoFocus
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="h-12 w-12 text-xl border border-muted-foreground shadow-sm focus:ring-2 focus:ring-feature-users transition-all duration-200" />
                      <InputOTPSlot index={1} className="h-12 w-12 text-xl border border-muted-foreground shadow-sm focus:ring-2 focus:ring-feature-users transition-all duration-200" />
                      <InputOTPSeparator />
                      <InputOTPSlot index={2} className="h-12 w-12 text-xl border border-muted-foreground shadow-sm focus:ring-2 focus:ring-feature-users transition-all duration-200" />
                      <InputOTPSlot index={3} className="h-12 w-12 text-xl border border-muted-foreground shadow-sm focus:ring-2 focus:ring-feature-users transition-all duration-200" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-6 w-full">
                  <span className="text-sm text-muted-foreground">لم تستلم الرمز؟</span>
                  <Button
                    type="button"
                    className="btn-view-outline w-full sm:w-auto"
                    variant="outline"
                    onClick={handleResend}
                    disabled={timer > 0 || isLoading}
                    aria-label="إعادة إرسال الرمز"
                  >
                    {timer > 0 ? `إعادة إرسال الرمز (${timer})` : 'إعادة إرسال الرمز'}
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="w-full btn-professional shadow-lg hover:scale-105 transition"
                  disabled={isLoading || otp.length !== 4}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري التحقق...
                    </>
                  ) : (
                    'تأكيد الرمز'
                  )}
                </Button>
                <div className="flex justify-center mt-2">
                  <a href="/contact" className="text-xs text-feature-users underline">مساعدة؟</a>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
