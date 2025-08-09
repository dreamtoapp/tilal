interface ProductDescriptionProps {
  product: any;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  return (
    <div className='space-y-4'>
      <p className='text-muted-foreground'>{product.details === null ? product.name : product.details}</p>
    </div>
  );
} 