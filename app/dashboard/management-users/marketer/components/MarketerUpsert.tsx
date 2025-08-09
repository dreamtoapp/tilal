'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';

import { marketerSchema, MarketerFormData } from '../helpers/marketerSchema';
import { getMarketerFields } from '../helpers/marketerFields';
import { upsertMarketer } from '../actions/upsertMarketer';
import DynamicForm from '@/components/DynamicForm';

interface MarketerUpsertProps {
    mode: 'new' | 'update';
    title: string;
    description: string;
    defaultValues: MarketerFormData;
    marketerId?: string;
    children?: React.ReactNode;
}

export default function MarketerUpsert({
    mode,
    title,
    description,
    defaultValues,
    marketerId,
    children,
}: MarketerUpsertProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<MarketerFormData>({
        resolver: zodResolver(marketerSchema),
        defaultValues,
    });

    const onSubmit = async (data: MarketerFormData) => {
        setLoading(true);
        try {
            const result = await upsertMarketer(data, mode, marketerId);

            if (result.ok) {
                toast.success(result.msg);
                setOpen(false);
                form.reset(defaultValues);
                // Trigger page refresh to show updated data
                window.location.reload();
            } else {
                toast.error(result.msg || 'حدث خطأ أثناء حفظ البيانات');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('حدث خطأ أثناء حفظ البيانات');
        } finally {
            setLoading(false);
        }
    };

    const fields = getMarketerFields(form.register, form.formState.errors);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button className="bg-orange-600 hover:bg-orange-700">
                        <Icon name="Plus" size="sm" className="mr-2" />
                        {mode === 'new' ? 'إضافة مسوق' : 'تعديل'}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-orange-700">{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <DynamicForm fields={fields} />

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            إلغاء
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            {loading ? (
                                <>
                                    <Icon name="Loader2" size="sm" className="mr-2 animate-spin" />
                                    جاري الحفظ...
                                </>
                            ) : (
                                <>
                                    <Icon name="Save" size="sm" className="mr-2" />
                                    {mode === 'new' ? 'إضافة' : 'تحديث'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 