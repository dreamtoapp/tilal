// public/sw-notifications-addon.js
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'إشعار جديد',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    tag: data.tag || 'default',
    data: data.url ? { url: data.url } : {},
    actions: [
      { action: 'view', title: 'عرض' },
      { action: 'dismiss', title: 'إغلاق' }
    ],
    requireInteraction: true
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'إشعار', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'view' && event.notification.data?.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
}); 