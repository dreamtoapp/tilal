import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { iconVariants } from '@/lib/utils';
import RateProductButton from './RateProductButton';

interface EmptyReviewsProps {
  session: any;
  product: any;
  mainImage: string;
}

export default function EmptyReviews({ session, product, mainImage }: EmptyReviewsProps) {
  return (
    <div className='rounded-lg bg-muted/30 py-12 text-center'>
      <Icon name="Star" size="xl" className={iconVariants({ size: 'xl', className: 'mx-auto mb-4 text-amber-400' })} />
      <h3 className='mb-2 text-lg font-medium'>لا توجد تقييمات بعد</h3>
      <p className='mb-6 text-muted-foreground'>كن أول من يقيم هذا المنتج وشارك تجربتك مع الآخرين</p>
      {session?.user ? (
        <RateProductButton
          productId={product.id}
          productName={product.name}
          productImage={mainImage}
          variant='default'
          size='lg'
          showIcon
          buttonText='إضافة تقييم'
        />
      ) : (
        <Button asChild>
          <a href={`/auth/login?redirect=/product/${product.slug}`}>تسجيل الدخول لإضافة تقييم</a>
        </Button>
      )}
    </div>
  );
} 