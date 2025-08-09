"use client";
import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import AddImage from '@/components/AddImage';
import Image from 'next/image';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const featureSchema = z.object({
    title: z.string().min(2, 'العنوان مطلوب'),
    description: z.string().min(2, 'الوصف مطلوب'),
    imageUrl: z.string().url('رابط الصورة غير صالح').optional(),
});

type FeatureFormValues = z.infer<typeof featureSchema>;

type Feature = FeatureFormValues & { id: string };

function extractErrorMessage(error: any): string {
    if (!error) return "حدث خطأ غير متوقع";
    if (typeof error === "string") return error;
    if (error.message) return error.message;
    if (error.error && error.error.fieldErrors) {
        const firstField = Object.values(error.error.fieldErrors)[0];
        if (Array.isArray(firstField) && firstField.length > 0) {
            return firstField[0];
        }
    }
    if (error.code && error.meta && error.meta.cause) return error.meta.cause;
    try {
        return JSON.stringify(error);
    } catch {
        return "حدث خطأ غير متوقع";
    }
}

export default function FeaturesTabClient({ aboutPageId }: { aboutPageId: string | null }) {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [form, setForm] = useState<FeatureFormValues>({ title: '', description: '' });
    const [editId, setEditId] = useState<string | null>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const titleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch('/api/about/features')
            .then(res => res.json())
            .then(res => {
                if (res.success) setFeatures(res.features);
            });
    }, []);

    useEffect(() => {
        if (editId && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [editId]);

    async function handleAddOrEdit(e: any) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if (editId) {
            // Edit mode (require imageUrl)
            if (!form.imageUrl) {
                setError({ fieldErrors: { imageUrl: ['رابط الصورة غير صالح'] } });
                setLoading(false);
                return;
            }
            const res = await fetch('/api/about/features', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editId, ...form, aboutPageId }),
            });
            const result = await res.json();
            if (result.success) {
                setFeatures((prev) => prev.map(f => f.id === editId ? result.feature : f));
                setForm({ title: '', description: '' });
                setEditId(null);
                toast.success('تم تحديث الميزة بنجاح');
            } else {
                setError(result.error);
            }
        } else {
            // Add mode (do not require imageUrl)
            const res = await fetch('/api/about/features', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, aboutPageId }),
            });
            const result = await res.json();
            if (result.success) {
                setFeatures((prev) => [...prev, result.feature]);
                setForm({ title: '', description: '' });
                toast.success('تمت إضافة الميزة بنجاح');
            } else {
                setError(result.error);
            }
        }
        setLoading(false);
    }

    async function handleDelete(id: string) {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/about/features', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        const result = await res.json();
        if (result.success) {
            setFeatures((prev) => prev.filter(f => f.id !== id));
            if (editId === id) {
                setEditId(null);
                setForm({ title: '', description: '' });
            }
        } else {
            setError(extractErrorMessage(result.error));
        }
        setLoading(false);
    }

    function handleEdit(feature: Feature) {
        setEditId(feature.id);
        setForm({ title: feature.title, description: feature.description, imageUrl: feature.imageUrl });
    }

    function handleCancelEdit() {
        setEditId(null);
        setForm({ title: '', description: '' });
        setError(null);
    }

    return (
        <div className="space-y-6" dir="rtl">
            {/* Add/Edit Form Card */}
            <Card>
                <CardHeader className="text-right">
                    <CardTitle>{editId ? 'تعديل الميزة' : 'إضافة ميزة جديدة'}</CardTitle>
                </CardHeader>
                <CardContent className="text-right">
                    <form onSubmit={handleAddOrEdit} className="space-y-4">
                        <div>
                            <Label htmlFor="featureTitle" className="text-sm font-medium text-right block">العنوان</Label>
                            <Input
                                id="featureTitle"
                                ref={titleInputRef}
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                className="mt-1 text-right"
                                placeholder="أدخل عنوان الميزة"
                                dir="rtl"
                            />
                            {error && typeof error === 'object' && error.fieldErrors?.title && (
                                <p className="text-destructive text-sm mt-1 text-right">{error.fieldErrors.title[0]}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="featureDescription" className="text-sm font-medium text-right block">الوصف</Label>
                            <Textarea
                                id="featureDescription"
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                className="mt-1 min-h-[100px] text-right"
                                placeholder="أدخل وصف الميزة"
                                dir="rtl"
                            />
                            {error && typeof error === 'object' && error.fieldErrors?.description && (
                                <p className="text-destructive text-sm mt-1 text-right">{error.fieldErrors.description[0]}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="featureImage" className="text-sm font-medium text-right block">صورة الميزة</Label>
                            {editId ? (
                                <div className="mt-1 w-48 h-32 border rounded-md overflow-hidden">
                                    <AddImage
                                        url={form.imageUrl}
                                        alt="صورة الميزة"
                                        recordId={editId}
                                        table="feature"
                                        tableField="imageUrl"
                                        onUploadComplete={url => setForm(f => ({ ...f, imageUrl: url }))}
                                        autoUpload
                                    />
                                </div>
                            ) : (
                                <Alert className="mt-2 text-right">
                                    <AlertTitle>إرشادات الصورة</AlertTitle>
                                    <AlertDescription>
                                        أضف الميزة ثم ارفع الصورة بعد تحديد الميزة للتعديل
                                    </AlertDescription>
                                </Alert>
                            )}
                            {error && typeof error === 'object' && error.fieldErrors?.imageUrl && (
                                <p className="text-destructive text-sm mt-1 text-right">{error.fieldErrors.imageUrl[0]}</p>
                            )}
                        </div>

                        {error && typeof error === 'object' && error.fieldErrors?.aboutPageId && (
                            <p className="text-destructive text-sm text-right">{error.fieldErrors.aboutPageId[0]}</p>
                        )}
                        {error && typeof error === 'object' && Array.isArray(error.formErrors) && error.formErrors.length > 0 && (
                            <ul className="text-destructive text-sm text-right">
                                {error.formErrors.map((msg: string, i: number) => <li key={i}>{msg}</li>)}
                            </ul>
                        )}
                        {error && typeof error === 'string' && (
                            <p className="text-destructive text-sm text-right">{error}</p>
                        )}

                        <div className="flex gap-2 pt-4 justify-end">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                {loading ? 'جاري الحفظ...' : (editId ? 'تحديث الميزة' : 'إضافة الميزة')}
                            </Button>
                            {editId && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancelEdit}
                                >
                                    إلغاء
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Features List Card */}
            <Card>
                <CardHeader className="text-right">
                    <CardTitle>المميزات الحالية ({features.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {features.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            لا توجد مميزات مضافة بعد
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {features.map((feature) => (
                                <div key={feature.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4" dir="rtl">
                                    <div className="flex-1 text-right">
                                        <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                                        {feature.imageUrl && feature.imageUrl.trim() !== '' && (
                                            <Image
                                                src={feature.imageUrl}
                                                alt={feature.title}
                                                width={96}
                                                height={64}
                                                className="w-24 h-16 object-cover rounded-md"
                                            />
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(feature)}
                                        >
                                            تعديل
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm">حذف</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent dir="rtl">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        هل أنت متأكد من حذف هذه الميزة؟ لا يمكن التراجع عن هذا الإجراء.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(feature.id)}>حذف</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 