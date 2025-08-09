'use client';

import { iconVariants } from '@/lib/utils';
import { Icon } from '@/components/icons/Icon';
import Link from '@/components/link';
import PurchaseHistoryListDynamic from './PurchaseHistoryListDynamic';

export default function PurchaseHistoryPageClient({ purchaseHistory }: { purchaseHistory: any[] }) {
    return (
        <div className='container mx-auto max-w-4xl py-8'>
            <div className='mb-8 flex items-center gap-3'>
                <div className='rounded-full bg-primary/10 p-2'>
                    <Icon name="ShoppingBag" size="md" variant="primary" className={iconVariants({ size: 'md', variant: 'primary' })} />
                </div>
                <h1 className='text-2xl font-bold'>سجل المشتريات</h1>
            </div>

            {purchaseHistory.length === 0 ? (
                <div className='rounded-lg bg-muted/30 py-12 text-center'>
                    <Icon name="ShoppingBag" size="xl" variant="muted" className={iconVariants({ size: 'xl', variant: 'muted', className: 'mx-auto mb-4' })} />
                    <h2 className='mb-2 text-xl font-medium'>لا توجد مشتريات سابقة</h2>
                    <p className='mb-6 text-muted-foreground'>
                        لم تقم بشراء أي منتجات بعد. تصفح المتجر واستمتع بالتسوق!
                    </p>
                    <Link
                        href='/'
                        className='inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90'
                    >
                        تصفح المنتجات
                    </Link>
                </div>
            ) : (
                <>
                    <div className='mb-6 flex items-center gap-3 rounded-lg bg-muted/20 p-4'>
                        <Icon name="Star" size="sm" variant="warning" className={iconVariants({ size: 'sm', variant: 'warning' })} />
                        <p className='text-sm'>يمكنك تقييم المنتجات التي اشتريتها لمساعدة المتسوقين الآخرين</p>
                    </div>

                    <PurchaseHistoryListDynamic purchases={purchaseHistory} />
                </>
            )}
        </div>
    );
} 