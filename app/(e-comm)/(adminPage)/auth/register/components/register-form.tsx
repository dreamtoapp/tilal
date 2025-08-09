// app/(auth)/register/component/register-form.tsx
'use client';
import { useState } from 'react';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserPlus, AlertCircle, Phone, User, Lock, ShieldCheck } from 'lucide-react';
import { registerUser } from '../actions/actions';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterSchemaType } from '../helpers/registerSchema';
import 'sweetalert2/dist/sweetalert2.min.css';
import { signIn } from 'next-auth/react';

interface RegisterFormProps {
  redirect?: string;
}

// Reusable Loading Spinner Component
const LoadingSpinner = () => (
  <div className='flex items-center justify-center'>
    <svg
      className='mr-2 h-5 w-5 animate-spin text-white'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      role='status'
    >
      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z' />
    </svg>
    جاري التسجيل...
  </div>
);

// Status Message Component
const StatusMessage = ({ success, message }: { success: boolean; message: string }) => (
  <div
    className={`mt-4 rounded-lg p-3 text-center ${success ? 'bg-feature-users-soft text-feature-users' : 'bg-red-50 text-red-700'}`}
    role='alert'
  >
    {message}
  </div>
);

// Form Divider Component
const FormDivider = () => (
  <div className='relative my-4'>
    <div className='absolute inset-0 flex items-center'>
      <span className='w-full border-t border-gray-300' />
    </div>
    <div className='relative flex justify-center text-sm'>
      <span className='bg-background px-2 text-gray-500'>أو</span>
    </div>
  </div>
);

// Auth Link Component
const AuthLink = ({ href, text }: { href: string; text: string }) => (
  <p className='mt-4 text-center text-sm text-gray-600'>
    {text}{' '}
    <Link href={href} className='font-medium text-feature-users transition-colors hover:underline'>
      تسجيل الدخول
    </Link>
  </p>
);

export default function RegisterForm({ redirect = '/' }: RegisterFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    setIsPending(true);
    setServerError(null);
    // Prepare FormData for server action
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('phone', data.phone);
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);
    formData.append('redirect', redirect);
    // Call server action
    const result = await registerUser({}, formData);
    setIsPending(false);
    if (result?.success && result.redirectTo && result.phone && result.password) {
      const Swal = (await import('sweetalert2')).default;
      await Swal.fire({
        title: '🎉 تم إنشاء حسابك بنجاح!',
        html: `
          <div style="font-size:1.1rem;line-height:2">
            <div>لإكمال تفعيل حسابك، يرجى:</div>
            <ol style="text-align:right;direction:rtl;margin:1rem 0 0 0;padding-right:1.5rem">
              <li>إضافة عنوان التوصيل الخاص بك</li>
              <li>تفعيل الحساب عبر واتساب من صفحة حسابك الشخصي</li>
            </ol>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'إضافة عنوان التوصيل الآن',
        customClass: {
          popup: 'swal2-rtl',
          confirmButton: 'btn-add btn-professional',
          title: 'text-2xl font-bold',
          htmlContainer: 'text-lg',
        },
        showCloseButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          const popup = Swal.getPopup();
          if (popup) popup.setAttribute('dir', 'rtl');
        },
      });
      // Client-side signIn
      const signInResult = await signIn('credentials', {
        phone: result.phone,
        password: result.password,
        redirect: false,
      });
      if (signInResult && signInResult.ok) {
        // Optional: small delay to allow session propagation
        await new Promise(res => setTimeout(res, 400));
        router.push(result.redirectTo);
        // Force session refresh after redirect
        setTimeout(() => { router.refresh(); }, 800);
      } else {
        setServerError('تم إنشاء الحساب ولكن حدث خطأ أثناء تسجيل الدخول التلقائي. يرجى تسجيل الدخول يدويًا.');
      }
    } else if (result?.message) {
      setServerError(result.message);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-background px-4'>
      <Card className="w-full max-w-sm shadow-lg border-l-4 border-feature-users card-hover-effect card-border-glow">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="h-5 w-5 text-feature-users icon-enhanced" />
            {/* i18n: Create New Account */}
            إنشاء حساب جديد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            {/* Server error */}
            {serverError && (
              <StatusMessage success={false} message={serverError} />
            )}
            {/* Phone */}
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-medium text-gray-700' htmlFor='phone'>رقم الجوال</label>
              <div className='relative'>
                <Input
                  id='phone'
                  type='tel'
                  placeholder='أدخل رقم الجوال'
                  maxLength={10}
                  {...register('phone')}
                  className='w-full pr-10'
                  autoComplete='off'
                />
                <Phone className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-feature-users icon-enhanced pointer-events-none' />
              </div>
              {errors.phone && (
                <span className='flex items-center gap-1 text-xs text-feature-users'>
                  <AlertCircle className='h-4 w-4 icon-enhanced text-feature-users' />
                  {errors.phone.message}
                </span>
              )}
            </div>
            {/* Name */}
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-medium text-gray-700' htmlFor='name'>الاسم الكامل</label>
              <div className='relative'>
                <Input
                  id='name'
                  type='text'
                  placeholder='أدخل اسمك الكامل'
                  {...register('name')}
                  className='w-full pr-10'
                  autoComplete='off'
                />
                <User className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-feature-users icon-enhanced pointer-events-none' />
              </div>
              {errors.name && (
                <span className='flex items-center gap-1 text-xs text-feature-users'>
                  <AlertCircle className='h-4 w-4 icon-enhanced text-feature-users' />
                  {errors.name.message}
                </span>
              )}
            </div>
            {/* Password */}
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-medium text-gray-700' htmlFor='password'>كلمة المرور</label>
              <div className='relative'>
                <Input
                  id='password'
                  type='password'
                  placeholder='أدخل كلمة المرور'
                  {...register('password')}
                  className='w-full pr-10'
                  autoComplete='new-password'
                />
                <Lock className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-feature-users icon-enhanced pointer-events-none' />
              </div>
              {errors.password && (
                <span className='flex items-center gap-1 text-xs text-feature-users'>
                  <AlertCircle className='h-4 w-4 icon-enhanced text-feature-users' />
                  {errors.password.message}
                </span>
              )}
            </div>
            {/* Confirm Password */}
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-medium text-gray-700' htmlFor='confirmPassword'>تأكيد كلمة المرور</label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  type='password'
                  placeholder='أعد إدخال كلمة المرور'
                  {...register('confirmPassword')}
                  className='w-full pr-10'
                  autoComplete='new-password'
                />
                <ShieldCheck className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-feature-users icon-enhanced pointer-events-none' />
              </div>
              {errors.confirmPassword && (
                <span className='flex items-center gap-1 text-xs text-feature-users'>
                  <AlertCircle className='h-4 w-4 icon-enhanced text-feature-users' />
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
            <Button
              type='submit'
              disabled={isPending}
              className='btn-add w-full mt-2 btn-professional'
            >
              {isPending ? <LoadingSpinner /> : 'تسجيل الحساب' /* i18n */}
            </Button>
            <FormDivider />
            <AuthLink href='/auth/login' text='هل لديك حساب بالفعل؟' /* i18n */ />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
