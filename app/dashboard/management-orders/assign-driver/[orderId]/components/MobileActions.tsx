'use client';

import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import { DriverDetails } from '../actions/get-drivers';

interface MobileActionsProps {
    drivers: DriverDetails[];
    isAssigning: boolean;
    onBack: () => void;
}

export default function MobileActions({
    drivers,
    onBack
}: MobileActionsProps) {
    const availableDrivers = drivers.filter(d => d.status === 'available');

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3 z-50">
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    className="flex-1 h-12 text-base"
                    onClick={onBack}
                >
                    <Icon name="ArrowRight" className="h-5 w-5 ml-2" />
                    عودة
                </Button>
                <Button
                    className="flex-1 h-12 text-base bg-feature-commerce hover:bg-feature-commerce/90"
                    disabled={true}
                >
                    <Icon name="Truck" className="h-5 w-5 ml-2" />
                    تعيين الأقرب
                </Button>
            </div>

            {/* Available Drivers Count */}
            <div className="text-center mt-2">
                <span className="text-xs text-muted-foreground">
                    السائقون المتاحون: {availableDrivers.length}
                </span>
            </div>
        </div>
    );
} 