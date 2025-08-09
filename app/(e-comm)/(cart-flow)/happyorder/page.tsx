'use client';
import { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import Confetti from 'react-confetti'; // Import Confetti
import useWindowSize from 'react-use/lib/useWindowSize'; // For responsive confetti
import { CheckCircle, Star } from 'lucide-react'; // Import directly
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RatingType } from '@/constant/enums';
import { useCartStore } from '../cart/cart-controller/cartStore';

export default function OrderConfirmation() {
  const router = useRouter();
  const { clearCart } = useCartStore();
  const [showClearCartDialog, setShowClearCartDialog] = useState(true);
  const [isClient, setIsClient] = useState(false); // State to track client-side rendering
  const { width, height } = useWindowSize(); // Get window size for responsive confetti

  // Use useSearchParams to get query parameters
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderid');

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
    }
    setIsClient(true); // Mark as client-side after component mounts
  }, [orderId, router]);

  const handleClearCart = () => {
    clearCart();
    setShowClearCartDialog(false);
    router.push('/');
  };

  const handleKeepCart = () => {
    setShowClearCartDialog(false);
    router.push('/');
  };

  const handleSubmitRating = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/order-rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          rating,
          comment,
          type: RatingType.APP,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'حدث خطأ أثناء إرسال التقييم.');
        setLoading(false);
        return;
      }
      setRatingSubmitted(true);
    } catch (e) {
      setError('حدث خطأ أثناء إرسال التقييم.');
    } finally {
      setLoading(false);
    }
  };

  if (!orderId) return null;

  return (
    <div
      className='relative flex min-h-screen items-center justify-center p-4'
      dir='rtl' // Add RTL support
    >
      {/* Add Confetti */}
      {isClient && (
        <Confetti
          width={width}
          height={height}
          recycle={false} // Stop confetti after one cycle
        />
      )}

      <Card className='w-full max-w-md border-feature-commerce bg-feature-commerce-soft'>
        <CardHeader className='text-center'>
          <CheckCircle className='mx-auto text-feature-commerce h-12 w-12 icon-enhanced' />
          <CardTitle className='text-2xl text-feature-commerce'>تم تأكيد الطلب!</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Alert className='border-feature-commerce bg-feature-commerce-soft'>
            <AlertTitle className='text-lg font-semibold text-feature-commerce'>رقم الطلب: #{orderId}</AlertTitle>
            <AlertDescription className='text-feature-commerce'>لقد تلقينا طلبك بنجاح.</AlertDescription>
          </Alert>
          {/* Tracking Info Message */}
          <div className='mt-4 p-3 rounded bg-feature-commerce-soft border border-feature-commerce text-feature-commerce text-center'>
            <div className='font-bold mb-1'>تتبع حالة الطلب</div>
            <div className='text-sm'>يمكنك تتبع حالة طلبك من صفحة <span className='font-semibold'>تقارير التتبع</span>.</div>
          </div>
          {showClearCartDialog && (
            <div className='mt-6 rounded-lg p-4 border-feature-commerce bg-feature-commerce-soft'>
              <h3 className='mb-2 text-lg font-medium text-feature-commerce'>إفراغ سلة التسوق؟</h3>
              <p className='mb-4 text-sm text-muted-foreground'>هل ترغب في إفراغ السلة لشراء منتجات جديدة؟</p>
              <div className='flex gap-2'>
                <Button onClick={handleClearCart} className='flex-1 btn-delete'>نعم، إفراغ السلة</Button>
                <Button onClick={handleKeepCart} variant='outline' className='flex-1 btn-cancel-outline'>الاحتفاظ بالعناصر</Button>
              </div>
            </div>
          )}

          {/* Google-style Trip/Journey Rating */}
          <div className='mt-6 p-4 rounded-lg bg-feature-commerce-soft border border-feature-commerce'>
            <h3 className='text-lg font-bold mb-2 text-feature-commerce'>ما رأيك في تجربة الشراء؟</h3>
            {!ratingSubmitted ? (
              <>
                <div className='flex items-center gap-1 justify-center mb-2'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-7 w-7 cursor-pointer icon-enhanced transition-colors ${rating >= star ? 'text-feature-commerce' : 'text-muted-foreground'}`}
                      onClick={() => setRating(star)}
                      fill={rating >= star ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <textarea
                  className='w-full mt-2 rounded border border-feature-commerce p-2 text-sm focus:ring-2 focus:ring-feature-commerce'
                  placeholder='أضف ملاحظاتك (اختياري)'
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  dir='rtl'
                  rows={3}
                />
                <Button className='btn-save mt-3 w-full' onClick={handleSubmitRating} disabled={rating === 0 || loading}>
                  {loading ? 'جاري الإرسال...' : 'إرسال التقييم'}
                </Button>
                {error && <div className='mt-2 text-red-600 text-sm text-center'>{error}</div>}
              </>
            ) : (
              <div className='text-center text-feature-commerce font-bold py-4'>
                شكرًا لتقييمك! نسعد بخدمتك دائمًا.
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className='mt-4 flex justify-center'>
          <Button variant='link' onClick={() => router.push('/')} className='text-feature-commerce'>
            متابعة التسوق →
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
