import { Icon } from '@/components/icons/Icon';
import { iconVariants } from '@/lib/utils';

export default function ShippingInfo() {
  return (
    <div className='flex items-center gap-2 pt-2 text-sm text-muted-foreground'>
      <Icon name="Info" size="sm" className={iconVariants({ size: 'sm' })} />
      <span>الشحن خلال 3-5 أيام عمل</span>
    </div>
  );
} 