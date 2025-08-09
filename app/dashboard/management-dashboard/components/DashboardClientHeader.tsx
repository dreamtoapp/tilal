"use client";
import QuickActions from '../components/QuickActions';

export default function DashboardClientHeader() {
    return (
        <div className='flex items-center gap-3 flex-wrap'>
            <QuickActions />
            {/* Removed PusherNotify - now handled by AdminNotificationListener */}
        </div>
    );
} 