'use client';

import { useState } from 'react';
import { toast } from 'sonner';

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

import { Icon } from '@/components/icons/Icon';

interface DeleteMarketerAlertProps {
    marketerId: string;
    children: React.ReactNode;
}

export default function DeleteMarketerAlert({ children }: DeleteMarketerAlertProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            // TODO: Implement delete marketer action
            toast.success('تم حذف المسوق بنجاح');
            // Trigger page refresh to show updated data
            window.location.reload();
        } catch (error) {
            console.error('Error deleting marketer:', error);
            toast.error('حدث خطأ أثناء حذف المسوق');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                    <AlertDialogDescription>
                        هل أنت متأكد من حذف هذا المسوق؟ هذا الإجراء لا يمكن التراجع عنه.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {loading ? (
                            <>
                                <Icon name="Loader2" size="sm" className="mr-2 animate-spin" />
                                جاري الحذف...
                            </>
                        ) : (
                            <>
                                <Icon name="Trash2" size="sm" className="mr-2" />
                                حذف
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 