'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';
import { toast } from 'sonner';

interface ShippingPolicy {
    id?: string;
    title: string;
    content: string;
    isActive: boolean;
    isPublished: boolean;
    version: number;
}

const DEFAULT_SHIPPING_POLICY_TEMPLATE = `سياسة الشحن والتوصيل

مرحباً بكم في [اسم الشركة]. نحن نلتزم بتوفير خدمة شحن سريعة وموثوقة لجميع عملائنا في المملكة العربية السعودية. تشرح هذه السياسة تفاصيل خدمات الشحن والتوصيل التي نقدمها.

1. مقدمة
   نحن [اسم الشركة]، شركة مسجلة في المملكة العربية السعودية برقم السجل التجاري [رقم السجل التجاري]، ومقرها الرئيسي في [العنوان]. نتعاون مع أفضل شركات الشحن لتوفير خدمة توصيل ممتازة.

2. مناطق التوصيل
   نوفر خدمة التوصيل في:
   • جميع مدن المملكة العربية السعودية
   • المناطق الحضرية والريفية
   • الجزر والمناطق النائية (رسوم إضافية)
   • المناطق الصناعية والتجارية
   • الجامعات والمستشفيات والمراكز الحكومية

3. طرق الشحن المتاحة
   نوفر عدة خيارات للشحن:
   • التوصيل السريع (1-2 يوم عمل): 50 ريال
   • التوصيل العادي (3-5 أيام عمل): 25 ريال
   • التوصيل الاقتصادي (5-7 أيام عمل): 15 ريال
   • التوصيل المجاني: للطلبات فوق 200 ريال
   • التوصيل في نفس اليوم: 100 ريال (في المدن الرئيسية)

4. شركات الشحن المعتمدة
   نتعاون مع شركات شحن موثوقة:
   • البريد السعودي (Saudi Post)
   • أرامكس (Aramex)
   • دي إتش إل (DHL)
   • فيديكس (FedEx)
   • يو بي إس (UPS)
   • شركات الشحن المحلية المعتمدة

5. وقت المعالجة
   نعالج الطلبات خلال:
   • الطلبات قبل 2 مساءً: شحن في نفس اليوم
   • الطلبات بعد 2 مساءً: شحن في اليوم التالي
   • أيام العطل الرسمية: لا يتم الشحن
   • الطلبات المخصصة: 3-5 أيام عمل إضافية

6. تتبع الشحنة
   نوفر خدمة تتبع شاملة:
   • رقم تتبع فريد لكل شحنة
   • تحديثات فورية على حالة الشحنة
   • إشعارات عبر البريد الإلكتروني والرسائل النصية
   • رابط تتبع مباشر على موقعنا
   • تطبيق جوال لتتبع الشحنات

7. تسليم الشحنة
   عند وصول الشحنة:
   • يتم الاتصال بالعميل لتأكيد الموعد
   • تسليم الشحنة في العنوان المحدد
   • طلب توقيع العميل كإيصال استلام
   • إمكانية تفويض شخص آخر للتسلم
   • خيار استلام الشحنة من أقرب فرع

8. الشحنات المرفوضة
   قد يتم رفض الشحنة في الحالات التالية:
   • العنوان غير صحيح أو غير مكتمل
   • العميل غير متاح في العنوان
   • رفض العميل استلام الشحنة
   • عدم دفع رسوم الشحن الإضافية
   • الشحنة تحتوي على مواد محظورة

9. رسوم الشحن الإضافية
   قد تطبق رسوم إضافية:
   • المناطق النائية: 30 ريال إضافي
   • الشحن في العطل الرسمية: 50 ريال
   • الشحن السريع خارج المدن الرئيسية: 75 ريال
   • إعادة المحاولة: 15 ريال
   • تغيير العنوان: 20 ريال

10. الشحنات الدولية
    نوفر خدمة الشحن الدولي إلى:
    • دول مجلس التعاون الخليجي
    • الدول العربية
    • أوروبا وأمريكا الشمالية
    • آسيا وأفريقيا
    • أستراليا ونيوزيلندا
    رسوم الشحن الدولي تبدأ من 150 ريال حسب الوجهة.

11. الشحنات الكبيرة والثقيلة
    للمنتجات الكبيرة والثقيلة:
    • أثاث منزلي ومكتبي
    • أجهزة كهربائية كبيرة
    • معدات رياضية
    • منتجات صناعية
    • شحنات تجارية
    يتم تقديم عرض سعر مخصص لهذه الشحنات.

12. التأمين على الشحنات
    نؤمن على جميع الشحنات:
    • تأمين أساسي: يغطي القيمة الكاملة
    • تأمين إضافي: للمنتجات عالية القيمة
    • تعويض فوري في حالة التلف أو الفقدان
    • تقرير مفصل عن أي حادث
    • استبدال المنتج أو استرداد المبلغ

13. الشحنات الحساسة
    نتعامل بحذر مع:
    • المنتجات الإلكترونية الحساسة
    • المنتجات الزجاجية والهشة
    • المنتجات الغذائية القابلة للتلف
    • المنتجات الطبية والصيدلانية
    • المنتجات الفنية والتحف
    نستخدم عبوات وتغليف خاص لهذه المنتجات.

14. سياسة إعادة الشحن
    في حالة فشل التسليم:
    • محاولة ثانية مجانية خلال 24 ساعة
    • محاولة ثالثة برسوم 15 ريال
    • إعادة الشحنة للمستودع بعد 3 محاولات
    • خصم رسوم الشحن من المبلغ المسترد
    • إمكانية تغيير العنوان برسوم إضافية

15. التواصل والدعم
    للاستفسارات حول الشحن:
    • البريد الإلكتروني: [البريد الإلكتروني]
    • الهاتف: [رقم الهاتف]
    • الواتساب: [رقم الواتساب]
    • الدردشة المباشرة: متاحة 24/7
    • ساعات العمل: [الأوقات]

16. الشكاوى والاقتراحات
    نرحب بملاحظاتكم:
    • تقييم خدمة الشحن بعد كل طلب
    • تقديم شكوى عبر موقعنا الإلكتروني
    • التواصل مع مدير خدمة العملاء
    • اقتراحات لتحسين الخدمة
    • استطلاعات رضا العملاء

آخر تحديث: ${new Date().toLocaleDateString('ar-SA')}`;

export default function ShippingPolicyPage() {
    const [policy, setPolicy] = useState<ShippingPolicy>({
        title: 'سياسة الشحن',
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
            const response = await fetch('/api/policies/shipping');
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
            const response = await fetch('/api/policies/shipping', {
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
            const response = await fetch(`/api/policies/shipping/${action}`, {
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
        setPolicy(prev => ({ ...prev, content: DEFAULT_SHIPPING_POLICY_TEMPLATE }));
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
                    <h1 className="text-2xl font-bold">سياسة الشحن</h1>
                    <p className="text-sm text-muted-foreground">إدارة سياسة الشحن</p>
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
                        <Icon name={policy.isPublished ? "EyeOff" : "Truck"} className="h-4 w-4" />
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
                            placeholder="اكتب محتوى سياسة الشحن هنا..."
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
                            <div>• استخدم &quot;تحميل قالب&quot; للحصول على قالب شامل لسياسة الشحن</div>
                            <div>• قم بتخصيص المعلومات بين الأقواس المربعة [...]</div>
                            <div>• تأكد من تحديث رسوم الشحن والمناطق بدقة</div>
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