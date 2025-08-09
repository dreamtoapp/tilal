import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';
import db from '@/lib/prisma';

export async function generateMetadata(): Promise<Metadata> {
    const policy = await db.term.findFirst({
        where: {
            type: 'WEBSITE_POLICY',
            isActive: true,
            isPublished: true
        },
        orderBy: {
            version: 'desc'
        }
    });

    if (!policy) {
        return {
            title: 'سياسة الموقع - أمواج للمياه الصحية',
            description: 'شروط وأحكام استخدام موقع أمواج للمياه الصحية',
        };
    }

    return {
        title: `${policy.title} - أمواج للمياه الصحية`,
        description: policy.content.substring(0, 160) + '...',
        keywords: 'شروط وأحكام, سياسة الموقع, أمواج للمياه الصحية',
    };
}

export default async function WebsitePolicyPage() {
    const policy = await db.term.findFirst({
        where: {
            type: 'WEBSITE_POLICY',
            isActive: true,
            isPublished: true
        },
        orderBy: {
            version: 'desc'
        }
    });

    if (!policy) {
        notFound();
    }

    return (
        <div className="space-y-6">
            {/* Policy Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Icon name="Globe" className="h-8 w-8 text-primary" />
                            <div>
                                <CardTitle className="text-2xl">{policy.title}</CardTitle>
                                <p className="text-muted-foreground mt-1">
                                    شروط وأحكام استخدام موقع أمواج للمياه الصحية
                                </p>
                            </div>
                        </div>
                        <Badge variant="outline" className="text-sm">
                            الإصدار {policy.version}
                        </Badge>
                    </div>
                </CardHeader>
            </Card>

            {/* Policy Content */}
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

            {/* Policy Footer */}
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center text-sm text-muted-foreground space-y-2">
                        <p>
                            <strong>آخر تحديث:</strong> {new Date(policy.updatedAt).toLocaleDateString('ar-SA')}
                        </p>
                        <p>
                            للاستفسارات حول هذه السياسة، يرجى التواصل معنا عبر:
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