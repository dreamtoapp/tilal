'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface TimeAgoProps {
    date: Date | string;
    className?: string;
}

export function TimeAgo({ date, className }: TimeAgoProps) {
    const [mounted, setMounted] = useState(false);
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        setMounted(true);

        const updateTimeAgo = () => {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            const formatted = formatDistanceToNow(dateObj, {
                addSuffix: false,
                locale: ar
            });
            setTimeAgo(`منذ ${formatted}`);
        };

        // Update immediately
        updateTimeAgo();

        // Update every minute
        const interval = setInterval(updateTimeAgo, 60000);

        return () => clearInterval(interval);
    }, [date]);

    // Show loading state or empty string during SSR to prevent hydration mismatch
    if (!mounted) {
        return <span className={className}>جاري التحميل...</span>;
    }

    return <span className={className}>{timeAgo}</span>;
} 