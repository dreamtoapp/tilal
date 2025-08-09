import React, { useState, useRef, useEffect } from 'react';
import { useDriverGeolocation } from '../hooks/useDriverGeolocation';
import { updateDriverLocation } from '../actions/updateDriverLocation';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Order } from '@/types/databaseTypes';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface ResumeTripButtonProps {
    order: Order;
    driverId: string;
    disabled?: boolean;
}

const INTERVAL_SECONDS = 600; // 10 minutes

const ResumeTripButton: React.FC<ResumeTripButtonProps> = ({ order, driverId, disabled }) => {
    const { getLocation, loading } = useDriverGeolocation();
    const [tripLoading, setTripLoading] = useState(false);
    const [tripError, setTripError] = useState<string | null>(null);
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [progressPercent, setProgressPercent] = useState(0);
    const [backendUpdating, setBackendUpdating] = useState(false);
    const progressRef = useRef<NodeJS.Timeout | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [tripResumed, setTripResumed] = useState(false);

    useEffect(() => {
        if (tripResumed) {
            // Progress bar: update every second
            progressRef.current = setInterval(() => {
                setSecondsElapsed((prev) => {
                    const next = prev < INTERVAL_SECONDS ? prev + 1 : prev;
                    setProgressPercent(Math.min((next / INTERVAL_SECONDS) * 100, 100));
                    return next;
                });
            }, 1000);
            // Location update: every INTERVAL_SECONDS
            intervalRef.current = setInterval(async () => {
                try {
                    setBackendUpdating(true);
                    const { latitude, longitude } = await getLocation();
                    await updateDriverLocation(order.id, latitude.toString(), longitude.toString());
                } catch (err) {
                    // Optionally handle error
                }
                setBackendUpdating(false);
                setSecondsElapsed(0);
                setProgressPercent(0);
            }, INTERVAL_SECONDS * 1000);
            return () => {
                if (progressRef.current) clearInterval(progressRef.current);
                if (intervalRef.current) clearInterval(intervalRef.current);
            };
        } else {
            if (progressRef.current) clearInterval(progressRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
            setSecondsElapsed(0);
            setProgressPercent(0);
        }
    }, [tripResumed, getLocation, order.id, driverId]);

    const handleResume = async () => {
        setTripError(null);
        setTripLoading(true);
        try {
            // No need to call startTrip, just start the timer and location updates
            setTripResumed(true);
        } catch (err: any) {
            setTripError(err.message || 'تعذر تحديد الموقع');
        }
        setTripLoading(false);
    };

    return (
        <div className='w-full'>
            <div className='mb-4 flex items-center gap-2' style={{ opacity: tripResumed ? 1 : 0.3 }}>
                <div className='w-full px-4'>
                    <Progress value={progressPercent} className='w-full h-3' />
                    <div className='text-xs text-center mt-1 text-muted-foreground flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            {secondsElapsed} / {INTERVAL_SECONDS} ثانية حتى التحديث التالي
                            <span className='ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800'>استئناف</span>
                        </div>
                        <div className='flex items-center justify-center'>{(tripLoading || backendUpdating) && <Loader2 className='animate-spin h-5 w-5 text-primary-foreground/50' />}</div>
                    </div>
                </div>
            </div>
            {tripError && (
                <Alert variant='destructive' className='mb-2 w-full max-w-md'>
                    <AlertTitle>خطأ</AlertTitle>
                    <AlertDescription>{tripError}</AlertDescription>
                </Alert>
            )}
            {!tripResumed && (
                <Button
                    variant='default'
                    className='w-full h-16'
                    onClick={handleResume}
                    disabled={loading || tripLoading || disabled}
                >
                    {tripLoading ? 'جاري استئناف الرحلة...' : 'استأنف الرحلة'}
                </Button>
            )}
        </div>
    );
};

export default ResumeTripButton; 