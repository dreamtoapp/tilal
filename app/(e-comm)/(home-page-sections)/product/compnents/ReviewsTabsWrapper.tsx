'use client';
import { useEffect, useState } from 'react';
import { Tabs } from '@/components/ui/tabs';

interface ReviewsTabsWrapperProps {
    children: React.ReactNode;
}

export default function ReviewsTabsWrapper({ children }: ReviewsTabsWrapperProps) {
    const [currentTab, setCurrentTab] = useState<'details' | 'reviews'>('details');

    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.hash === '#reviews') {
            setCurrentTab('reviews');
            // scroll into view smoothly if not already
            const el = document.getElementById('reviews');
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    return (
        <Tabs defaultValue={currentTab} onValueChange={(val) => setCurrentTab(val as 'details' | 'reviews')}>{children}</Tabs>
    );
} 