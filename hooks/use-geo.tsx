import { useEffect, useRef, useState } from 'react';

/**
 * useGeolocation - Accurate, robust geolocation React hook for browser apps.
 * @param options GeolocationOptions (accuracy, retries, etc.)
 * @returns GeolocationResult (lat, lng, accuracy, status, error, googleMapsLink)
 */
export type GeolocationOptions = Readonly<{
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  accuracyThreshold?: number;
  maxRetries?: number;
}>;

export type GeolocationResult = Readonly<{
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  googleMapsLink: string | null;
  loading: boolean;
  statusMessage: string | null;
  errorMessage: string | null;
}>;

const useGeolocation = (options: GeolocationOptions = {}): GeolocationResult => {
  // SSR safety flag
  const isSSR = typeof window === 'undefined' || typeof navigator === 'undefined';

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string | null>('جارٍ تحديد الموقع...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const retryCountRef = useRef(0);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const bestCoordsRef = useRef<Omit<GeolocationResult, 'loading' | 'statusMessage' | 'errorMessage'>>({
    latitude: null,
    longitude: null,
    accuracy: null,
    googleMapsLink: null,
  });

  const {
    enableHighAccuracy = true,
    timeout = 30000,
    maximumAge = 0,
    accuracyThreshold = 10,
    maxRetries = 3,
  } = options;

  useEffect(() => {
    if (isSSR) return;
    retryCountRef.current = 0;
    setLoading(true);
    setStatusMessage('جارٍ تحديد الموقع...');
    setErrorMessage(null);

    const clearTimer = () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };

    const updateBestCoords = (lat: number, lng: number, acc: number) => {
      const isBetter = bestCoordsRef.current.accuracy == null || acc < bestCoordsRef.current.accuracy!;
      if (isBetter) {
        bestCoordsRef.current = {
          latitude: lat,
          longitude: lng,
          accuracy: acc,
          googleMapsLink: `https://www.google.com/maps?q=${lat},${lng}`,
        };
        setLatitude(lat);
        setLongitude(lng);
        setAccuracy(acc);
        setStatusMessage(`📍 تم تحديد الموقع بدقة ${acc.toFixed(1)} متر`);
      }

      if (acc <= accuracyThreshold) {
        setLoading(false);
        clearTimer();
      } else if (retryCountRef.current < maxRetries) {
        retryCountRef.current += 1;
        setStatusMessage(`الدقة الحالية ${acc.toFixed(1)} متر، إعادة المحاولة...`);
        timeoutIdRef.current = setTimeout(tryGetLocation, 5000);
      } else {
        setStatusMessage(`أفضل دقة تم الوصول إليها: ${acc.toFixed(1)} متر`);
        setLoading(false);
        clearTimer();
      }
    };

    const tryGetLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng, accuracy: acc } = pos.coords;
          updateBestCoords(lat, lng, acc);
        },
        (err) => {
          let msg = 'فشل تحديد الموقع';
          switch (err.code) {
            case err.PERMISSION_DENIED:
              msg = 'يجب السماح بالوصول إلى الموقع';
              break;
            case err.POSITION_UNAVAILABLE:
              msg = 'معلومات الموقع غير متوفرة';
              break;
            case err.TIMEOUT:
              msg = 'انتهت المهلة، تأكد من تفعيل GPS';
              break;
          }
          setErrorMessage(msg);
          setStatusMessage(null);
          setLoading(false);
          clearTimer();
        },
        {
          enableHighAccuracy,
          timeout,
          maximumAge,
        }
      );
    };

    tryGetLocation();
    return () => clearTimer();
  }, [isSSR, enableHighAccuracy, timeout, maximumAge, accuracyThreshold, maxRetries]);

  if (isSSR) {
    return {
      latitude: null,
      longitude: null,
      accuracy: null,
      googleMapsLink: null,
      loading: false,
      statusMessage: 'الموقع غير متاح في هذا السياق',
      errorMessage: null,
    };
  }

  return {
    latitude,
    longitude,
    accuracy,
    googleMapsLink:
      typeof latitude === 'number' && typeof longitude === 'number'
        ? `https://www.google.com/maps?q=${latitude},${longitude}`
        : null,
    loading,
    statusMessage,
    errorMessage,
  };
};

export default useGeolocation;
// For backward compatibility
export { useGeolocation };
