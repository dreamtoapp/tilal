import { Badge } from '@/components/ui/badge';

interface ProductPriceSectionProps {
  formattedPrice: string;
  formattedSalePrice: string | null;
  discountPercentage: number;
}

export default function ProductPriceSection({ formattedPrice, formattedSalePrice, discountPercentage }: ProductPriceSectionProps) {
  return (
    <div className='flex items-baseline gap-2'>
      {formattedSalePrice ? (
        <>
          <span className='text-2xl font-bold text-primary'>{formattedSalePrice}</span>
          <span className='text-lg text-muted-foreground line-through'>{formattedPrice}</span>
          <Badge className='bg-red-500'>{discountPercentage}% خصم</Badge>
        </>
      ) : (
        <span className='text-2xl font-bold'>{formattedPrice}</span>
      )}
    </div>
  );
} 