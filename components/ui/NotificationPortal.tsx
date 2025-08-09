'use client';
import { useNotificationStore } from './notificationStore';

export default function NotificationPortal() {
    const { notifications } = useNotificationStore();
    return (
        <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, maxWidth: 360, maxHeight: 400, overflowY: notifications.length > 3 ? 'auto' : 'visible' }}>
            {notifications.map((n) => (
                <div key={n.id} style={{ marginBottom: 12 }}>
                    {n.content}
                </div>
            ))}
            {notifications.length > 3 && <div style={{ textAlign: 'center', color: '#888' }}>+{notifications.length - 3} more</div>}
        </div>
    );
} 