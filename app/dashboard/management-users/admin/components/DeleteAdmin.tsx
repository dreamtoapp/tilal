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

import { deleteAdmin } from '../actions/deleteAdmin';

interface DeleteAdminAlertProps {
    adminId: string;
    children: React.ReactNode;
}

export default function DeleteAdminAlert({ adminId, children }: DeleteAdminAlertProps) {
    const handleDelete = async () => {
        try {
            const result = await deleteAdmin(adminId);

            if (result.ok) {
                toast.success(result.msg || 'تم حذف المشرف بنجاح');
                setTimeout(() => window.location.reload(), 1200);
            } else {
                toast.error(result.msg || 'حدث خطأ أثناء حذف المشرف');
            }
        } catch (error) {
            toast.error('فشل في حذف المشرف، يرجى المحاولة لاحقاً');
            console.error('Error deleting admin:', error);
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
                        هل أنت متأكد من حذف هذا المشرف؟ هذا الإجراء لا يمكن التراجع عنه.
                        لا يمكن حذف آخر مشرف في النظام.
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