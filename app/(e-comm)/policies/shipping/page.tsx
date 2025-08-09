import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import Link from '@/components/link';
import db from '@/lib/prisma';

export async function generateMetadata(): Promise<Metadata> {
    const policy = await db.term.findFirst({
        where: {
            type: 'SHIPPING_POLICY',
            isActive: true,
            isPublished: true
        },
        orderBy: {
            version: 'desc'
        }
    });

    if (!policy) {
        return {
            title: 'سياسة الشحن - أمواج للمياه الصحية',
            description: 'سياسة التوصيل والشحن للمنتجات',
        };
    }

    return {
        title: `${policy.title} - أمواج للمياه الصحية`,
        description: policy.content.substring(0, 160) + '...',
        keywords: 'سياسة الشحن, التوصيل, أمواج للمياه الصحية',
    };
}

export default async function ShippingPolicyPage() {
    const policy = await db.term.findFirst({
        where: {
            type: 'SHIPPING_POLICY',
            isActive: true,
            isPublished: true
        },
        orderBy: {
            version: 'desc'
        }
    });

    if (!policy) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Icon name="Truck" className="h-8 w-8 text-primary" />
                            <div>
                                <CardTitle className="text-2xl">سياسة الشحن</CardTitle>
                                <p className="text-muted-foreground mt-1">
                                    سياسة التوصيل والشحن للمنتجات
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8 space-y-4">
                            <Icon name="FileText" className="h-16 w-16 text-muted-foreground mx-auto" />
                            <h3 className="text-lg font-semibold">سياسة الشحن غير متوفرة حالياً</h3>
                            <p className="text-muted-foreground">
                                لم يتم نشر سياسة الشحن بعد. يرجى المحاولة لاحقاً أو التواصل معنا للاستفسار.
                            </p>
                            <div className="flex items-center justify-center gap-4 mt-4">
                                <Button asChild variant="outline">
                                    <Link href="/">
                                        العودة للصفحة الرئيسية
                                    </Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/contact">
                                        التواصل معنا
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Icon name="Truck" className="h-8 w-8 text-primary" />
                            <div>
                                <CardTitle className="text-2xl">{policy.title}</CardTitle>
                                <p className="text-muted-foreground mt-1">
                                    سياسة التوصيل والشحن للمنتجات
                                </p>
                            </div>
                        </div>
                        <Badge variant="outline" className="text-sm">
                            الإصدار {policy.version}
                        </Badge>
                    </div>
                </CardHeader>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div
                        className="prose prose-lg max-w-none text-right leading-relaxed"
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

            <Card>
                <CardContent className="pt-6">
                    <div className="text-center text-sm text-muted-foreground space-y-2">
                        <p>
                            <strong>آخر تحديث:</strong> {new Date(policy.updatedAt).toLocaleDateString('ar-SA')}
                        </p>
                        <p>
                            للاستفسارات حول سياسة الشحن، يرجى التواصل معنا عبر:
                        </p>
                        <div className="flex items-center justify-center gap-4 mt-2">
                            <span>📧 info@amwag.com</span>
                            <span>📞 0500861005</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 