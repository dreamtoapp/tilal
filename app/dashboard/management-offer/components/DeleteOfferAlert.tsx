'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteOffer } from '../actions/delete-offer';

interface DeleteOfferAlertProps {
    offerId: string;
}

export function DeleteOfferAlert({ offerId }: DeleteOfferAlertProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await deleteOffer(offerId);
            setOpen(false);
        } catch (error) {
            console.error('Error deleting offer:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="btn-delete">
                    <Trash2 size={14} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl">
                <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                    <AlertDialogDescription>
                        هل أنت متأكد من حذف هذه المجموعة؟
                        لا يمكن التراجع عن هذا الإجراء.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="btn-delete"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                جاري الحذف...
                            </>
                        ) : (
                            'تأكيد الحذف'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 