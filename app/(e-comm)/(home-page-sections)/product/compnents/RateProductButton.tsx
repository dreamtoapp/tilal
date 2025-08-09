'use client';

import { useState } from 'react'; // Keep one useState
import dynamic from 'next/dynamic'; // Keep one dynamic
import { toast } from 'sonner';
import { Icon } from '@/components/icons/Icon';
import { submitProductRating, verifyUserPurchase } from '@/app/(e-comm)/(home-page-sections)/product/actions/rating';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type RatingModalType from '../../../(adminPage)/user/ratings/components/RatingModal';

// Dynamically import the RatingModal for better performance
const RatingModal = dynamic(
  () => import('../../../(adminPage)/user/ratings/components/RatingModal'),
  { loading: () => <p>جاري التحميل...</p>, ssr: false }
) as typeof RatingModalType;

interface RateProductButtonProps {
  productId: string;
  productName: string;
  productImage: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  buttonText?: string;
}

export function RateProductButton({
  productId,
  productName,
  productImage,
  className,
  variant = 'outline',
  size = 'default',
  showIcon = true,
  buttonText = 'قيّم المنتج',
}: RateProductButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPurchaseVerified, setIsPurchaseVerified] = useState<boolean | null>(null);

  const handleOpenModal = async () => {
    // Check if user has purchased the product using server action
    const hasPurchased = await verifyUserPurchase(productId);
    setIsPurchaseVerified(hasPurchased);

    // Open modal regardless, but we'll show a message if not purchased
    setIsModalOpen(true);

    if (!hasPurchased) {
      toast.info('التقييمات من المشترين المؤكدين تظهر بشكل مميز');
    }
  };

  const handleSubmitRating = async (values: { rating: number; comment: string }) => {
    setIsSubmitting(true);

    try {
      // Submit rating using server action
      const result = await submitProductRating({
        productId,
        rating: values.rating,
        comment: values.comment,
      });

      if (result.success) {
        toast.success(result.message || 'تم إضافة التقييم بنجاح');
        setIsModalOpen(false);

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

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleOpenModal}
        className={cn(
          'transition-all duration-200',
          isPurchaseVerified === false && 'opacity-90',
          className,
        )}
      >
        {showIcon && <Icon name="Star" size="xs" className="mr-2" />}
        {buttonText}
        {isPurchaseVerified === false && (
          <span className='mr-1 text-xs text-muted-foreground'>(غير مؤكد)</span>
        )}
      </Button>

      {isModalOpen && (
        <RatingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitRating}
          productName={productName}
          productImage={productImage}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}

export default RateProductButton;
