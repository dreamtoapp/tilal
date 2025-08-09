'use client';

import { useState } from 'react';

import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { toast } from 'sonner';
import { Star } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants

// Removed Icon import: import { Icon } from '@/components/icons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { PurchaseHistoryItem } from '../actions';

// Dynamically import the RatingModal
const RatingModal = dynamic(() => import('../../ratings/components/RatingModal'), {
  loading: () => <p>جاري التحميل...</p>,
  ssr: false,
});

interface PurchaseHistoryListProps {
  purchases: PurchaseHistoryItem[];
}

export default function PurchaseHistoryList({ purchases }: PurchaseHistoryListProps) {
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
    slug?: string;
    imageUrl: string;
  } | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRateProduct = (product: {
    id: string;
    name: string;
    slug?: string;
    imageUrl: string;
  }) => {
    setSelectedProduct(product);
    setIsRatingModalOpen(true);
  };

  const handleSubmitRating = async (values: { rating: number; comment: string }) => {
    if (!selectedProduct) return;

    setIsSubmitting(true);

    try {
      // Import the submitProductRating function dynamically to avoid "use server" errors
      const { submitProductRating } = await import('@/app/(e-comm)/(home-page-sections)/product/actions/rating');

      // Call the server action to submit the rating
      const result = await submitProductRating({
        productId: selectedProduct.id,
        rating: values.rating,
        comment: values.comment,
      });

      if (result.success) {
        toast.success(result.message || 'تم إضافة التقييم بنجاح');
        setIsRatingModalOpen(false);

        // Refresh the page to show updated ratings
        window.location.reload();
      } else {
        toast.error(result.message || 'حدث خطأ أثناء إرسال التقييم');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('حدث خطأ أثناء إرسال التقييم');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'InWay':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Helper function to format status text
  const formatStatus = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'تم التوصيل';
      case 'Pending':
        return 'قيد الانتظار';
      case 'InWay':
        return 'في الطريق';
      case 'canceled':
        return 'ملغي';
      default:
        return status;
    }
  };

  return (
    <div className='space-y-6'>
      <Accordion type='single' collapsible className='w-full'>
        {purchases.map((purchase) => (
          <AccordionItem key={purchase.orderId} value={purchase.orderId}>
            <AccordionTrigger className='rounded-lg bg-card px-4 py-3 hover:bg-card/80'>
              <div className='flex w-full flex-col justify-between gap-2 text-right sm:flex-row sm:items-center'>
                <div>
                  <span className='font-medium'>طلب #{purchase.orderNumber}</span>
                  <span className='block text-sm text-muted-foreground sm:mr-2 sm:inline'>
                    {format(new Date(purchase.orderDate), 'd MMMM yyyy', { locale: ar })}
                  </span>
                </div>
                <Badge variant='outline' className={cn('mr-auto', getStatusColor(purchase.status))}>
                  {formatStatus(purchase.status)}
                </Badge>
              </div>
            </AccordionTrigger>

            <AccordionContent className='px-4 pt-4'>
              <div className='space-y-4'>
                {purchase.products.map((product) => (
                  <div key={product.id} className='flex flex-col gap-4 pb-4 sm:flex-row'>
                    <div className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md'>
                      <Image
                        src={product.imageUrl || '/fallback/product-fallback.avif'}
                        alt={product.name}
                        fill
                        className='object-cover'
                      />
                    </div>

                    <div className='flex-1'>
                      <h3 className='font-medium'>{product.name}</h3>
                      <div className='mt-1 flex items-center gap-2 text-sm text-muted-foreground'>
                        <span>الكمية: {product.quantity}</span>
                        <span>•</span>
                        <span>السعر: ${product.price.toFixed(2)}</span>
                      </div>

                      <div className='mt-3'>
                        <Button
                          variant='outline'
                          size='sm'
                          className='border-amber-200 text-amber-600 hover:bg-amber-50 hover:text-amber-700'
                          onClick={() => handleRateProduct(product)}
                        >
                          <Star className={iconVariants({ size: 'xs', variant: 'warning', className: 'mr-1' })} /> {/* Use direct import + CVA */}
                          {product.hasRated ? 'تعديل التقييم' : 'قيّم المنتج'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {selectedProduct && (
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          onSubmit={handleSubmitRating}
          productName={selectedProduct.name}
          productImage={selectedProduct.imageUrl}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
