"use client"
import React, { useState } from 'react';
import { useDriverGeolocation } from '../hooks/useDriverGeolocation';
import { startTrip } from '../actions/startTrip';
import { updateDriverLocation } from '../actions/updateDriverLocation';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Order } from '@/types/databaseTypes';
import { Progress } from '@/components/ui/progress';
// @ts-expect-error: JS module, no types
import { setLatestLocation } from '@/utils/location-latest';
import useTripProgress from '../hooks/useTripProgress';

interface StartTripButtonProps {
    order: Order;
    driverId: string;
    onTripStarted?: () => void;
    disabled?: boolean;
    mode?: 'start' | 'resume';
    tripStarted: boolean;
    setTripStarted: (started: boolean) => void;
}

// Change interval for testing: 30 seconds
const INTERVAL_SECONDS = 30;

const StartTripButton: React.FC<StartTripButtonProps> = ({ order, driverId, onTripStarted, disabled, mode = 'start', tripStarted, setTripStarted }) => {
    const { getLocation, loading } = useDriverGeolocation();
    const [tripLoading, setTripLoading] = useState(false);
    const [tripError, setTripError] = useState<string | null>(null);
    // Use the custom hook for timer/progress/location updates
    const { progressPercent, secondsElapsed, startTripProgress, stopTripProgress } = useTripProgress({
        orderId: order.id,
        driverId,
        enabled: tripStarted,
        getLocation,
    });

    const handleTrip = async () => {
        setTripError(null);
        setTripLoading(true);
        try {
            if (mode === 'start') {
                const { latitude, longitude } = await getLocation();
                const res = await startTrip(order.id, driverId, latitude.toString(), longitude.toString());
                if (!res.success) {
                    setTripError(res.error);
                    setTripLoading(false);
                    return;
                }
            }
            setTripStarted(true);
            setTripError(null);
            if (onTripStarted) onTripStarted();
            startTripProgress();
        } catch (err: any) {
            setTripError(err.message || 'تعذر تحديد الموقع');
        }
        setTripLoading(false);
    };

    return (
        <div className='w-full'>
            {/* Progress bar is always mounted, only visually active if tripStarted */}
            <div className='mb-4' style={{ opacity: tripStarted ? 1 : 0.3 }}>
                <div className='w-full px-4'>
                    <Progress value={progressPercent} className='w-full h-3' />
                    <div className='text-xs text-center mt-1 text-muted-foreground'>
                        {secondsElapsed} / 30 ثانية حتى التحديث التالي
                    </div>
                </div>
            </div>
            {tripError && (
                <Alert variant='destructive' className='mb-2 w-full max-w-md'>
                    <AlertTitle>خطأ</AlertTitle>
                    <AlertDescription>{tripError}</AlertDescription>
                </Alert>
            )}
            {!tripStarted && (
                <Button
                    variant='default'
                    className='w-full h-16'
                    onClick={handleTrip}
                    disabled={loading || tripLoading || disabled}
                >
                    {tripLoading
                        ? (mode === 'start' ? 'جاري بدء الرحلة...' : 'جاري استئناف الرحلة...')
                        : (mode === 'start' ? 'ابدأ رحلتك' : 'استأنف الرحلة')}
                </Button>
            )}
        </div>
    );
};

export default StartTripButton; 