"use client";
import { Icon } from '@/components/icons/Icon';
import { useEffect, useState } from 'react';

interface FooterTabsProps {
    assignedOrders: number;
    deliveredOrders: number;
    canceledOrders: number;
    driverId: string;
    hasActiveTrip?: boolean; // NEW: pass from parent or set for demo
}

export default function FooterTabs({ assignedOrders, deliveredOrders, canceledOrders, driverId, hasActiveTrip = true }: FooterTabsProps) {
    const [activeStatus, setActiveStatus] = useState<string>('ASSIGNED');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const status = params.get('status');
            if (status && ['ASSIGNED', 'DELIVERED', 'CANCELED', 'ANALYTICS'].includes(status)) {
                setActiveStatus(status);
            } else {
                setActiveStatus('ASSIGNED');
            }
        }
    }, []);

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-md border-t border-border h-16 flex items-center justify-center shadow-lg pb-safe">
            <div className="flex w-full max-w-md h-full items-center justify-between">
                {/* Home button */}
                <button
                    className={`flex flex-col items-center justify-center h-full min-w-[56px] px-1 relative group focus:outline-none rounded-lg active:bg-primary/10 transition-all`}
                    aria-label="الرئيسية"
                    onClick={() => { window.location.href = `/driver?driverId=${driverId}`; }}
                    onTouchStart={() => window.navigator.vibrate?.(20)}
                >
                    <span className={`relative ${hasActiveTrip ? 'animate-car-drive' : ''}`}>
                        <Icon name="Car" className={`h-6 w-6 ${hasActiveTrip ? 'text-green-500' : 'text-muted-foreground'}`} />
                        {hasActiveTrip && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-green-300 rounded-full animate-road-pulse"></span>
                        )}
                    </span>
                </button>
                <div className="h-8 w-px bg-border mx-1" />
                {/* ASSIGNED tab */}
                <button
                    className={`flex flex-1 flex-col items-center justify-center h-full min-w-[64px] px-1 relative group focus:outline-none rounded-lg transition-all ${activeStatus === 'ASSIGNED' ? 'bg-primary/10 scale-105 shadow' : ''}`}
                    aria-current={activeStatus === 'ASSIGNED' ? 'page' : undefined}
                    style={{ touchAction: 'manipulation' }}
                    onClick={() => window.location.href = `/driver/showdata?status=ASSIGNED&driverId=${driverId}`}
                    onTouchStart={() => window.navigator.vibrate?.(20)}
                >
                    <div className="flex flex-row items-center gap-1">
                        <Icon name="UserCheck" className={`h-6 w-6 ${activeStatus === 'ASSIGNED' ? 'text-info' : 'text-muted-foreground'}`} />
                        <span className={`text-xs font-medium ${activeStatus === 'ASSIGNED' ? 'text-info' : 'text-muted-foreground'}`}>مُخصص</span>
                        <span className={`ml-1 text-xs ${activeStatus === 'ASSIGNED' ? 'text-info' : 'text-muted-foreground'}`}>{assignedOrders}</span>
                        {/* Badge for new assigned orders */}
                        {assignedOrders > 0 && <span className="ml-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                    </div>
                    {activeStatus === 'ASSIGNED' && <span className="absolute left-1/2 -translate-x-1/2 bottom-1 w-8 h-1 rounded bg-primary transition-all" />}
                </button>
                <div className="h-8 w-px bg-border mx-1" />
                {/* DELIVERED tab */}
                <button
                    className={`flex flex-1 flex-col items-center justify-center h-full min-w-[64px] px-1 relative group focus:outline-none rounded-lg transition-all ${activeStatus === 'DELIVERED' ? 'bg-primary/10 scale-105 shadow' : ''}`}
                    aria-current={activeStatus === 'DELIVERED' ? 'page' : undefined}
                    style={{ touchAction: 'manipulation' }}
                    onClick={() => window.location.href = `/driver/showdata?status=DELIVERED&driverId=${driverId}`}
                    onTouchStart={() => window.navigator.vibrate?.(20)}
                >
                    <div className="flex flex-row items-center gap-1">
                        <Icon name="CheckCircle" className={`h-6 w-6 ${activeStatus === 'DELIVERED' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`text-xs font-medium ${activeStatus === 'DELIVERED' ? 'text-primary' : 'text-muted-foreground'}`}>سلمت</span>
                        <span className={`ml-1 text-xs ${activeStatus === 'DELIVERED' ? 'text-primary' : 'text-muted-foreground'}`}>{deliveredOrders}</span>
                    </div>
                    {activeStatus === 'DELIVERED' && <span className="absolute left-1/2 -translate-x-1/2 bottom-1 w-8 h-1 rounded bg-primary transition-all" />}
                </button>
                <div className="h-8 w-px bg-border mx-1" />
                {/* CANCELED tab */}
                <button
                    className={`flex flex-1 flex-col items-center justify-center h-full min-w-[64px] px-1 relative group focus:outline-none rounded-lg transition-all ${activeStatus === 'CANCELED' ? 'bg-primary/10 scale-105 shadow' : ''}`}
                    aria-current={activeStatus === 'CANCELED' ? 'page' : undefined}
                    style={{ touchAction: 'manipulation' }}
                    onClick={() => window.location.href = `/driver/showdata?status=CANCELED&driverId=${driverId}`}
                    onTouchStart={() => window.navigator.vibrate?.(20)}
                >
                    <div className="flex flex-row items-center gap-1">
                        <Icon name="X" className={`h-6 w-6 ${activeStatus === 'CANCELED' ? 'text-destructive' : 'text-muted-foreground'}`} />
                        <span className={`text-xs font-medium ${activeStatus === 'CANCELED' ? 'text-destructive' : 'text-muted-foreground'}`}>الغيت</span>
                        <span className={`ml-1 text-xs ${activeStatus === 'CANCELED' ? 'text-destructive' : 'text-muted-foreground'}`}>{canceledOrders}</span>
                    </div>
                    {activeStatus === 'CANCELED' && <span className="absolute left-1/2 -translate-x-1/2 bottom-1 w-8 h-1 rounded bg-primary transition-all" />}
                </button>
                <div className="h-8 w-px bg-border mx-1" />
                {/* Analytics tab */}
                <button
                    className={`flex flex-col items-center justify-center h-full min-w-[56px] px-1 relative group focus:outline-none rounded-lg active:bg-primary/10 transition-all ${activeStatus === 'ANALYTICS' ? 'bg-primary/10 scale-105 shadow' : ''}`}
                    aria-label="إحصائيات"
                    aria-current={activeStatus === 'ANALYTICS' ? 'page' : undefined}
                    onClick={() => { window.location.href = `/driver/analytics?driverId=${driverId}`; }}
                    onTouchStart={() => window.navigator.vibrate?.(20)}
                >
                    <Icon name="BarChart3" className={`h-6 w-6 ${activeStatus === 'ANALYTICS' ? 'text-info' : 'text-muted-foreground'}`} />
                    <span className={`text-xs font-medium ${activeStatus === 'ANALYTICS' ? 'text-info' : 'text-muted-foreground'}`}>إحصائيات</span>
                </button>
            </div>
        </nav>
    );
} 