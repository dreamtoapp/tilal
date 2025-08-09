'use client';

import { useState } from 'react';
import { Star, Smartphone } from 'lucide-react';
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
import { submitAppRating } from '../actions/ratingActions';

// App features for rating
const APP_FEATURES = [
    { id: 'overall', name: 'التجربة العامة' },
    { id: 'shopping', name: 'تجربة التسوق' },
    { id: 'checkout', name: 'عملية الدفع' },
    { id: 'performance', name: 'سرعة المتجر' },
    { id: 'design', name: 'التصميم' },
    { id: 'navigation', name: 'سهولة التنقل' }
];

interface AppRatingDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AppRatingDialog({ isOpen, onClose }: AppRatingDialogProps) {
    const [selectedFeature, setSelectedFeature] = useState<string>('overall');
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
            const result = await submitAppRating({
                feature: selectedFeature,
                rating,
                comment,
            });

            if (result.success) {
                toast.success(result.message);
                setSelectedFeature('overall');
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
            setSelectedFeature('overall');
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
                        <Smartphone className="w-5 h-5 text-feature-analytics" />
                        تقييم المتجر
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    {/* Feature Selection */}
                    <div className='space-y-2'>
                        <Select value={selectedFeature} onValueChange={setSelectedFeature}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {APP_FEATURES.map((feature) => (
                                    <SelectItem key={feature.id} value={feature.id}>
                                        {feature.name}
                                    </SelectItem>
                                ))}
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
                            placeholder='تعليقك...'
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
                            disabled={isSubmitting || rating === 0}
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