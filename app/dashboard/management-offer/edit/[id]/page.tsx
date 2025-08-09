import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Edit3 } from 'lucide-react';
import { OfferForm } from '../../components/OfferForm';
import { getOfferById } from '../../actions';

interface EditOfferPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditOfferPage({ params }: EditOfferPageProps) {
    // Await the params Promise
    const { id } = await params;

    // Fetch the offer data
    let offer;
    try {
        offer = await getOfferById(id);
    } catch (error) {
        console.error('Error fetching offer:', error);
        notFound();
    }

    if (!offer) {
        notFound();
    }

    return (
        <div className="flex min-h-screen flex-col">
            {/* Enhanced Header */}
            <header className="sticky top-0 z-10 border-b border-border bg-background p-4 shadow-sm md:p-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Edit3 className="h-6 w-6 text-feature-commerce" />
                        <h1 className="text-2xl font-bold text-foreground">تعديل المجموعة</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6">
                <div className="mx-auto max-w-6xl space-y-8">
                    {/* Offer Details Form */}
                    <Card className="shadow-lg border-l-4 border-l-feature-commerce card-hover-effect">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Package className="h-5 w-5 text-feature-commerce" />
                                تعديل تفاصيل المجموعة: {offer.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                عدّل تفاصيل المجموعة المميزة والمنتجات المرتبطة بها. لتغيير صورة البانر، استخدم بطاقة العرض في الصفحة الرئيسية.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <OfferForm
                                initialData={offer}
                                mode="edit"
                            />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
} 