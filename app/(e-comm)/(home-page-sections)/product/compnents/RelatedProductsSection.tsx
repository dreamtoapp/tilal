import RelatedProducts from './RelatedProducts';

interface RelatedProductsSectionProps {
  product: any;
}

export default function RelatedProductsSection({ product }: RelatedProductsSectionProps) {
  return (
    <div className='mt-16'>
      <h2 className='mb-6 text-xl font-bold'>منتجات مشابهة</h2>
      <RelatedProducts currentProductId={product.id} supplierId={product.supplierId} />
    </div>
  );
} 