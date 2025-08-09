import ProductQuantity from './ProductQuantity';

interface ProductActionsProps {
  product: any;
}

export default function ProductActions({ product }: ProductActionsProps) {
  return (
    <div className='pt-4'>
      <ProductQuantity product={product} />
    </div>
  );
} 