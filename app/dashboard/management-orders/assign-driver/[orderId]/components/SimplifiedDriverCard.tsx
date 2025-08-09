'use client';

import { Icon } from '@/components/icons/Icon';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DriverDetails } from '../actions/get-drivers';

interface SimplifiedDriverCardProps {
    driver: DriverDetails;
    onAssign: () => void;
    isAssigning: boolean;
}

export default function SimplifiedDriverCard({
    driver,
    onAssign,
    isAssigning
}: SimplifiedDriverCardProps) {
    const getStatusDisplay = (driver: DriverDetails) => {
        const isOnDelivery = driver.currentOrders > 0;

        if (isOnDelivery) {
            return {
                text: 'غير متاح (في مهمة توصيل)',
                color: 'bg-status-canceled/10 text-status-canceled border-status-canceled/20',
                icon: '🚚'
            };
        } else {
            return {
                text: 'متاح',
                color: 'bg-status-delivered/10 text-status-delivered border-status-delivered/20',
                icon: '✅'
            };
        }
    };

    const getRatingDisplay = (rating: number) => {
        if (rating === 0) {
            return { text: 'لا يوجد تقييم', color: 'text-muted-foreground' };
        }
        return { text: `${rating.toFixed(1)} ⭐`, color: 'text-feature-analytics' };
    };

    const statusDisplay = getStatusDisplay(driver);
    const ratingDisplay = getRatingDisplay(driver.rating);

    return (
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-feature-users">
            <CardContent className="p-4">
                {/* Driver Info Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={driver.profileImage} />
                            <AvatarFallback className="bg-feature-users/10 text-feature-users">
                                {driver.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-foreground">{driver.name}</h3>
                            <p className="text-sm text-muted-foreground">{driver.phone}</p>
                        </div>
                    </div>
                    <Badge className={`px-2 py-1 text-xs ${statusDisplay.color}`}>
                        {statusDisplay.icon} {statusDisplay.text}
                    </Badge>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                    <div className="text-center">
                        <p className="font-bold text-feature-commerce">
                            {driver.distanceFromStore?.toFixed(1) || '0'} كم
                        </p>
                        <p className="text-xs text-muted-foreground">المسافة</p>
                    </div>
                    <div className="text-center">
                        <p className={`font-bold ${ratingDisplay.color}`}>
                            {ratingDisplay.text}
                        </p>
                        <p className="text-xs text-muted-foreground">التقييم</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-feature-products">
                            {driver.completionRate}%
                        </p>
                        <p className="text-xs text-muted-foreground">الإنجاز</p>
                    </div>
                </div>

                {/* Vehicle Info */}
                <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                    <Icon name="Truck" className="h-3 w-3" />
                    <span>{driver.vehicle.type}</span>
                    {driver.vehicle.plateNumber && (
                        <>
                            <span>•</span>
                            <span>{driver.vehicle.plateNumber}</span>
                        </>
                    )}
                </div>

                {/* Assignment Button */}
                <Button
                    onClick={onAssign}
                    disabled={isAssigning || driver.currentOrders > 0}
                    className="w-full h-10"
                    variant={driver.currentOrders > 0 ? "outline" : "default"}
                >
                    {isAssigning ? (
                        <>
                            <Icon name="Loader2" className="h-4 w-4 animate-spin ml-2" />
                            جاري التعيين...
                        </>
                    ) : driver.currentOrders > 0 ? (
                        <>
                            <Icon name="X" className="h-4 w-4 ml-2" />
                            مشغول
                        </>
                    ) : (
                        <>
                            <Icon name="Truck" className="h-4 w-4 ml-2" />
                            تعيين السائق
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
} 