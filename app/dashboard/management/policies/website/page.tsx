'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';
import { toast } from 'sonner';

interface WebsitePolicy {
    id?: string;
    title: string;
    content: string;
    isActive: boolean;
    isPublished: boolean;
    version: number;
}

const DEFAULT_WEBSITE_POLICY_TEMPLATE = `سياسة الموقع والشروط والأحكام

مرحباً بكم في موقعنا الإلكتروني. باستخدام هذا الموقع، فإنك توافق على هذه الشروط والأحكام. يرجى قراءة هذه السياسة بعناية قبل استخدام الموقع.

1. مقدمة
   نحن [اسم الشركة]، شركة مسجلة في المملكة العربية السعودية برقم السجل التجاري [رقم السجل التجاري]، ومقرها الرئيسي في [العنوان]. نحن نقدم خدماتنا من خلال هذا الموقع الإلكتروني وفقاً للقوانين والأنظمة المعمول بها في المملكة العربية السعودية.

2. شروط الاستخدام
   • يجب أن تكون عمرك 18 عاماً أو أكثر لاستخدام هذا الموقع
   • يحظر استخدام الموقع لأي أغراض غير قانونية أو ضارة
   • يجب الحفاظ على سرية معلومات الحساب وعدم مشاركتها مع الآخرين
   • يحظر محاولة اختراق الموقع أو إلحاق الضرر به
   • يجب احترام حقوق الملكية الفكرية للمحتوى

3. التسجيل والحسابات
   • التسجيل في الموقع مجاني وطوعي
   • يجب تقديم معلومات صحيحة ودقيقة عند التسجيل
   • أنت مسؤول عن الحفاظ على أمان كلمة المرور
   • يحق لنا تعليق أو إلغاء الحساب في حالة مخالفة الشروط

4. الخصوصية وحماية البيانات
   • نحن نلتزم بحماية خصوصيتك وفقاً لنظام حماية البيانات الشخصية
   • نجمع ونستخدم البيانات وفقاً لسياسة الخصوصية المنفصلة
   • لا نشارك معلوماتك مع أطراف ثالثة دون موافقتك
   • يمكنك طلب حذف بياناتك في أي وقت

5. المحتوى والخدمات
   • نحن نقدم المحتوى "كما هو" دون ضمانات
   • قد نحدث أو نغير المحتوى في أي وقت
   • نحن غير مسؤولين عن محتوى المواقع الخارجية المرتبطة
   • يحق لنا رفض تقديم الخدمة لأي مستخدم

6. حقوق الملكية الفكرية
   • جميع المحتويات في هذا الموقع محمية بموجب حقوق الملكية الفكرية
   • يحظر نسخ أو توزيع المحتوى دون إذن مسبق
   • العلامات التجارية والشعارات مملوكة لنا أو لشركائنا
   • أي استخدام غير مصرح به يعتبر انتهاكاً للحقوق

7. المسؤولية القانونية
   • لا نتحمل المسؤولية عن أي أضرار مباشرة أو غير مباشرة
   • نتحمل المسؤولية فقط في حدود القانون المعمول به
   • نحن غير مسؤولين عن أي خسائر تجارية أو بيانات
   • الحد الأقصى للمسؤولية هو قيمة الخدمة المقدمة

8. التعديلات والتحديثات
   • نحتفظ بالحق في تعديل هذه الشروط في أي وقت
   • سيتم إشعار المستخدمين بالتغييرات المهمة
   • الاستمرار في استخدام الموقع يعني الموافقة على التعديلات
   • تاريخ آخر تحديث: [التاريخ]

9. القانون المطبق والاختصاص
   • تخضع هذه الشروط لقوانين المملكة العربية السعودية
   • أي نزاع سيتم حله في المحاكم السعودية المختصة
   • في حالة بطلان أي بند، تبقى باقي البنود سارية المفعول

10. التواصل والاستفسارات
    للاستفسارات أو الشكاوى، يمكنكم التواصل معنا عبر:
    • البريد الإلكتروني: [البريد الإلكتروني]
    • الهاتف: [رقم الهاتف]
    • العنوان: [العنوان]
    • ساعات العمل: [الأوقات]

آخر تحديث: ${new Date().toLocaleDateString('ar-SA')}`;

export default function WebsitePolicyPage() {
    const [policy, setPolicy] = useState<WebsitePolicy>({
        title: 'سياسة الموقع',
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
            const response = await fetch('/api/policies/website');
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
            const response = await fetch('/api/policies/website', {
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
            const response = await fetch(`/api/policies/website/${action}`, {
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
        setPolicy(prev => ({ ...prev, content: DEFAULT_WEBSITE_POLICY_TEMPLATE }));
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
                    <h1 className="text-2xl font-bold">سياسة الموقع</h1>
                    <p className="text-sm text-muted-foreground">إدارة سياسة الموقع</p>
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
                        <Icon name={policy.isPublished ? "EyeOff" : "Globe"} className="h-4 w-4" />
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
                            placeholder="اكتب محتوى سياسة الموقع هنا..."
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
                        <div className="mt-2 text-xs text-muted-foreground space-y-1">
                            <div><strong>نصائح:</strong></div>
                            <div>• استخدم &quot;تحميل قالب&quot; للحصول على قالب احترافي جاهز</div>
                            <div>• قم بتخصيص المعلومات بين الأقواس المربعة [...]</div>
                            <div>• احفظ التغييرات قبل النشر</div>
                            <div className="text-destructive font-semibold mt-2">ملاحظة: لإظهار النقاط الموجزة للعملاء في صفحة الدفع، ابدأ كل نقطة موجزة في السياسة بـ [*] في بداية السطر.</div>
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