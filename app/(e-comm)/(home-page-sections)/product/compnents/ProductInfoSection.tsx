import ProductHeader from './ProductHeader';

interface ProductInfoSectionProps {
  product: any;
}

export default function ProductInfoSection({ product }: ProductInfoSectionProps) {
  return (
    <div className='space-y-6'>
      <ProductHeader product={product} />
    </div>
  );
} 