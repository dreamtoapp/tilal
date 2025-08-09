import { iconVariants } from '@/lib/utils';
import { Icon } from '@/components/icons/Icon';

const EmptyState = ({ message }: { message: string }) => (
  <div className='flex h-screen items-center justify-center bg-gray-50 px-4'>
    <div className='text-center' dir='rtl'>
      <Icon name="AlertCircle" variant="destructive" size="xl" className={iconVariants({ variant: 'destructive', size: 'xl', className: 'mx-auto mb-3 md:mb-4' })} />
      <h1 className='mb-2 text-xl font-semibold text-gray-700 md:text-2xl'>{message}</h1>
      <p className='text-sm text-gray-600 md:text-base'>
        يرجى التأكد من المعرّف أو المحاولة لاحقاً
      </p>
    </div>
  </div>
);

export default EmptyState;
