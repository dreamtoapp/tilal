'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';
import { toast } from 'sonner';

interface PrivacyPolicy {
    id?: string;
    title: string;
    content: string;
    isActive: boolean;
    isPublished: boolean;
    version: number;
}

const DEFAULT_PRIVACY_POLICY_TEMPLATE = `سياسة الخصوصية وحماية البيانات الشخصية

مرحباً بكم في [اسم الشركة]. نحن نلتزم بحماية خصوصيتك وبياناتك الشخصية وفقاً لأعلى المعايير الدولية وقوانين المملكة العربية السعودية. تشرح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية.

1. مقدمة
   نحن [اسم الشركة]، شركة مسجلة في المملكة العربية السعودية برقم السجل التجاري [رقم السجل التجاري]، ومقرها الرئيسي في [العنوان]. نحن مسؤولون عن معالجة بياناتك الشخصية وفقاً لنظام حماية البيانات الشخصية الصادر بالمرسوم الملكي رقم (م/19) وتاريخ 9/2/1443هـ.

2. البيانات التي نجمعها
   نجمع الأنواع التالية من البيانات:
   • البيانات الشخصية: الاسم، رقم الهوية، تاريخ الميلاد، الجنسية
   • بيانات الاتصال: رقم الهاتف، البريد الإلكتروني، العنوان
   • بيانات الحساب: اسم المستخدم، كلمة المرور، تفضيلات الحساب
   • بيانات المعاملات: سجل الطلبات، المدفوعات، العناوين
   • بيانات التقنية: عنوان IP، نوع المتصفح، ملفات تعريف الارتباط
   • بيانات الاستخدام: صفحات الزيارة، وقت الاستخدام، التفاعلات

3. كيفية جمع البيانات
   نجمع بياناتك من المصادر التالية:
   • عند التسجيل في الموقع أو التطبيق
   • عند إتمام الطلبات والمدفوعات
   • من ملفات تعريف الارتباط والتقنيات المماثلة
   • من أجهزة التتبع والتحليلات
   • من التواصل مع خدمة العملاء
   • من الاستطلاعات والاستبيانات

4. أغراض معالجة البيانات
   نستخدم بياناتك للأغراض التالية:
   • توفير الخدمات المطلوبة وإتمام الطلبات
   • التواصل معك بخصوص طلباتك واستفساراتك
   • تحسين خدماتنا وتجربة المستخدم
   • إرسال العروض الترويجية (بموافقتك)
   • الامتثال للالتزامات القانونية والتنظيمية
   • حماية حقوقنا وحقوق المستخدمين الآخرين
   • إجراء البحوث والتحليلات

5. الأساس القانوني للمعالجة
   نعالج بياناتك على أساس:
   • تنفيذ العقد المبرم معك
   • الالتزام بالالتزامات القانونية
   • المصلحة المشروعة في تحسين خدماتنا
   • موافقتك الصريحة (حيث يلزم)

6. مشاركة البيانات
   لا نشارك بياناتك مع أطراف ثالثة إلا في الحالات التالية:
   • مع مزودي الخدمات المساعدين (مثل شركات الشحن والدفع)
   • عند الالتزام بالالتزامات القانونية
   • لحماية حقوقنا وحقوق الآخرين
   • بموافقتك الصريحة
   • مع السلطات المختصة عند الطلب القانوني

7. حماية البيانات
   نتخذ إجراءات أمنية صارمة لحماية بياناتك:
   • تشفير البيانات أثناء النقل والتخزين
   • تقييد الوصول للبيانات للموظفين المصرح لهم فقط
   • مراجعة دورية لإجراءات الأمان
   • تدريب الموظفين على حماية البيانات
   • نسخ احتياطية آمنة للبيانات

8. حقوقك
   وفقاً لنظام حماية البيانات الشخصية، لديك الحق في:
   • معرفة البيانات التي نجمعها عنك
   • الوصول لبياناتك الشخصية
   • تصحيح البيانات غير الدقيقة
   • حذف بياناتك (حيث يسمح القانون)
   • تقييد معالجة بياناتك
   • نقل بياناتك لجهة أخرى
   • الاعتراض على معالجة بياناتك
   • سحب الموافقة (حيث تنطبق)

9. ملفات تعريف الارتباط
   نستخدم ملفات تعريف الارتباط لتحسين تجربتك:
   • ملفات أساسية: ضرورية لعمل الموقع
   • ملفات وظيفية: لتحسين الأداء والوظائف
   • ملفات تحليلية: لفهم استخدام الموقع
   • ملفات تسويقية: للعروض المخصصة
   يمكنك إدارة تفضيلات ملفات تعريف الارتباط من إعدادات المتصفح.

10. الاحتفاظ بالبيانات
    نحتفظ ببياناتك طالما:
    • نحتاجها لتقديم الخدمات
    • مطلوب بموجب القانون
    • لحماية حقوقنا وحقوق الآخرين
    • بموافقتك المستمرة
    عند انتهاء الحاجة، نحذف البيانات بشكل آمن.

11. نقل البيانات
    قد ننقل بياناتك خارج المملكة العربية السعودية:
    • إلى دول تضمن حماية مناسبة للبيانات
    • بموافقتك الصريحة
    • عند وجود ضمانات كافية للحماية
    • للامتثال للالتزامات القانونية

12. تحديث السياسة
    قد نحدث هذه السياسة من وقت لآخر:
    • سننشر التحديثات على الموقع
    • سنرسل إشعاراً بالتغييرات المهمة
    • الاستمرار في استخدام الخدمات يعني الموافقة على التحديثات

13. التواصل معنا
    للاستفسارات حول هذه السياسة أو ممارسة حقوقك:
    • البريد الإلكتروني: [البريد الإلكتروني]
    • الهاتف: [رقم الهاتف]
    • العنوان: [العنوان]
    • مسؤول حماية البيانات: [اسم المسؤول]

14. الشكاوى
    يمكنك تقديم شكوى إلى:
    • إدارة حماية البيانات الشخصية في المملكة
    • الهيئة السعودية للبيانات والذكاء الاصطناعي
    • المحاكم المختصة في المملكة

آخر تحديث: ${new Date().toLocaleDateString('ar-SA')}`;

export default function PrivacyPolicyPage() {
    const [policy, setPolicy] = useState<PrivacyPolicy>({
        title: 'سياسة الخصوصية',
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
            const response = await fetch('/api/policies/privacy');
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
            const response = await fetch('/api/policies/privacy', {
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
            const response = await fetch(`/api/policies/privacy/${action}`, {
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
        setPolicy(prev => ({ ...prev, content: DEFAULT_PRIVACY_POLICY_TEMPLATE }));
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
                    <h1 className="text-2xl font-bold">سياسة الخصوصية</h1>
                    <p className="text-sm text-muted-foreground">إدارة سياسة الخصوصية</p>
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
                        <Icon name={policy.isPublished ? "EyeOff" : "Shield"} className="h-4 w-4" />
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
                            placeholder="اكتب محتوى سياسة الخصوصية هنا..."
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
                            <div>• استخدم &quot;تحميل قالب&quot; للحصول على قالب متوافق مع قانون حماية البيانات السعودي</div>
                            <div>• قم بتخصيص المعلومات بين الأقواس المربعة [...]</div>
                            <div>• تأكد من تحديث معلومات التواصل والشركة</div>
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