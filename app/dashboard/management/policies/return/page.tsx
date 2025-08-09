'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';
import { toast } from 'sonner';

interface ReturnPolicy {
    id?: string;
    title: string;
    content: string;
    isActive: boolean;
    isPublished: boolean;
    version: number;
}

const DEFAULT_RETURN_POLICY_TEMPLATE = `سياسة الإرجاع والاستبدال

مرحباً بكم في [اسم الشركة]. نحن نلتزم بتوفير تجربة تسوق ممتازة وضمان رضاكم التام. تشرح هذه السياسة شروط وإجراءات الإرجاع والاستبدال وفقاً لقوانين حماية المستهلك في المملكة العربية السعودية.

1. مقدمة
   نحن [اسم الشركة]، شركة مسجلة في المملكة العربية السعودية برقم السجل التجاري [رقم السجل التجاري]، ومقرها الرئيسي في [العنوان]. نلتزم بتطبيق سياسة إرجاع شفافة وعادلة لجميع عملائنا الكرام.

2. الحق في الإرجاع
   وفقاً لنظام حماية المستهلك السعودي، يحق لك إرجاع المنتج في الحالات التالية:
   • المنتج لا يتطابق مع المواصفات المعلنة
   • المنتج معيب أو تالف
   • المنتج غير مناسب للاستخدام المطلوب
   • المنتج لا يلبي التوقعات المعقولة

3. فترة الإرجاع
   • المنتجات الإلكترونية: 14 يوم من تاريخ الاستلام
   • الملابس والأحذية: 30 يوم من تاريخ الاستلام
   • المنتجات المنزلية: 14 يوم من تاريخ الاستلام
   • المنتجات الغذائية: لا يمكن إرجاعها إلا في حالة التلف
   • المنتجات المخصصة: لا يمكن إرجاعها

4. شروط الإرجاع
   يجب أن يكون المنتج:
   • في حالة ممتازة كما تم استلامه
   • في العبوة الأصلية مع جميع الملحقات
   • غير مستخدم أو مستخدم بشكل طفيف
   • يحتوي على جميع الأوراق والضمانات
   • لا يحتوي على علامات تلف أو تلوث

5. المنتجات غير القابلة للإرجاع
   لا يمكن إرجاع المنتجات التالية:
   • المنتجات المخصصة حسب الطلب
   • المنتجات الرقمية والبرمجيات
   • المنتجات الصحية والجمالية المفتوحة
   • المنتجات الغذائية والمنتجات القابلة للتلف
   • المنتجات المخصومة أو المعروضة للبيع
   • المنتجات المستخدمة بشكل واضح

6. إجراءات الإرجاع
   لإرجاع منتج، اتبع الخطوات التالية:
   1. اتصل بخدمة العملاء خلال فترة الإرجاع
   2. قدم رقم الطلب وسبب الإرجاع
   3. احصل على رقم مرجعي للإرجاع
   4. احزم المنتج بشكل آمن في العبوة الأصلية
   5. أرسل المنتج إلى العنوان المحدد
   6. احتفظ بإيصال الشحن كدليل

7. طرق الإرجاع
   نوفر طرق إرجاع متعددة:
   • إرجاع مجاني عبر شركة الشحن
   • إرجاع في أحد فروعنا (إن وجدت)
   • إرجاع عبر نقاط التجميع المعتمدة
   • إرجاع منزلي (رسوم إضافية)

8. فحص المنتج
   عند استلام المنتج المرتجع:
   • نفحص المنتج خلال 3-5 أيام عمل
   • نتأكد من تطابق شروط الإرجاع
   • نتصل بك في حالة وجود أي استفسار
   • نعالج طلب الإرجاع أو نرفضه مع التبرير

9. خيارات الإرجاع
   عند الموافقة على الإرجاع، يمكنك اختيار:
   • استرداد المبلغ المدفوع بالكامل
   • استبدال المنتج بمنتج مماثل
   • استبدال المنتج بمنتج آخر مع دفع الفرق
   • رصيد في المحفظة الإلكترونية
   • قسيمة خصم لاستخدامها لاحقاً

10. استرداد المبلغ
    نعالج استرداد المبلغ خلال:
    • البطاقات الائتمانية: 5-10 أيام عمل
    • التحويل البنكي: 3-7 أيام عمل
    • المحافظ الإلكترونية: 1-3 أيام عمل
    • النقد عند الإرجاع في الفرع: فوري

11. رسوم الإرجاع
    • الإرجاع المجاني: للمنتجات المعيبة أو غير المطابقة
    • رسوم الشحن: 25 ريال للمنتجات المرتجعة بدون سبب وجيه
    • رسوم الفحص: 15 ريال للمنتجات الإلكترونية
    • رسوم إعادة التغليف: 10 ريال إذا تلفت العبوة الأصلية

12. الاستثناءات
    لا تنطبق هذه السياسة على:
    • المنتجات المباعة من خلال المزادات
    • المنتجات المستخدمة في العروض الخاصة
    • المنتجات المقدمة كهدايا أو عينات
    • المنتجات المباعة من خلال شركاء البيع

13. الضمان
    بالإضافة لحق الإرجاع، نقدم ضمان المصنع:
    • الإلكترونيات: 1-3 سنوات حسب المنتج
    • الملابس: 6 أشهر على العيوب الصناعية
    • الأثاث: 1-5 سنوات حسب النوع
    • الأجهزة المنزلية: 1-2 سنوات

14. التواصل معنا
    للاستفسارات حول الإرجاع:
    • البريد الإلكتروني: [البريد الإلكتروني]
    • الهاتف: [رقم الهاتف]
    • الواتساب: [رقم الواتساب]
    • ساعات العمل: [الأوقات]

15. الشكاوى
    في حالة عدم رضاك عن قرار الإرجاع:
    • يمكنك تقديم شكوى لمدير خدمة العملاء
    • التواصل مع إدارة الجودة
    • تقديم شكوى لجهاز حماية المنافسة ومنع الممارسات الاحتكارية
    • اللجوء للمحاكم المختصة

آخر تحديث: ${new Date().toLocaleDateString('ar-SA')}`;

