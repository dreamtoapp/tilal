import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Link from '@/components/link';

const SuccessMessage: React.FC<{ message: string; onContinue?: () => void }> = ({ message }) => (
    <div className='flex flex-col items-center justify-center gap-2 py-8' role='alert'>
        <CheckCircle2 className='h-12 w-12 text-green-500 mb-2 animate-bounce' />
        <h2 className='text-2xl font-bold text-green-600'>شكراً لتواصلك معنا!</h2>
        <p className='mt-2 text-foreground'>{message}</p>
        <Link
            href='/'
            className='mt-6 rounded-md border border-primary bg-background px-6 py-2 text-primary font-semibold shadow-sm transition hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-center'
        >
            استمتع برحلة التسوق
        </Link>
    </div>
);

export default SuccessMessage; 