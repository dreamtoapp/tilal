"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { removeFromWishlist } from '@/app/(e-comm)/(home-page-sections)/product/actions/wishlist';
import { toast } from 'sonner';

export default function WishlistRemoveButton({ productId, onRemove }: { productId: string; onRemove?: (id: string) => void }) {
    const [isRemoving, setIsRemoving] = useState(false);
    const handleRemove = async () => {
        if (isRemoving) return;
        setIsRemoving(true);
        try {
            const result = await removeFromWishlist(productId);
            if (result.success) {
                toast.success('تمت إزالة المنتج من المفضلة');
                if (onRemove) onRemove(productId);
            } else {
                toast.error(result.message || 'حدث خطأ أثناء الإزالة');
            }
        } catch (err) {
            toast.error('حدث خطأ أثناء الإزالة');
        } finally {
            setIsRemoving(false);
        }
    };
    return (
        <Button
            variant="ghost"
            size="sm"
            className="text-feature-suppliers hover:bg-feature-suppliers/10"
            onClick={handleRemove}
            disabled={isRemoving}
        >
            <Trash2 className="w-4 h-4 mr-2" />
            {isRemoving ? 'جاري الإزالة...' : 'إزالة من المفضلة'}
        </Button>
    );
} 