'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/icons/Icon';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { assignDriverToOrder } from '../actions/assign-driver';
import { DriverDetails } from '../actions/get-drivers';
import DriverSelectionGrid from './DriverSelectionGrid';
import SimplifiedOrderSummary from './SimplifiedOrderSummary';
import MobileActions from './MobileActions';

interface AssignDriverClientProps {
    order: any;
    drivers: DriverDetails[];
    orderId: string;
}

export default function AssignDriverClient({
    order,
    drivers,
    orderId
}: AssignDriverClientProps) {
    const router = useRouter();
    const [isAssigning, setIsAssigning] = useState<string | null>(null);

    const handleAssignDriver = async (driverId: string) => {
        console.log('🚀 Assign driver button clicked:', { orderId, driverId });
        setIsAssigning(driverId);

        try {
            console.log('📞 Calling assignDriverToOrder function...');
            const result = await assignDriverToOrder({
                orderId,
                driverId,
                estimatedDeliveryTime: 45,
                priority: 'normal'
            });

            console.log('📋 assignDriverToOrder result:', result);

            if (result.success) {
                console.log('✅ Assignment successful, showing success toast');
                toast.success("تم التعيين بنجاح", {
                    description: result.message,
                });

                // Redirect back to orders page
                router.push('/dashboard/management-orders');
            } else {
                console.log('❌ Assignment failed, showing error toast');
                toast.error("فشل في التعيين", {
                    description: result.message,
                });
            }
        } catch (error) {
            console.error('💥 Assignment error:', error);
            toast.error("خطأ في التعيين", {
                description: "حدث خطأ أثناء تعيين السائق",
            });
        } finally {
            setIsAssigning(null);
        }
    };





    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted/30 font-cairo" dir="rtl">

            {/* Compact Header */}
            <div className="bg-card shadow-sm border-b border-border sticky top-0 z-10 backdrop-blur-sm bg-card/95">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-feature-users/10">
                                <Icon name="Truck" className="h-4 w-4 text-feature-users" />
                            </div>
                            <div>
                                <h1 className="text-base font-semibold">تعيين سائق #{order.orderNumber || order.id.slice(0, 8)}</h1>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/management-orders')}>
                            <Icon name="ArrowRight" className="h-3.5 w-3.5 ml-1.5" />
                            عودة
                        </Button>
                    </div>
                </div>
            </div>



            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-4 pb-20 md:pb-4">

                {/* Main Content - Vertical Layout */}
                <div className="flex flex-col gap-4">

                    {/* Section 1 - Order Summary */}
                    <div className="w-full">
                        <SimplifiedOrderSummary order={order} />
                    </div>

                    {/* Section 2 - Driver Selection Grid */}
                    <div className="w-full">
                        <Card className="shadow-lg border-l-4 border-l-feature-users">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-md bg-feature-users/10">
                                            <Icon name="User" className="h-3.5 w-3.5 text-feature-users" />
                                        </div>
                                        <span className="text-sm font-medium">السائقين المتاحين ({drivers.length})</span>
                                    </div>
                                </div>
                                <DriverSelectionGrid
                                    drivers={drivers}
                                    onAssignDriver={handleAssignDriver}
                                    isAssigning={isAssigning}
                                />
                            </CardContent>
                        </Card>
                    </div>


                </div>
            </div>

            {/* Mobile Actions */}
            <MobileActions
                drivers={drivers}
                isAssigning={isAssigning !== null}
                onBack={() => router.push('/dashboard/management-orders')}
            />
        </div>
    );
}