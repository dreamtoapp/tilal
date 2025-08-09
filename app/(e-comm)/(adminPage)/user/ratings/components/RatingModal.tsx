'use client';

import { useState } from 'react'; // Keep only one import

import Image from 'next/image';
import { toast } from 'sonner';
import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: { rating: number; comment: string }) => Promise<void>;
  productName: string;
  productImage: string;
  initialRating?: number;
  initialComment?: string;
  isSubmitting?: boolean;
}

export function RatingModal({
  isOpen,
  onClose,
  onSubmit,
  productName,
  productImage,
  initialRating = 0,
  initialComment = '',
  isSubmitting = false,
}: RatingModalProps) {
  const [rating, setRating] = useState<number>(initialRating);
  const [comment, setComment] = useState<string>(initialComment);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('يرجى اختيار تقييم');
      return;
    }

    if (comment.length < 3) {
      toast.error('يرجى كتابة تعليق لا يقل عن 3 أحرف');
      return;
    }

    if (comment.length > 500) {
      toast.error('التعليق طويل جدًا');
      return;
    }

    setError(null);

    await onSubmit({ rating, comment });

    // Reset form
    setRating(0);
    setComment('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-center text-xl'>أضف تقييمك</DialogTitle>
          <DialogDescription className='text-center'>شاركنا رأيك في هذا المنتج</DialogDescription>
        </DialogHeader>

        <div className='mb-4 flex items-center gap-4'>
          <div className='relative h-16 w-16 overflow-hidden rounded-md border'>
            <Image
              src={productImage || '/fallback/product-fallback.avif'}
              alt={productName}
              fill
              className='object-cover'
              priority
            />
          </div>
          <div className='flex-1'>
            <h3 className='font-medium text-foreground'>{productName}</h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-1'>
            <label className='block text-center text-sm font-medium'>قم بتقييم المنتج:</label>
            <div className='my-2 flex justify-center gap-1'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type='button'
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className='focus:outline-none'
                >
                  <Icon
                    name="Star"
                    size="md"
                    className={cn(
                      'transition-all duration-150',
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300',
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className='text-sm font-medium'>اكتب مراجعتك:</label>
            <Textarea
              placeholder='شاركنا تجربتك مع هذا المنتج...'
              className='mt-1 h-24 resize-none'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {error && <div className='text-sm text-red-500'>{error}</div>}

          <DialogFooter className='gap-2 sm:gap-0'>
            <Button type='button' variant='outline' onClick={onClose} disabled={isSubmitting}>
              إلغاء
            </Button>
            <Button type='submit' disabled={isSubmitting || rating === 0}>
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RatingModal;
