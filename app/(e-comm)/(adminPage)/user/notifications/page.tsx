'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle, Bell, BellOff, Filter, ShoppingCart, Settings, Gift, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserNotifications } from './actions/getUserNotifications';
import { markAllAsRead, toggleNotificationRead } from './actions/markAsRead';
import { getSystemNotificationIcon, getSystemNotificationStyle } from '@/helpers/notificationIconHelper';

type NotificationType = 'ORDER' | 'PROMO' | 'SYSTEM';

interface Notification {
    id: string;
    title: string;
    body: string;
    type: NotificationType;
    read: boolean;
    createdAt: string;
    actionUrl?: string;
    isNew?: boolean;
}

// Notification type configuration
const notificationConfig = {
    ORDER: {
        label: 'الطلبات',
        icon: ShoppingCart,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        glowColor: 'border-blue-500'
    },
    PROMO: {
        label: 'العروض',
        icon: Gift,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        glowColor: 'border-purple-500'
    },
    SYSTEM: {
        label: 'النظام',
        icon: Settings,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        glowColor: 'border-gray-500'
    }
};

export default function NotificationsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<NotificationType | 'all'>('all');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                setError(null);
                if (session?.user?.id) {
                    const data = await getUserNotifications(session.user.id);
                    setNotifications(data.map((n: any) => ({
                        ...n,
                        isNew: new Date().getTime() - new Date(n.createdAt).getTime() < 3600000 // 1 hour
                    })));
                }
            } catch (error) {
                console.error('Failed to fetch notifications', error);
                setError('فشل في تحميل الإشعارات. يرجى المحاولة لاحقًا.');
            } finally {
                setLoading(false);
            }
        };

        if (session?.user?.id) {
            fetchNotifications();
        }
    }, [session]);

    // 🔄 Toggle notification read/unread status
    const handleToggleRead = async (id: string) => {
        try {
            const result = await toggleNotificationRead(id);
            if (result.success && result.notification) {
                setNotifications(prev => prev.map(n =>
                    n.id === id ? { ...n, read: result.notification!.read, isNew: false } : n
                ));

                // Trigger counter update in header
                localStorage.setItem('notification-update', Date.now().toString());
            }
        } catch (error) {
            console.error('Failed to toggle notification read status', error);
        }
    };

    const handleMarkAllAsReadAction = async () => {
        try {
            if (session?.user?.id) {
                await markAllAsRead(session.user.id);
                setNotifications(prev => prev.map(n => ({ ...n, read: true, isNew: false })));

                // Trigger counter update in header
                localStorage.setItem('notification-update', Date.now().toString());
            }
        } catch (error) {
            console.error('Failed to mark all notifications as read', error);
        }
    };

    const handleActionClick = (url: string) => {
        router.push(url);
    };

    const filteredNotifications = activeFilter === 'all'
        ? notifications
        : notifications.filter(n => n.type === activeFilter);

    const unreadCount = notifications.filter(n => !n.read).length;
    const notificationTypes: NotificationType[] = ['ORDER', 'PROMO', 'SYSTEM'];

    if (status === 'loading' || loading) {
        return (
            <div className="max-w-2xl mx-auto p-4 space-y-4">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-8 w-32" />
                </div>
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-20" />
                    ))}
                </div>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2 p-4 border rounded-lg">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!session?.user) {
        return <div className="text-center py-10">يجب تسجيل الدخول لعرض الإشعارات</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Bell className="h-6 w-6 text-feature-analytics" />
                    الإشعارات
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2">
                            {unreadCount} غير مقروء
                        </Badge>
                    )}
                </h1>
                {notifications.length > 0 && unreadCount > 0 && (
                    <Button
                        onClick={handleMarkAllAsReadAction}
                        variant="ghost"
                        className="text-feature-analytics hover:bg-feature-analytics/10"
                    >
                        <BellOff className="h-4 w-4 mr-2" />
                        تمييز الكل كمقروء
                    </Button>
                )}
            </div>

            {/* Filter controls */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <Button
                    variant={activeFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setActiveFilter('all')}
                    className="flex items-center gap-2 min-w-[80px]"
                >
                    <Filter className="h-4 w-4" />
                    الكل ({notifications.length})
                </Button>
                {notificationTypes.map(type => {
                    const config = notificationConfig[type] || {
                        label: 'عام',
                        icon: Bell,
                        color: 'text-gray-600',
                        bgColor: 'bg-gray-50'
                    };
                    const typeCount = notifications.filter(n => n.type === type).length;
                    const IconComponent = config.icon;

                    return (
                        <Button
                            key={type}
                            variant={activeFilter === type ? 'default' : 'outline'}
                            onClick={() => setActiveFilter(type)}
                            className={`flex items-center gap-2 min-w-[100px] ${activeFilter === type ? '' : `hover:${config.bgColor}`
                                }`}
                        >
                            <IconComponent className={`h-4 w-4 ${config.color}`} />
                            {config.label} ({typeCount})
                        </Button>
                    );
                })}
            </div>

            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                        <BellOff className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground text-lg">
                            {activeFilter === 'all'
                                ? 'لا توجد إشعارات حالياً'
                                : `لا توجد إشعارات ${notificationConfig[activeFilter as NotificationType]?.label || 'عامة'}`
                            }
                        </p>
                        <p className="text-sm text-muted-foreground max-w-md">
                            {activeFilter === 'ORDER' && 'ستظهر هنا تحديثات طلباتك من تأكيد الطلب حتى التوصيل'}
                            {activeFilter === 'PROMO' && 'ستظهر هنا العروض الخاصة والخصومات المخصصة لك'}
                            {activeFilter === 'SYSTEM' && 'ستظهر هنا الرسائل المهمة وتحديثات النظام'}
                            {activeFilter === 'all' && 'سيظهر هنا أي إشعارات جديدة تتلقاها حول طلباتك والعروض الخاصة'}
                        </p>
                        <Button variant="outline" className="mt-4" onClick={() => router.push('/')}>
                            تصفح المتجر
                        </Button>
                    </div>
                ) : (
                    filteredNotifications.map((notification) => {
                        // Use smart styling for SYSTEM notifications
                        let config = notificationConfig[notification.type] || {
                            label: 'عام',
                            icon: Bell,
                            color: 'text-gray-600',
                            bgColor: 'bg-gray-50',
                            borderColor: 'border-gray-200',
                            glowColor: 'border-gray-500'
                        };

                        // Override for SYSTEM notifications with smart icons and colors
                        if (notification.type === 'SYSTEM') {
                            const smartStyle = getSystemNotificationStyle(notification.title);
                            const smartIcon = getSystemNotificationIcon(notification.title);
                            config = {
                                ...config,
                                icon: smartIcon,
                                ...smartStyle
                            };
                        }

                        const IconComponent = config.icon;

                        return (
                            <div key={notification.id} className="animate-in fade-in slide-in-from-bottom-5">
                                <Card className={`relative shadow-lg border-l-4 transition-all duration-300 ${notification.read
                                    ? `${config.borderColor} hover:shadow-md bg-background/80`
                                    : `${config.glowColor} card-border-glow hover:shadow-xl bg-background`
                                    } card-hover-effect overflow-hidden`}>
                                    {notification.isNew && !notification.read && (
                                        <Badge variant="destructive" className="absolute -top-2 -right-2 animate-pulse">
                                            جديد
                                        </Badge>
                                    )}

                                    <CardHeader className="pb-3 pt-4 px-4 flex flex-row items-center justify-between">
                                        <CardTitle className="flex items-center gap-3 text-lg font-medium">
                                            <div className={`h-10 w-10 rounded-full ${config.bgColor} flex items-center justify-center ${notification.read ? 'opacity-70' : 'opacity-100'
                                                }`}>
                                                <IconComponent className={`h-5 w-5 ${config.color}`} />
                                            </div>
                                            <div>
                                                <span className={notification.read ? 'text-muted-foreground' : 'text-foreground font-semibold'}>
                                                    {notification.title}
                                                </span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className={`text-xs ${config.color}`}>
                                                        {config.label}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(notification.createdAt).toLocaleTimeString('ar-EG', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="pt-0 pb-4 px-4">
                                        <div className={`mb-4 text-sm leading-relaxed ${notification.read ? 'text-muted-foreground' : 'text-foreground'
                                            }`}>
                                            {notification.body}
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(notification.createdAt).toLocaleDateString('ar-EG', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {notification.actionUrl && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 px-3 text-xs"
                                                        onClick={() => handleActionClick(notification.actionUrl!)}
                                                    >
                                                        عرض التفاصيل
                                                    </Button>
                                                )}

                                                {/* Toggle Read/Unread Button */}
                                                <Button
                                                    onClick={() => handleToggleRead(notification.id)}
                                                    size="sm"
                                                    variant={notification.read ? "outline" : "default"}
                                                    className="h-8 px-3 text-xs flex items-center gap-1"
                                                >
                                                    {notification.read ? (
                                                        <>
                                                            <RotateCcw className="h-3 w-3" />
                                                            غير مقروء
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="h-3 w-3" />
                                                            مقروء
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
} 