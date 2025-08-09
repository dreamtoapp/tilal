import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Icon } from '@/components/icons/Icon';

export default function PushNotificationSetup() {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
        // Check if already subscribed
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready
                .then(registration => registration.pushManager.getSubscription())
                .then(subscription => {
                    setSubscribed(!!subscription);
                });
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
            toast.error('المتصفح لا يدعم الإشعارات', {
                icon: <Icon name="AlertCircle" variant="destructive" size="md" />,
            });
            return;
        }

        setLoading(true);
        try {
            // Request notification permission
            const permission = await Notification.requestPermission();
            setPermission(permission);

            if (permission !== 'granted') {
                toast.error('تم رفض إذن الإشعارات', {
                    icon: <Icon name="AlertCircle" variant="destructive" size="md" />,
                });
                setLoading(false);
                return;
            }

            // Register the push notification service worker
            const registration = await navigator.serviceWorker.register('/push-sw.js');
            console.log('Service Worker registered:', registration);

            // Wait for the service worker to be ready
            await navigator.serviceWorker.ready;
            console.log('Service Worker ready');

            // Subscribe to push notifications
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
            });
            console.log('Push subscription:', subscription);

            // Send subscription to server
            const response = await fetch('/api/push-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subscription)
            });

            if (!response.ok) {
                throw new Error('Failed to save subscription');
            }

            setSubscribed(true);
            toast.success('تم تفعيل الإشعارات بنجاح!', {
                icon: <Icon name="CheckCircle2" variant="success" size="md" />,
            });
        } catch (error) {
            console.error('Error setting up push notifications:', error);
            toast.error('خطأ في تفعيل الإشعارات: ' + (error instanceof Error ? error.message : 'Unknown error'), {
                icon: <Icon name="AlertCircle" variant="destructive" size="md" />,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {permission === 'granted' && subscribed ? (
                <span className="text-green-600 text-sm">الإشعارات مفعلة</span>
            ) : (
                <Button
                    onClick={requestPermission}
                    disabled={loading}
                    size="sm"
                    variant="outline"
                >
                    {loading ? 'جاري...' : 'تفعيل الإشعارات'}
                </Button>
            )}
        </div>
    );
} 