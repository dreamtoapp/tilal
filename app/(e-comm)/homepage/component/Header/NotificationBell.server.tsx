import Link from 'next/link';
import { Icon } from '@/components/icons/Icon';
import { getUnreadNotificationCount } from '@/app/(e-comm)/(adminPage)/user/notifications/actions/getUserNotifications';
import { userProfile } from '@/app/(e-comm)/(adminPage)/user/profile/action/action';
import { getDefaultAddress } from '@/lib/address-helpers';
import clsx from 'clsx';

interface NotificationBellProps {
    userId: string;
}

export default async function NotificationBell({ userId }: NotificationBellProps) {
    // Fetch all data in parallel
    const [unreadCount, user, defaultAddress] = await Promise.all([
        getUnreadNotificationCount(userId),
        userProfile(userId),
        getDefaultAddress(userId),
    ]);

    const isOpt = user?.isOtp;
    const hasLatLng = !!(defaultAddress?.latitude && defaultAddress?.longitude);
    const showWarning = !isOpt || !hasLatLng;

    return (
        <Link
            href="/user/notifications"
            className={clsx(
                'relative flex items-center justify-center w-12 h-12 p-2 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-feature-analytics/20',
                showWarning && 'border border-yellow-400'
            )}
            aria-label="الإشعارات"
            prefetch={false}
        >
            <Icon name="Bell" size="md" className="h-7 w-7 text-foreground" />
            {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold shadow ring-1 ring-white dark:ring-gray-900 border border-primary animate-in fade-in zoom-in">
                    {unreadCount}
                </span>
            )}
            {showWarning && (
                <span
                    className="absolute -left-1 -bottom-1 flex h-3 w-3 items-center justify-center rounded-full bg-yellow-400 text-white text-[8px] font-bold shadow border border-yellow-400"
                    title={!isOpt ? 'الحساب غير مفعل للإشعارات' : 'العنوان الافتراضي ينقصه إحداثيات الموقع'}
                >
                    !
                </span>
            )}
        </Link>
    );
} 