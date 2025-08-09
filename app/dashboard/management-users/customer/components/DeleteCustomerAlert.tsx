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

import { deleteCustomer } from '../actions/deleteCustomer';

interface DeleteCustomerAlertProps {
    customerId: string;
    children: React.ReactNode;
}

export default function DeleteCustomerAlert({ customerId, children }: DeleteCustomerAlertProps) {
    const handleDelete = async () => {
        try {
            const result = await deleteCustomer(customerId);

            if (result.ok) {
                toast.success(result.msg || 'تم حذف العميل بنجاح');
                setTimeout(() => window.location.reload(), 1200);
            } else {
                toast.error(result.msg || 'حدث خطأ أثناء حذف العميل');
            }
        } catch (error) {
            toast.error('فشل في حذف العميل، يرجى المحاولة لاحقاً');
            console.error('Error deleting customer:', error);
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
                        هل أنت متأكد من حذف هذا العميل؟ هذا الإجراء لا يمكن التراجع عنه.
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