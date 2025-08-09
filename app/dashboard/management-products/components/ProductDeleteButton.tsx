'use client';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Removed unused import
import { toast } from 'sonner';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { deleteProduct } from '../actions/deleteProduct';

export default function ProductDeleteButton({ productId }: { productId: string }) {
    const handleDeleteProduct = async () => {
        try {
            await deleteProduct(productId);
            toast.success('تم حذف المنتج بنجاح.');
            // Optionally: refresh or update UI
        } catch (e) {
            let errorMessage = 'لا يمكن حذف المنتج. تحقق من عدم ارتباطه بمعاملات.';
            if (e instanceof Error) errorMessage = e.message;
            toast.error(errorMessage);
        }
    };

    return (
        <ConfirmDeleteDialog onConfirm={handleDeleteProduct}>
            <Button
                variant="ghost"
                size="sm"
                className="btn-delete p-2 h-8"
            >
                <Trash2 className="h-4 w-4 icon-enhanced" />
            </Button>
        </ConfirmDeleteDialog>
    );
} 