'use client';

import { useEffect, useState, memo } from 'react';
import { Icon } from '@/components/icons/Icon';

interface NotificationProps {
    show: boolean;
    type: 'add' | 'remove' | 'wishlist-add' | 'wishlist-remove';
    message: string;
    duration?: number;
}

const NotificationSection = memo(({
    show,
    type,
    message,
    duration = 3000
}: NotificationProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            setIsExiting(false);

            const timer = setTimeout(() => {
                setIsExiting(true);
                setTimeout(() => {
                    setIsVisible(false);
                }, 300); // Allow time for exit animation
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [show, duration]);

    if (!isVisible) return null;

    const getNotificationConfig = () => {
        switch (type) {
            case 'add':
                return {
                    icon: <Icon name="ShoppingCart" size="sm" />,
                    bgColor: 'bg-green-500 dark:bg-green-600',
                    textColor: 'text-white',
                    borderColor: 'border-green-400 dark:border-green-500',
                    ariaLabel: 'تمت إضافة المنتج إلى السلة'
                };
            case 'remove':
                return {
                    icon: <Icon name="X" size="sm" />,
                    bgColor: 'bg-red-500 dark:bg-red-600',
                    textColor: 'text-white',
                    borderColor: 'border-red-400 dark:border-red-500',
                    ariaLabel: 'تمت إزالة المنتج من السلة'
                };
            case 'wishlist-add':
                return {
                    icon: <Icon name="Heart" size="sm" className="fill-current" />,
                    bgColor: 'bg-pink-500 dark:bg-pink-600',
                    textColor: 'text-white',
                    borderColor: 'border-pink-400 dark:border-pink-500',
                    ariaLabel: 'تمت إضافة المنتج إلى المفضلة'
                };
            case 'wishlist-remove':
                return {
                    icon: <Icon name="Heart" size="sm" />,
                    bgColor: 'bg-gray-500 dark:bg-gray-600',
                    textColor: 'text-white',
                    borderColor: 'border-gray-400 dark:border-gray-500',
                    ariaLabel: 'تمت إزالة المنتج من المفضلة'
                };
            default:
                return {
                    icon: <Icon name="Check" size="sm" />,
                    bgColor: 'bg-blue-500 dark:bg-blue-600',
                    textColor: 'text-white',
                    borderColor: 'border-blue-400 dark:border-blue-500',
                    ariaLabel: 'تم تحديث المنتج'
                };
        }
    };

    const config = getNotificationConfig();

    return (
        <div
            className={`absolute top-3 left-1/2 transform -translate-x-1/2 z-30 
                       ${config.bgColor} ${config.textColor} 
                       px-4 py-2 rounded-full shadow-xl border-2 ${config.borderColor}
                       transition-all duration-300 ease-in-out
                       ${isExiting
                    ? 'opacity-0 scale-95 translate-y-[-8px]'
                    : 'opacity-100 scale-100 translate-y-0'
                }
                       backdrop-blur-sm`}
            role="status"
            aria-live="polite"
            aria-label={config.ariaLabel}
        >
            <div className="flex items-center gap-2">
                {config.icon}
                <span className="text-sm font-medium whitespace-nowrap">
                    {message}
                </span>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 h-0.5 bg-white/30 rounded-full overflow-hidden w-full">
                <div
                    className="h-full bg-white/60 rounded-full animate-progress-fill"
                    style={{
                        animationDuration: `${duration}ms`,
                        animationTimingFunction: 'linear'
                    }}
                />
            </div>
        </div>
    );
});

NotificationSection.displayName = 'NotificationSection';

export default NotificationSection; 