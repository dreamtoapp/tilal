"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { toast } from 'sonner';
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

const faqSchema = z.object({
    question: z.string().min(2, 'السؤال مطلوب'),
    answer: z.string().min(2, 'الإجابة مطلوبة'),
});

type FAQFormValues = z.infer<typeof faqSchema>;

type FAQ = FAQFormValues & { id: string };

export default function FAQTabClient({ aboutPageId }: { aboutPageId: string | null }) {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [form, setForm] = useState<FAQFormValues>({ question: '', answer: '' });
    const [editId, setEditId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/about/faq')
            .then(res => res.json())
            .then(res => {
                if (res.success) setFaqs(res.faqs);
            });
    }, []);

    async function handleAddOrEdit(e: any) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if (editId) {
            // Edit mode
            const res = await fetch('/api/about/faq', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editId, ...form }),
            });
            const result = await res.json();
            if (result.success) {
                setFaqs((prev) => prev.map(f => f.id === editId ? result.faq : f));
                setForm({ question: '', answer: '' });
                setEditId(null);
                toast.success('تم تحديث السؤال بنجاح');
            } else {
                setError(result.error?.toString() || 'فشل في التعديل');
            }
        } else {
            // Add mode
            if (!aboutPageId) {
                setError('لا يمكن إضافة سؤال قبل تحميل بيانات الصفحة');
                setLoading(false);
                return;
            }
            const res = await fetch('/api/about/faq', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, aboutPageId }),
            });
            const result = await res.json();
            if (result.success) {
                setFaqs((prev) => [...prev, result.faq]);
                setForm({ question: '', answer: '' });
                toast.success('تمت إضافة السؤال بنجاح');
            } else {
                setError(result.error?.toString() || 'فشل في الإضافة');
            }
        }
        setLoading(false);
    }

    async function handleDelete(id: string) {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/about/faq', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        const result = await res.json();
        if (result.success) {
            setFaqs((prev) => prev.filter(f => f.id !== id));
            if (editId === id) {
                setEditId(null);
                setForm({ question: '', answer: '' });
            }
        } else {
            setError(result.error?.toString() || 'فشل في الحذف');
        }
        setLoading(false);
    }

    function handleEdit(faq: FAQ) {
        setEditId(faq.id);
        setForm({ question: faq.question, answer: faq.answer });
    }

    function handleCancelEdit() {
        setEditId(null);
        setForm({ question: '', answer: '' });
        setError(null);
    }

    return (
        <div className="space-y-6" dir="rtl">
            {/* Add/Edit Form Card */}
            <Card>
                <CardHeader className="text-right">
                    <CardTitle>{editId ? 'تعديل السؤال' : 'إضافة سؤال جديد'}</CardTitle>
                </CardHeader>
                <CardContent className="text-right">
                    <form onSubmit={handleAddOrEdit} className="space-y-4">
                        <div>
                            <Label htmlFor="faqQuestion" className="text-sm font-medium text-right block">السؤال</Label>
                            <Input
                                id="faqQuestion"
                                value={form.question}
                                onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                                className="mt-1 text-right"
                                placeholder="أدخل السؤال"
                                dir="rtl"
                            />
                        </div>

                        <div>
                            <Label htmlFor="faqAnswer" className="text-sm font-medium text-right block">الإجابة</Label>
                            <Textarea
                                id="faqAnswer"
                                value={form.answer}
                                onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
                                className="mt-1 min-h-[100px] text-right"
                                placeholder="أدخل الإجابة"
                                dir="rtl"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-right">
                                <p className="text-destructive text-sm">{error}</p>
                            </div>
                        )}

                        <div className="flex gap-2 pt-4 justify-end">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                {loading ? 'جاري الحفظ...' : (editId ? 'تحديث السؤال' : 'إضافة السؤال')}
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

            {/* FAQ List Card */}
            <Card>
                <CardHeader className="text-right">
                    <CardTitle>الأسئلة الشائعة ({faqs.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {faqs.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            لا توجد أسئلة شائعة مضافة بعد
                        </div>
                    ) : (
                        <Accordion type="multiple" className="w-full" dir="rtl">
                            {faqs.map((faq) => (
                                <AccordionItem value={faq.id} key={faq.id}>
                                    <AccordionTrigger className="text-right">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-4 text-right">
                                            <div className="text-sm text-muted-foreground leading-relaxed">
                                                {faq.answer}
                                            </div>
                                            <div className="flex gap-2 pt-2 border-t justify-end">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(faq)}
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
                                                                هل أنت متأكد من حذف هذا السؤال؟ لا يمكن التراجع عن هذا الإجراء.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(faq.id)}>حذف</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 