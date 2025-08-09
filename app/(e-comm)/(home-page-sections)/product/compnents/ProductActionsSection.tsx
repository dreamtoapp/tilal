import ProductActions from './ProductActions';
import ShippingInfo from './ShippingInfo';

interface ProductActionsSectionProps {
  product: any;
}

export default function ProductActionsSection({ product }: ProductActionsSectionProps) {
  return (
    <div className='space-y-6'>
      <ProductActions product={product} />
      <ShippingInfo />
    </div>
  );
} 