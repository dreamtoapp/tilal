// Enhanced Push Notification Service Worker
self.addEventListener('push', function(event) {
    // Only log in development
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
        console.log('🔔 Push event received:', event);
    }
    
    if (event.data) {
        const data = event.data.json();
        if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
            console.log('📦 Push data received:', data);
        }
        
        // Service Worker notifications need different approach for Windows
        const options = {
            body: data.body || 'You have a new notification',
            icon: '/favicon.ico', // Use favicon for better Windows compatibility
            badge: '/favicon.ico',
            vibrate: [200, 100, 200, 100, 200],
            tag: 'order-notification-' + Date.now(), // Unique tag to force display
            requireInteraction: true, // Force Windows to show notification
            silent: false,
            data: {
                orderId: data.data?.orderId,
                orderNumber: data.data?.orderNumber,
                type: data.data?.type,
                driverName: data.data?.driverName,
                ...data.data
            },
            actions: [
                {
                    action: 'view',
                    title: 'عرض',
                    icon: '/favicon.ico'
                },
                {
                    action: 'close',
                    title: 'إغلاق'
                }
            ]
        };

        // Show notification
        if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
            console.log('📱 Showing notification with options:', options);
        }
        
        // For Windows, we need to ensure the notification is shown properly
        event.waitUntil(
            Promise.all([
                // Show the notification
                self.registration.showNotification(data.title || 'إشعار جديد', options),
                // Also try to focus the window if possible
                clients.matchAll({ type: 'window', includeUncontrolled: true })
                    .then(clientList => {
                        if (clientList.length > 0) {
                            return clientList[0].focus();
                        }
                    })
                    .catch(err => {
                        if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
                            console.log('Could not focus window:', err);
                        }
                    })
            ])
                .then(() => {
                    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
                        console.log('✅ Notification shown successfully');
                    }
                })
                .catch((error) => {
                    console.error('❌ Failed to show notification:', error);
                })
        );
    }
});

// Handle notification click events
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    if (event.action === 'view_order') {
        // Handle view order action
        const orderId = event.notification.data?.orderId;
        if (orderId) {
            event.waitUntil(
                clients.openWindow(`/user/orders/${orderId}`)
            );
        } else {
            // Fallback to orders page
            event.waitUntil(
                clients.openWindow('/user/orders')
            );
        }
    } else if (event.action === 'close') {
        // Just close the notification (already done above)
        return;
    } else {
        // Default click behavior - open main app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Handle notification close events
self.addEventListener('notificationclose', function(event) {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
        console.log('Notification closed:', event.notification.tag);
    }
    
    // You can send analytics here if needed
    const data = event.notification.data;
    if (data?.orderId) {
        // Track notification close for analytics
        if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
            console.log('Order notification closed:', data.orderId);
        }
    }
});

// Service Worker Installation
self.addEventListener('install', function(event) {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
        console.log('Service Worker installing...');
    }
    self.skipWaiting();
});

// Service Worker Activation
self.addEventListener('activate', function(event) {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
        console.log('Service Worker activating...');
    }
    event.waitUntil(
        Promise.all([
            clients.claim(),
            // Clear old caches if needed
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== 'push-notifications-v1') {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

// Handle background sync (for offline scenarios)
self.addEventListener('sync', function(event) {
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Handle background sync tasks
            (() => {
                if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
                    console.log('Background sync triggered');
                }
            })()
        );
    }
});

// Handle push subscription changes
self.addEventListener('pushsubscriptionchange', function(event) {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
        console.log('Push subscription changed');
    }
    event.waitUntil(
        // Re-subscribe to push notifications
        self.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: self.applicationServerKey
        }).then(function(subscription) {
            // Send new subscription to server
            return fetch('/api/push-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subscription)
            });
        }).catch(function(error) {
            console.error('Failed to re-subscribe:', error);
        })
    );
});

// Error handling
self.addEventListener('error', function(event) {
    console.error('Service Worker error:', event.error);
});

// Unhandled promise rejection
self.addEventListener('unhandledrejection', function(event) {
    console.error('Service Worker unhandled rejection:', event.reason);
}); 