export default function ReturnPolicyPage() {
    const [policy, setPolicy] = useState<ReturnPolicy>({
        title: 'سياسة الإرجاع',
        content: '',
        isActive: true,
        isPublished: false,
        version: 1
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadPolicy();
    }, []);

    const loadPolicy = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/policies/return');
            if (response.ok) {
                const data = await response.json();
                setPolicy(data);
            }
        } catch (error) {
            console.error('Error loading policy:', error);
            toast.error('فشل في تحميل السياسة');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!policy.content.trim()) {
            toast.error('يرجى إدخال محتوى السياسة');
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch('/api/policies/return', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: policy.title,
                    content: policy.content,
                    isActive: true,
                    isPublished: false
                })
            });

            if (response.ok) {
                const savedPolicy = await response.json();
                setPolicy(savedPolicy);
                toast.success('تم حفظ السياسة');
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'حدث خطأ أثناء الحفظ');
            }
        } catch (error) {
            console.error('Error saving policy:', error);
            toast.error('حدث خطأ أثناء الحفظ');
        } finally {
            setIsSaving(false);
        }
    };

    const handleTogglePublish = async () => {
        if (!policy.id) {
            toast.error('يرجى حفظ السياسة أولاً');
            return;
        }

        try {
            const action = policy.isPublished ? 'unpublish' : 'publish';
            const response = await fetch(`/api/policies/return/${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: policy.id })
            });

            if (response.ok) {
                const updatedPolicy = await response.json();
                setPolicy(updatedPolicy);
                const message = policy.isPublished ? 'تم إلغاء النشر' : 'تم النشر';
                toast.success(message);
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'حدث خطأ');
            }
        } catch (error) {
            console.error('Error toggling publish:', error);
            toast.error('حدث خطأ');
        }
    };

    const loadTemplate = () => {
        setPolicy(prev => ({ ...prev, content: DEFAULT_RETURN_POLICY_TEMPLATE }));
        toast.success('تم تحميل القالب الافتراضي');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center gap-2">
                    <Icon name="Loader2" className="h-5 w-5 animate-spin" />
                    <span>جاري التحميل...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">سياسة الإرجاع</h1>
                    <p className="text-sm text-muted-foreground">إدارة سياسة الإرجاع</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={loadTemplate}
                        disabled={isLoading}
                    >
                        <Icon name="FileText" className="h-4 w-4" />
                        <span className="mr-2">تحميل قالب</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving || !policy.content.trim()}
                    >
                        {isSaving ? (
                            <Icon name="Loader2" className="h-4 w-4 animate-spin" />
                        ) : (
                            <Icon name="Save" className="h-4 w-4" />
                        )}
                        <span className="mr-2">حفظ</span>
                    </Button>
                    <Button
                        size="sm"
                        variant={policy.isPublished ? "destructive" : "default"}
                        onClick={handleTogglePublish}
                        disabled={!policy.id || !policy.content.trim()}
                    >
                        <Icon name={policy.isPublished ? "EyeOff" : "Undo"} className="h-4 w-4" />
                        <span className="mr-2">{policy.isPublished ? "إلغاء النشر" : "نشر"}</span>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                <div className="flex items-center gap-4 text-sm">
                    <Badge variant={policy.isPublished ? "default" : "secondary"}>
                        {policy.isPublished ? "منشور" : "مسودة"}
                    </Badge>
                    <span className="text-muted-foreground">الإصدار: {policy.version}</span>
                    {policy.isPublished && (
                        <span className="text-muted-foreground">
                            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
                        </span>
                    )}
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <Textarea
                            placeholder="اكتب محتوى سياسة الإرجاع هنا..."
                            value={policy.content}
                            onChange={(e) => setPolicy(prev => ({ ...prev, content: e.target.value }))}
                            className="min-h-[400px] text-right leading-relaxed resize-none"
                            style={{
                                direction: 'rtl',
                                textAlign: 'right',
                                fontFamily: 'inherit',
                                lineHeight: '1.8'
                            }}
                        />
                        <div className="text-destructive font-semibold mt-2">ملاحظة: لإظهار النقاط الموجزة للعملاء في صفحة الدفع، ابدأ كل نقطة موجزة في السياسة بـ [*] في بداية السطر.</div>
                        <div className="mt-2 text-xs text-muted-foreground space-y-1">
                            <div><strong>نصائح:</strong></div>
                            <div>• استخدم &quot;تحميل قالب&quot; للحصول على قالب متوافق مع قانون حماية المستهلك السعودي</div>
                            <div>• قم بتخصيص المعلومات بين الأقواس المربعة [...]</div>
                            <div>• تأكد من تحديد فترات الإرجاع والرسوم بدقة</div>
                        </div>
                    </CardContent>
                </Card>

                {policy.content && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">معاينة</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="p-4 border rounded-lg bg-muted/30 min-h-[200px] text-right leading-relaxed"
                                style={{
                                    direction: 'rtl',
                                    textAlign: 'right',
                                    whiteSpace: 'pre-wrap',
                                    fontFamily: 'inherit',
                                    lineHeight: '1.8'
                                }}
                            >
                                {policy.content}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
} 