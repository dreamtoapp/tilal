'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
    useEffect(() => {
        const registerServiceWorker = async () => {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                try {
                    const registration = await navigator.serviceWorker.register('/push-sw.js');
                    if (registration.active) {
                        // Check for existing subscription
                        let subscription = await registration.pushManager.getSubscription();
                        if (!subscription && Notification.permission === 'default') {
                            await Notification.requestPermission();
                        }
                        if (!subscription && Notification.permission === 'granted') {
                            subscription = await registration.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                            });
                        }
                        if (subscription) {
                            await fetch('/api/push-subscription', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(subscription)
                            });
                        }
                    }
                } catch (error) {
                    // Only log high-level errors
                    console.error('Service Worker registration or push subscription failed:', error);
                }
            }
        };
        registerServiceWorker();
    }, []);
    return null;
} 