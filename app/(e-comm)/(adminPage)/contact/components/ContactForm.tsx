'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { submitContactForm } from '../actions/contact';
import SuccessMessage from './SuccessMessage';

const schema = z.object({
    name: z.string().min(1, 'الاسم مطلوب'),
    email: z.string().email('البريد الإلكتروني غير صالح'),
    subject: z.string().min(1, 'الموضوع مطلوب'),
    message: z.string().min(1, 'الرسالة مطلوبة'),
});

type ContactFormValues = z.infer<typeof schema>;

const ContactForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ContactFormValues>({
        resolver: zodResolver(schema),
    });
    const [submitted, setSubmitted] = React.useState(false);
    const [serverMessage, setServerMessage] = React.useState('');

    const onSubmit = async (data: ContactFormValues) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('subject', data.subject);
            formData.append('message', data.message);
            const result = await submitContactForm({ success: false, message: '' }, formData);
            if (result.success) {
                setServerMessage(result.message || 'تم إرسال رسالتك بنجاح!');
                setSubmitted(true);
                reset();
                toast.success(result.message || 'تم إرسال رسالتك بنجاح!');
            } else {
                setServerMessage(result.message || 'حدث خطأ أثناء إرسال الرسالة.');
                toast.error(result.message || 'حدث خطأ أثناء إرسال الرسالة.');
            }
        } catch (error: any) {
            setServerMessage('حدث خطأ أثناء إرسال الرسالة.');
            toast.error('حدث خطأ أثناء إرسال الرسالة.');
        }
    };

    React.useEffect(() => {
        if (submitted) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [submitted]);

    return (
        <div className='mx-auto max-w-2xl rounded-lg border bg-background p-6 shadow-xl dark:border-gray-800'>
            <h1 className='mb-4 text-center text-3xl font-extrabold tracking-tight text-primary drop-shadow-sm'>تواصل معنا</h1>
            <p className='mb-8 text-center text-lg text-muted-foreground'>
                نحن هنا لمساعدتك. يرجى ملء النموذج أدناه للتواصل معنا، وسنرد عليك في أقرب وقت ممكن.
            </p>
            {submitted ? (
                <SuccessMessage message={serverMessage} />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 animate-fade-in' noValidate>
                    <div className='grid gap-4'>
                        <div className='relative'>
                            <label htmlFor='name' className='block text-sm font-medium text-foreground mb-1'>
                                الاسم <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='text'
                                id='name'
                                autoComplete='name'
                                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm transition-all duration-200 placeholder:text-muted-foreground focus:shadow-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-input'}`}
                                {...register('name')}
                                aria-invalid={!!errors.name}
                                required
                            />
                            {errors.name && (
                                <span className='absolute right-2 top-9 flex items-center text-red-600 text-xs animate-fade-in'>
                                    <AlertCircle className='h-4 w-4 mr-1' />{errors.name.message}
                                </span>
                            )}
                        </div>

                        <div className='relative'>
                            <label htmlFor='email' className='block text-sm font-medium text-foreground mb-1'>
                                البريد الإلكتروني <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='email'
                                id='email'
                                autoComplete='email'
                                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm transition-all duration-200 placeholder:text-muted-foreground focus:shadow-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-input'}`}
                                {...register('email')}
                                aria-invalid={!!errors.email}
                                required
                            />
                            {errors.email && (
                                <span className='absolute right-2 top-9 flex items-center text-red-600 text-xs animate-fade-in'>
                                    <AlertCircle className='h-4 w-4 mr-1' />{errors.email.message}
                                </span>
                            )}
                        </div>

                        <div className='relative'>
                            <label htmlFor='subject' className='block text-sm font-medium text-foreground mb-1'>
                                الموضوع <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='text'
                                id='subject'
                                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm transition-all duration-200 placeholder:text-muted-foreground focus:shadow-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-input'}`}
                                {...register('subject')}
                                aria-invalid={!!errors.subject}
                                required
                            />
                            {errors.subject && (
                                <span className='absolute right-2 top-9 flex items-center text-red-600 text-xs animate-fade-in'>
                                    <AlertCircle className='h-4 w-4 mr-1' />{errors.subject.message}
                                </span>
                            )}
                        </div>

                        <div className='relative'>
                            <label htmlFor='message' className='block text-sm font-medium text-foreground mb-1'>
                                الرسالة <span className='text-red-500'>*</span>
                            </label>
                            <textarea
                                id='message'
                                rows={5}
                                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm transition-all duration-200 placeholder:text-muted-foreground focus:shadow-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-input'}`}
                                {...register('message')}
                                aria-invalid={!!errors.message}
                                required
                            />
                            {errors.message && (
                                <span className='absolute right-2 top-2 flex items-center text-red-600 text-xs animate-fade-in'>
                                    <AlertCircle className='h-4 w-4 mr-1' />{errors.message.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type='submit'
                            className='flex w-full items-center justify-center rounded-md bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground shadow transition-transform duration-200 hover:scale-105 hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg
                                        className='mr-3 h-5 w-5 animate-spin text-primary-foreground'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                    >
                                        <circle
                                            className='opacity-25'
                                            cx='12'
                                            cy='12'
                                            r='10'
                                            stroke='currentColor'
                                            strokeWidth='4'
                                        ></circle>
                                        <path
                                            className='opacity-75'
                                            fill='currentColor'
                                            d='M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z'
                                        ></path>
                                    </svg>
                                    جاري الإرسال...
                                </>
                            ) : (
                                'إرسال الرسالة'
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default ContactForm; 