'use client';

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

import { deleteDriver } from '../actions/deleteDriver';

interface DeleteDriverAlertProps {
    driverId: string;
    children: React.ReactNode;
}

export default function DeleteDriverAlert({ driverId, children }: DeleteDriverAlertProps) {
    const handleDelete = async () => {
        try {
            const result = await deleteDriver(driverId);

            if (result.ok) {
                toast.success(result.msg || 'تم حذف السائق بنجاح');
                setTimeout(() => window.location.reload(), 1200);
            } else {
                toast.error(result.msg || 'حدث خطأ أثناء حذف السائق');
            }
        } catch (error) {
            toast.error('فشل في حذف السائق، يرجى المحاولة لاحقاً');
            console.error('Error deleting driver:', error);
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
                        هل أنت متأكد من حذف هذا السائق؟ هذا الإجراء لا يمكن التراجع عنه.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        حذف
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 