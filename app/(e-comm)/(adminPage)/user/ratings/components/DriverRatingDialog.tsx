'use client';

import { useState, useEffect } from 'react';
import { Star, Truck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { getUserDeliveredOrders, submitDriverRating, type DeliveredOrder } from '../actions/ratingActions';

interface DriverRatingDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DriverRatingDialog({ isOpen, onClose }: DriverRatingDialogProps) {
    const [selectedOrder, setSelectedOrder] = useState<string>('');
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orders, setOrders] = useState<DeliveredOrder[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load orders when dialog opens
    useEffect(() => {
        if (isOpen) {
            loadOrders();
        }
    }, [isOpen]);

    const loadOrders = async () => {
        setIsLoading(true);
        try {
            const deliveredOrders = await getUserDeliveredOrders();
            setOrders(deliveredOrders);
        } catch (error) {
            console.error('Error loading orders:', error);
            toast.error('حدث خطأ في تحميل الطلبات');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedOrder) {
            toast.error('يرجى اختيار طلب');
            return;
        }

        if (rating === 0) {
            toast.error('يرجى اختيار تقييم');
            return;
        }

        if (comment.length < 3) {
            toast.error('يرجى كتابة تعليق');
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await submitDriverRating({
                orderId: selectedOrder,
                rating,
                comment,
            });

            if (result.success) {
                toast.success(result.message);
                setSelectedOrder('');
                setRating(0);
                setComment('');
                onClose();
                // Refresh the page to show new rating
                window.location.reload();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast.error('حدث خطأ أثناء الإرسال');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setSelectedOrder('');
            setRating(0);
            setComment('');
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className='sm:max-w-[400px]'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <Truck className="w-5 h-5 text-feature-suppliers" />
                        تقييم السائق
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    {/* Order Selection */}
                    <div className='space-y-2'>
                        <Select value={selectedOrder} onValueChange={setSelectedOrder} disabled={isLoading}>
                            <SelectTrigger>
                                <SelectValue placeholder={isLoading ? "جاري التحميل..." : "اختر طلباً تم توصيله"} />
                            </SelectTrigger>
                            <SelectContent>
                                {orders.length === 0 && !isLoading ? (
                                    <SelectItem value="no-orders" disabled>
                                        لا توجد طلبات متاحة للتقييم
                                    </SelectItem>
                                ) : (
                                    orders.map((order) => (
                                        <SelectItem key={order.id} value={order.id}>
                                            {order.id} - {order.driverName}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Rating */}
                    <div className='space-y-2'>
                        <div className='flex justify-center gap-1'>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type='button'
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className='focus:outline-none p-1'
                                    disabled={isSubmitting}
                                >
                                    <Star
                                        className={cn(
                                            'w-7 h-7 transition-all duration-150',
                                            (hoverRating || rating) >= star
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-gray-300',
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className='text-center text-sm text-muted-foreground'>
                                {rating === 1 && 'سيء جداً'}
                                {rating === 2 && 'سيء'}
                                {rating === 3 && 'متوسط'}
                                {rating === 4 && 'جيد'}
                                {rating === 5 && 'ممتاز'}
                            </p>
                        )}
                    </div>

                    {/* Comment */}
                    <div className='space-y-2'>
                        <Textarea
                            placeholder='تعليقك على خدمة التوصيل...'
                            className='h-20 resize-none'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={isSubmitting}
                            maxLength={500}
                        />
                        <p className='text-xs text-muted-foreground text-left'>
                            {comment.length}/500
                        </p>
                    </div>

                    <DialogFooter className='gap-2 sm:gap-0'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            إلغاء
                        </Button>
                        <Button
                            type='submit'
                            disabled={isSubmitting || rating === 0 || !selectedOrder || orders.length === 0}
                            className="btn-add"
                        >
                            {isSubmitting ? 'جاري الإرسال...' : 'إرسال'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 