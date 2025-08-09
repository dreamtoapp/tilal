import { useState, useEffect } from 'react';

export type GeolocationResult = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

export type GeolocationError = {
  code: number;
  message: string;
};

/**
 * useDriverGeolocation - On-demand geolocation for driver actions.
 * Returns a function to request location, and state for loading/error.
 * Fixes hydration mismatch by only enabling geolocation after client mount.
 */
export function useDriverGeolocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getLocation = (): Promise<GeolocationResult> => {
    if (!isClient) {
      // On server, do nothing (SSR-safe)
      return Promise.reject({ code: 0, message: 'Not available on server' });
    }
    setLoading(true);
    setError(null);
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setLoading(false);
        setError('الموقع غير مدعوم في هذا المتصفح');
        return reject({ code: 0, message: 'Geolocation not supported' });
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLoading(false);
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
        },
        (err) => {
          setLoading(false);
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
          setError(msg);
          reject({ code: err.code, message: msg });
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    });
  };

  return { getLocation, loading: isClient ? loading : false, error: isClient ? error : null };
} 