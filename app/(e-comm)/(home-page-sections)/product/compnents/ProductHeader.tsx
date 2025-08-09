import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';
import { iconVariants } from '@/lib/utils';
import RatingDisplay from '../../../(adminPage)/user/ratings/components/RatingDisplay';

interface ProductHeaderProps {
  product: any;
}

export default function ProductHeader({ product }: ProductHeaderProps) {
  return (
    <div>
      <h1 className='text-2xl font-bold'>{product.name}</h1>
      <div className='mt-2 flex items-center gap-2'>
        <RatingDisplay
          rating={product.rating || 0}
          reviewCount={product.reviewCount || 0}
          productId={product.id}
          productSlug={product.slug}
        />
        {!product.outOfStock ? (
          <Badge variant='outline' className='border-green-200 bg-green-50 text-green-700'>
            <Icon name="Check" size="xs" className={iconVariants({ size: 'xs', className: 'mr-1' })} />
            متوفر
          </Badge>
        ) : (
          <Badge variant='outline' className='border-red-200 bg-red-50 text-red-700'>
            غير متوفر
          </Badge>
        )}
      </div>
    </div>
  );
} 