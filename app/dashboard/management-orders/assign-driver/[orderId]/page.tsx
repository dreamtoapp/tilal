import { Metadata } from 'next';

import { Card, CardContent } from '@/components/ui/card';

import { getOrderDetails } from './actions/get-order-details';
import { getAvailableDrivers } from './actions/get-drivers';
import AssignDriverClient from './components/AssignDriverClient';

export async function generateMetadata({
    params
}: {
    params: Promise<{ orderId: string }>
}): Promise<Metadata> {
    const { orderId } = await params;

    try {
        const order = await getOrderDetails(orderId);
        return {
            title: `تعيين سائق - طلب ${order?.orderNumber || orderId}`,
            description: `تعيين سائق للطلب ${order?.orderNumber || orderId} من ${order?.customer?.name || 'عميل'}`,
        };
    } catch {
        return {
            title: 'تعيين سائق',
            description: 'تعيين سائق للطلب',
        };
    }
}

interface AssignDriverPageProps {
    params: Promise<{ orderId: string }>;
}

export default async function AssignDriverPage({
    params
}: AssignDriverPageProps) {
    const { orderId } = await params;

    try {
        // Fetch data in parallel
        const [order, drivers] = await Promise.all([
            getOrderDetails(orderId),
            getAvailableDrivers({ orderId }),
        ]);

        if (!order) {
            return (
                <div className="font-cairo p-4 bg-background min-h-screen" dir="rtl">
                    <div className="max-w-4xl mx-auto space-y-4">
                        <Card className="shadow-lg border-l-4 border-l-status-canceled card-hover-effect">
                            <CardContent className="p-6 text-center">
                                <h2 className="text-xl font-bold text-status-canceled mb-2">طلب غير موجود</h2>
                                <p className="text-status-canceled">لم يتم العثور على الطلب المطلوب</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            );
        }

        return (
            <AssignDriverClient
                order={order}
                drivers={drivers}
                orderId={orderId}
            />
        );
    } catch (error) {
        console.error('Error loading assign driver page:', error);

        return (
            <div className="font-cairo p-4 bg-background min-h-screen" dir="rtl">
                <div className="max-w-4xl mx-auto space-y-4">
                    <Card className="shadow-lg border-l-4 border-l-status-urgent card-hover-effect">
                        <CardContent className="p-6 text-center">
                            <h2 className="text-xl font-bold text-status-urgent mb-2">حدث خطأ</h2>
                            <p className="text-status-urgent/80">
                                حدث خطأ أثناء تحميل بيانات تعيين السائق. يرجى المحاولة مرة أخرى.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
} 