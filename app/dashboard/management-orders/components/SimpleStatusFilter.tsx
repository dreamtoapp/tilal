'use client';

import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter, useSearchParams } from 'next/navigation';

interface SimpleStatusFilterProps {
    currentStatus?: string;
    totalOrders: number;
    pendingOrders: number;
    assignedOrders: number;
    inTransitOrders: number;
    deliveredOrders: number;
    canceledOrders: number;
}

export default function SimpleStatusFilter({
    currentStatus,
    totalOrders,
    pendingOrders,
    assignedOrders,
    inTransitOrders,
    deliveredOrders,
    canceledOrders
}: SimpleStatusFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleStatusChange = (status: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (status === 'all') {
            params.delete('status');
        } else {
            params.set('status', status);
        }

        // Reset page to 1 when changing status
        params.set('page', '1');

        router.push(`/dashboard/management-orders?${params.toString()}`);
    };
    const statusFilters = [
        {
            key: 'all',
            label: 'جميع الطلبات',
            count: totalOrders,
            href: '/dashboard/management-orders',
            icon: 'Package',
            color: 'text-feature-commerce',
            bgColor: 'bg-feature-commerce-soft',
            borderColor: 'border-feature-commerce'
        },
        {
            key: 'PENDING',
            label: 'قيد الانتظار',
            count: pendingOrders,
            href: '/dashboard/management-orders?status=PENDING',
            icon: 'Clock',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-500'
        },
        {
            key: 'ASSIGNED',
            label: 'في السيارة',
            count: assignedOrders,
            href: '/dashboard/management-orders?status=ASSIGNED',
            icon: 'Truck',
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-500'
        },
        {
            key: 'IN_TRANSIT',
            label: 'في الطريق',
            count: inTransitOrders,
            href: '/dashboard/management-orders?status=IN_TRANSIT',
            icon: 'Truck',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-500'
        },
        {
            key: 'DELIVERED',
            label: 'تم التسليم',
            count: deliveredOrders,
            href: '/dashboard/management-orders?status=DELIVERED',
            icon: 'CheckCircle',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-500'
        },
        {
            key: 'CANCELED',
            label: 'ملغي',
            count: canceledOrders,
            href: '/dashboard/management-orders?status=CANCELED',
            icon: 'X',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-500'
        }
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => {
                const isActive = currentStatus === filter.key || (!currentStatus && filter.key === 'all');

                return (
                    <Button
                        key={filter.key}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusChange(filter.key)}
                        className={`
                            gap-2 transition-all duration-200
                            ${isActive
                                ? `${filter.bgColor} ${filter.color} border-${filter.borderColor.split('-')[1]}-500`
                                : 'hover:bg-muted'
                            }
                        `}
                    >
                        <Icon name={filter.icon} className="h-4 w-4" />
                        <span>{filter.label}</span>
                        <Badge
                            variant="secondary"
                            className={`
                                text-xs ${isActive ? 'bg-white/20' : 'bg-muted'}
                            `}
                        >
                            {filter.count}
                        </Badge>
                    </Button>
                );
            })}
        </div>
    );
} 