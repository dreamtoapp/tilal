'use client';
// app/dashboard/orders-management/components/OrderStatusTabs.tsx
// import React from 'react';
import Link from '@/components/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/utils';
// Order status constants to match database values
const ORDER_STATUS = {
  PENDING: 'PENDING',
  IN_WAY: 'IN_WAY',
  DELIVERED: 'Delivered',
  CANCELED: 'CANCELED',
  ASSIGNED: 'ASSIGNED'
};

interface OrderStatusTab {
  label: string;
  value: string | undefined;
  icon: string;
  color: string;
  activeColor: string;
  hoverColor: string;
  // TODO: Add count property for order badges
  // count?: number;
}

interface OrderStatusTabsProps {
  activeStatus?: string;
  // TODO: Add orderCounts prop to receive counts from parent
  // orderCounts?: {
  //   total: number;
  //   pending: number;
  //   inWay: number;
  //   delivered: number;
  //   canceled: number;
  // };
}

export default function OrderStatusTabs({ activeStatus }: OrderStatusTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create a new URLSearchParams object to modify
  const createQueryString = (status: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset page to 1 when changing status filter
    params.set('page', '1');

    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }

    return params.toString();
  };

  // TODO: Add order counter badges to each status tab
  // TODO: Fetch order counts for each status from database
  // TODO: Display badge with count next to each tab label
  // TODO: Example: "جميع الطلبات (125)" with styled badge
  // TODO: Update counts in real-time when orders change status
  const tabs: OrderStatusTab[] = [
    {
      label: 'جميع الطلبات', // TODO: Add badge showing total orders count
      value: undefined,
      icon: 'Package',
      color: 'text-gray-600',
      activeColor: 'bg-gray-100 text-gray-900',
      hoverColor: 'hover:bg-gray-50',
    },
    {
      label: 'قيد الانتظار', // TODO: Add badge showing pending orders count
      value: ORDER_STATUS.PENDING,
      icon: 'Clock',
      color: 'text-amber-600',
      activeColor: 'bg-amber-100 text-amber-900',
      hoverColor: 'hover:bg-amber-50',
    },
    {
      label: 'في الطريق', // TODO: Add badge showing in-transit orders count
      value: ORDER_STATUS.IN_WAY,
      icon: 'Truck',
      color: 'text-indigo-600',
      activeColor: 'bg-indigo-100 text-indigo-900',
      hoverColor: 'hover:bg-indigo-50',
    },
    {
      label: 'تم التسليم', // TODO: Add badge showing delivered orders count
      value: ORDER_STATUS.DELIVERED,
      icon: 'CheckCircle',
      color: 'text-status-delivered',
      activeColor: 'bg-status-delivered-soft text-status-delivered',
      hoverColor: 'hover:bg-status-delivered-soft',
    },
    {
      label: 'ملغي', // TODO: Add badge showing canceled orders count
      value: ORDER_STATUS.CANCELED,
      icon: 'XCircle',
      color: 'text-status-canceled',
      activeColor: 'bg-status-canceled-soft text-status-canceled',
      hoverColor: 'hover:bg-status-canceled-soft',
    },
    {
      label: 'في السيارة',
      value: ORDER_STATUS.ASSIGNED,
      icon: 'Truck',
      color: 'text-status-priority',
      activeColor: 'bg-status-priority-soft text-status-priority',
      hoverColor: 'hover:bg-status-priority-soft',
    },
  ];

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-1 rtl:space-x-reverse border-b">
        {tabs.map((tab) => {
          const isActive =
            (tab.value === undefined && activeStatus === undefined) ||
            tab.value === activeStatus;

          return (
            <Link
              key={tab.label}
              href={`${pathname}?${createQueryString(tab.value)}`}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors",
                isActive
                  ? tab.activeColor
                  : `${tab.color} ${tab.hoverColor}`,
              )}
            >
              <Icon name={tab.icon} className="h-4 w-4" />
              <span>{tab.label}</span>
              {/* TODO: Add badge component here to show order count */}
              {/* TODO: Example: <Badge variant="secondary" className="ml-2">{orderCount}</Badge> */}
              {/* TODO: Badge should match tab colors and show 0 if no orders */}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
