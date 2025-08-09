'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface AdminNotificationListenerProps {
    showToast?: boolean;
}

export default function AdminNotificationListener({ showToast = true }: AdminNotificationListenerProps) {
    const { data: session } = useSession();

    useEffect(() => {
        if (!session?.user?.id || !['ADMIN', 'MARKETER'].includes(session.user.role)) {
            return;
        }

        let pusher: any = null;
        let channel: any = null;

        const initializePusher = async () => {
            try {
                const { getPusherClient } = await import('@/lib/pusherClient');
                pusher = await getPusherClient();

                // Subscribe to admin-specific channel for dashboard feedback
                channel = pusher.subscribe(`admin-${session.user.id}`);

                // Listen for new orders (dashboard feedback only)
                channel.bind('new-order', (data: any) => {
                    const type = data.type || 'new';

                    if (type === 'cancelled') {
                        // Handle cancelled order
                        if (showToast) {
                            toast.error('❌ تم إلغاء الطلب', {
                                description: `طلب #${data.orderNumber} أُلغي بواسطة السائق ${data.driverName || ''}${data.reson ? ' - السبب: ' + data.reson : ''}`,
                                action: {
                                    label: 'عرض',
                                    onClick: () => window.location.href = '/dashboard/management-orders?status=canceled'
                                },
                                duration: 7000,
                                style: {
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    color: 'white',
                                    border: '1px solid #dc2626',
                                },
                                className: 'border-red-500 bg-red-500 text-white',
                            });
                        }
                        // Refresh admin dashboard data
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    } else {
                        // Handle new order (existing behavior)
                        if (showToast) {
                            toast.success('🆕 طلب جديد', {
                                description: `طلب #${data.orderId} من ${data.customer} - ${data.total?.toFixed(2)} ر.س`,
                                action: {
                                    label: 'عرض',
                                    onClick: () => window.location.href = '/dashboard/management-orders'
                                },
                                duration: 5000,
                                style: {
                                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                    color: 'white',
                                    border: '1px solid #16a34a',
                                },
                                className: 'border-green-500 bg-green-500 text-white',
                            });
                        }
                    }

                    // Optionally refresh dashboard data
                    // window.location.reload();
                });

                // Listen for support alerts
                channel.bind('support-alert', (data: any) => {
                    if (showToast) {
                        toast.warning('طلب دعم', {
                            description: data.message,
                            action: {
                                label: 'عرض',
                                onClick: () => window.location.href = '/dashboard/management/client-submission'
                            },
                            duration: 5000,
                        });
                    }
                });

                // Listen for order cancelled events
                channel.bind('order-cancelled', (data: any) => {
                    if (showToast) {
                        toast.error('تم إلغاء الطلب', {
                            description: `طلب #${data.orderNumber} أُلغي بواسطة السائق ${data.driverName || ''}${data.reson ? ' - السبب: ' + data.reson : ''}`,
                            action: {
                                label: 'عرض',
                                onClick: () => window.location.href = '/dashboard/management-orders?status=canceled'
                            },
                            duration: 7000,
                        });
                    }
                });

                // Connection event handlers
                pusher.connection.bind('connected', () => {
                });

                pusher.connection.bind('disconnected', () => {
                });

                pusher.connection.bind('failed', () => {
                });

            } catch (error) {
                console.error('❌ [DASHBOARD] Failed to initialize Pusher:', error);
            }
        };

        initializePusher();

        return () => {
            if (channel) {
                channel.unbind('new-order');
                channel.unbind('support-alert');
                channel.unbind('order-cancelled');
                pusher?.unsubscribe(`admin-${session.user.id}`);
            }
            if (pusher?.connection) {
                pusher.connection.unbind('connected');
                pusher.connection.unbind('disconnected');
                pusher.connection.unbind('failed');
            }
        };
    }, [session?.user?.id, session?.user?.role, showToast]);

    return null;
} 