import { useState, useRef, useEffect, useCallback } from 'react';
import { updateDriverLocation } from '../actions/updateDriverLocation';
// @ts-expect-error: JS module, no types
import { setLatestLocation } from '@/utils/location-latest';

const INTERVAL_SECONDS = 30;

interface UseTripProgressProps {
  orderId: string;
  driverId: string;
  enabled: boolean;
  getLocation: () => Promise<{ latitude: number; longitude: number }>;
}

export default function useTripProgress({ orderId, driverId, enabled, getLocation }: UseTripProgressProps) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const startTripProgress = useCallback(() => {
    // Clear any existing intervals before starting new ones
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setSecondsElapsed(0);
    setProgressPercent(0);
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
        const { latitude, longitude } = await getLocation();
        await updateDriverLocation(orderId, latitude.toString(), longitude.toString());
      } catch (err) {
        // Save latest location to IndexedDB and register Background Sync
        try {
          const { latitude, longitude } = await getLocation();
          await setLatestLocation(orderId, {
            latitude,
            longitude,
            timestamp: Date.now(),
            driverId,
          });
          if ('serviceWorker' in navigator && 'SyncManager' in window) {
            const reg = await navigator.serviceWorker.ready;
            // @ts-expect-error: sync is not typed in TS lib
            if ('sync' in reg && typeof reg.sync.register === 'function') {
              // @ts-expect-error: sync is not typed in TS lib
              await reg.sync.register('sync-location');
            }
          }
        } catch (e) {
          // Optionally log error
        }
      }
      setSecondsElapsed(0);
      setProgressPercent(0);
    }, INTERVAL_SECONDS * 1000);
  }, [orderId, driverId, getLocation]);

  const stopTripProgress = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setSecondsElapsed(0);
    setProgressPercent(0);
  }, []);

  useEffect(() => {
    if (enabled) {
      startTripProgress();
    } else {
      stopTripProgress();
    }
    return () => {
      stopTripProgress();
    };
  }, [enabled, startTripProgress, stopTripProgress]);

  return { progressPercent, secondsElapsed, startTripProgress, stopTripProgress };
} 