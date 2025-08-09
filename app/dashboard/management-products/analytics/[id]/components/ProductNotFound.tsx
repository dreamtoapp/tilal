import Link from '@/components/link';

export default function ProductNotFound() {
    return (
        <div className='flex min-h-[60vh] flex-col items-center justify-center p-8 text-center'>
            <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                className='mx-auto mb-6 h-20 w-20 text-primary'
            >
                <circle cx='12' cy='12' r='10' />
                <path d='M9 10h6M9 14h.01M15 14h.01' />
            </svg>
            <h2 className='mb-4 text-3xl font-bold text-gray-800'>المنتج غير موجود</h2>
            <p className='mx-auto mb-6 max-w-md text-lg leading-relaxed text-gray-600'>
                عذرًا، لم نعثر على المنتج المطلوب أو ربما تم حذفه.
                <br />
                يمكنك العودة لقائمة المنتجات والمحاولة مرة أخرى.
            </p>
            <Link
                href='/dashboard/products-control'
                className='inline-flex items-center rounded-full bg-primary px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-xl'
            >
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                    className='mr-2'
                >
                    <path d='M3 12l9-9 9 9' />
                    <path d='M9 21V9h6v12' />
                </svg>
                عودة للمنتجات
            </Link>
        </div>
    );
} 