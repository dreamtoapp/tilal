'use client';

import { useState } from 'react';
import { Icon } from '@/components/icons/Icon';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
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

import { unassignDriverFromOrder } from '../actions/assign-driver';

interface UnassignDriverProps {
    orderId: string;
    driverName?: string;
}

export default function UnassignDriver({ orderId, driverName }: UnassignDriverProps) {
    const [isUnassigning, setIsUnassigning] = useState(false);

    const handleUnassign = async () => {
        setIsUnassigning(true);

        try {
            const result = await unassignDriverFromOrder(orderId);

            if (result.success) {
                toast.success("تم إلغاء التعيين بنجاح", {
                    description: result.message,
                });
            } else {
                toast.error("فشل في إلغاء التعيين", {
                    description: result.message,
                });
            }
        } catch (error) {
            console.error('Unassignment error:', error);
            toast.error("خطأ في إلغاء التعيين", {
                description: "حدث خطأ أثناء إلغاء تعيين السائق",
            });
        } finally {
            setIsUnassigning(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    disabled={isUnassigning}
                >
                    <Icon name="UserX" className="h-4 w-4" />
                    إلغاء التعيين
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent dir="rtl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                        <Icon name="AlertTriangle" className="h-5 w-5" />
                        تأكيد إلغاء تعيين السائق
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-right">
                        هل أنت متأكد من إلغاء تعيين السائق{driverName ? ` "${driverName}"` : ''} من هذا الطلب؟
                        <br />
                        <span className="text-amber-600 font-medium">
                            سيتم إرجاع الطلب إلى قائمة الطلبات قيد الانتظار.
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="ml-0">إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleUnassign}
                        disabled={isUnassigning}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isUnassigning ? "جاري الإلغاء..." : "تأكيد الإلغاء"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    // TODO: Next version enhancements
    // - Add reason field for unassignment
    // - Send notification to driver about unassignment
    // - Log unassignment action with admin details
    // - Add bulk unassignment functionality
    // - Add confirmation requirement for admin approval
} 