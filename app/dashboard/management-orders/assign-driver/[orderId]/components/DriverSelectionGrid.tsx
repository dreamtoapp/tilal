'use client';

import { useMemo } from 'react';
import { Icon } from '@/components/icons/Icon';

import { Card, CardContent } from '@/components/ui/card';

import { DriverDetails } from '../actions/get-drivers';
import SimplifiedDriverCard from './SimplifiedDriverCard';

interface DriverSelectionGridProps {
    drivers: DriverDetails[];
    onAssignDriver: (driverId: string) => void;
    isAssigning: string | null;
}

export default function DriverSelectionGrid({
    drivers,
    onAssignDriver,
    isAssigning
}: DriverSelectionGridProps) {
    // Sort drivers by distance (default)
    const sortedDrivers = useMemo(() => {
        return drivers.sort((a, b) => {
            return (a.distanceFromStore || Infinity) - (b.distanceFromStore || Infinity);
        });
    }, [drivers]);

    const handleAssignDriver = (driverId: string) => {
        onAssignDriver(driverId);
    };

    return (
        <div className="space-y-6">

            {/* No Results */}
            {sortedDrivers.length === 0 ? (
                <Card className="shadow-lg border-l-4 border-l-status-pending card-hover-effect">
                    <CardContent className="p-8 text-center">
                        <div className="space-y-4">
                            <div className="p-4 rounded-full bg-status-pending/10 w-fit mx-auto">
                                <Icon name="AlertTriangle" className="h-8 w-8 text-status-pending" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">لا يوجد سائقون متاحون</h3>
                                <p className="text-muted-foreground">
                                    لا يوجد سائقون متاحون حالياً لهذا الطلب.
                                </p>
                            </div>

                        </div>
                    </CardContent>
                </Card>
            ) : (
                // Driver Grid
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sortedDrivers.map((driver) => (
                        <SimplifiedDriverCard
                            key={driver.id}
                            driver={driver}
                            onAssign={() => handleAssignDriver(driver.id)}
                            isAssigning={isAssigning === driver.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
} 