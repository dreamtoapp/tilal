import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Plus } from 'lucide-react';
import { OfferForm } from '../components/OfferForm';

export default function NewOfferPage() {
    return (
        <div className="flex min-h-screen flex-col">
            {/* Enhanced Header */}
            <header className="sticky top-0 z-10 border-b border-border bg-background p-4 shadow-sm md:p-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Plus className="h-6 w-6 text-feature-commerce" />
                        <h1 className="text-2xl font-bold text-foreground">إضافة مجموعة جديدة</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6">
                <div className="mx-auto max-w-2xl">
                    <Card className="shadow-lg border-l-4 border-l-feature-commerce card-hover-effect">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Package className="h-5 w-5 text-feature-commerce" />
                                تفاصيل المجموعة الجديدة
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                أضف تفاصيل المجموعة المميزة التي ستظهر للعملاء في الموقع
                            </p>
                        </CardHeader>
                        <CardContent>
                            <OfferForm />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
} 