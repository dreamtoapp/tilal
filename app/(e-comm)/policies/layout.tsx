import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import Link from '@/components/link';

export const metadata: Metadata = {
    title: 'الشروط والأحكام - أمواج للمياه الصحية',
    description: 'شروط وأحكام استخدام موقع أمواج للمياه الصحية',
    keywords: 'شروط وأحكام, سياسة الخصوصية, سياسة الإرجاع, سياسة الشحن',
};

export default function PolicyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Icon name="FileText" className="h-6 w-6 text-primary" />
                            <h1 className="text-xl font-bold">الشروط والأحكام</h1>
                        </div>
                        <Link href="/">
                            <Button variant="outline" size="sm">
                                <Icon name="Home" className="h-4 w-4 mr-2" />
                                العودة للرئيسية
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t bg-card mt-12">
                <div className="container mx-auto px-4 py-6">
                    <div className="text-center text-sm text-muted-foreground">
                        <p>© 2024 أمواج للمياه الصحية. جميع الحقوق محفوظة.</p>
                        <div className="flex items-center justify-center gap-4 mt-2">
                            <Link href="/policies/website" className="hover:text-primary">
                                سياسة الموقع
                            </Link>
                            <Link href="/policies/privacy" className="hover:text-primary">
                                سياسة الخصوصية
                            </Link>
                            <Link href="/policies/return" className="hover:text-primary">
                                سياسة الإرجاع
                            </Link>
                            <Link href="/policies/shipping" className="hover:text-primary">
                                سياسة الشحن
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
} 