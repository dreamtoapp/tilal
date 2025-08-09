"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface Notification {
    id: string;
    title: string;
    body: string;
    type: 'ORDER' | 'PROMO' | 'SYSTEM';
    read: boolean;
    createdAt: string;
    actionUrl?: string;
    metadata?: any;
}

interface RealtimeNotificationListenerProps {
    onNewNotification?: (notification: Notification) => void;
    showToast?: boolean;
}

export default function RealtimeNotificationListener({
    onNewNotification,
    showToast = true
}: RealtimeNotificationListenerProps) {
    const { data: session } = useSession();

    useEffect(() => {
        if (!session?.user?.id) return;

        let pusher: any = null;
        let channel: any = null;

        const initializePusher = async () => {
            try {
                // Dynamically import Pusher client
                const { getPusherClient } = await import('@/lib/pusherClient');
                pusher = await getPusherClient();

                // Subscribe to user's private channel
                const channelName = `user-${session.user.id}`;
                channel = pusher.subscribe(channelName);

                // Listen for new notifications
                channel.bind('new-notification', (notification: Notification) => {
                    console.log('🔔 Real-time notification received:', notification);

                    // Show toast notification
                    if (showToast) {
                        toast.success(notification.title, {
                            description: notification.body,
                            action: notification.actionUrl ? {
                                label: 'عرض',
                                onClick: () => window.location.href = notification.actionUrl!
                            } : undefined,
                            duration: 6000,
                        });
                    }

                    // Call parent callback
                    if (onNewNotification) {
                        onNewNotification(notification);
                    }

                    // Play notification sound (optional)
                    playNotificationSound();
                });

                // Connection event handlers
                pusher.connection.bind('connected', () => {
                    console.log('✅ Pusher connected');
                });

                pusher.connection.bind('disconnected', () => {
                    console.log('❌ Pusher disconnected');
                });

                pusher.connection.bind('failed', () => {
                    console.log('❌ Pusher connection failed');
                });

            } catch (error) {
                console.error('❌ Failed to initialize Pusher:', error);
            }
        };

        // Initialize Pusher connection
        initializePusher();

        // Cleanup on unmount
        return () => {
            if (channel) {
                channel.unbind('new-notification');
                pusher?.unsubscribe(`user-${session.user.id}`);
            }
            if (pusher?.connection) {
                pusher.connection.unbind('connected');
                pusher.connection.unbind('disconnected');
                pusher.connection.unbind('failed');
            }
        };
    }, [session?.user?.id, onNewNotification, showToast]);

    // Play notification sound
    const playNotificationSound = () => {
        try {
            const audio = new Audio('/sounds/notification.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => {
                // Ignore sound play errors (user interaction required)
            });
        } catch (error) {
            // Ignore sound errors
        }
    };

    return null; // This component doesn't render anything
}

// Export hook for Pusher connection status (used in other components)
export function usePusherConnectionStatus() {
    const { data: session } = useSession();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!session?.user?.id) {
            setIsConnected(false);
            return;
        }

        let pusher: any = null;

        const initializePusher = async () => {
            try {
                const { getPusherClient } = await import('@/lib/pusherClient');
                pusher = await getPusherClient();

                // Connection event handlers
                pusher.connection.bind('connected', () => {
                    setIsConnected(true);
                });

                pusher.connection.bind('disconnected', () => {
                    setIsConnected(false);
                });

                pusher.connection.bind('failed', () => {
                    setIsConnected(false);
                });

                // Set initial state
                setIsConnected(pusher.connection.state === 'connected');

            } catch (error) {
                console.error('Failed to initialize Pusher for connection status:', error);
                setIsConnected(false);
            }
        };

        initializePusher();

        return () => {
            if (pusher?.connection) {
                pusher.connection.unbind('connected');
                pusher.connection.unbind('disconnected');
                pusher.connection.unbind('failed');
            }
        };
    }, [session?.user?.id]);

    return isConnected;
} 