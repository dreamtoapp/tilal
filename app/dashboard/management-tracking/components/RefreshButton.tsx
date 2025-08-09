'use client';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RefreshButton() {
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            router.refresh();
            // Small delay to show the loading state
            await new Promise(resolve => setTimeout(resolve, 500));
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            className="btn-view-outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
        >
            <Icon name="RefreshCw" className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            تحديث
        </Button>
    );
} 