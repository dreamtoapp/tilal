import AboutForm from './AboutForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AboutFormValues } from '../actions/updateAboutPageContent';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface AboutTabClientProps {
    defaultValues?: Partial<AboutFormValues>;
    onSubmit: (values: AboutFormValues) => void;
    status?: string;
    error?: string;
}

export default function AboutTabClient({ defaultValues, onSubmit, status, error }: AboutTabClientProps) {
    useEffect(() => {
        if (status === 'success') {
            toast.success('تم الحفظ بنجاح');
        }
        if (error) {
            toast.error(error);
        }
    }, [status, error]);

    return (
        <Card className="w-full" dir="rtl">
            <CardHeader className="text-right">
                <CardTitle>معلومات الشركة الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="text-right">
                {error && (
                    <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-right">
                        <p className="text-destructive text-sm">{error}</p>
                    </div>
                )}
                {defaultValues && (
                    <AboutForm
                        defaultValues={defaultValues}
                        onSubmit={onSubmit}
                    />
                )}
                {status === 'success' && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-right">
                        <p className="text-green-700 text-sm">تم الحفظ بنجاح</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 