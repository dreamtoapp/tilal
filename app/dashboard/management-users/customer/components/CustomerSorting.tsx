'use client';

import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icon } from '@/components/icons/Icon';

type Customer = {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    role: any;
    addresses?: Array<{
        id: string;
        label: string;
        district: string;
        street: string;
        buildingNumber: string;
        floor?: string | null;
        apartmentNumber?: string | null;
        landmark?: string | null;
        deliveryInstructions?: string | null;
        latitude?: string | null;
        longitude?: string | null;
        isDefault: boolean;
    }> | null;
    password?: string | null;
    sharedLocationLink?: string | null;
    image?: string | null;
    latitude?: string | null;
    longitude?: string | null;
    preferredPaymentMethod?: string | null;
    deliveryPreferences?: string | null;
    orderCount: number;
    vipLevel?: number | null;
    createdAt: Date;
    updatedAt: Date;
};

type CustomerSortingProps = {
    customers: Customer[];
    onSortChange: (value: string) => void;
    currentSort: string;
};

export default function CustomerSorting({ customers, onSortChange, currentSort }: CustomerSortingProps) {

    // Calculate status counts
    const statusCounts = useMemo(() => {
        const counts = {
            all: customers.length,
            vip: customers.filter(c => c.orderCount >= 6).length,
            active: customers.filter(c => c.orderCount >= 1 && c.orderCount < 6).length,
            inactive: customers.filter(c => c.orderCount === 0).length,
        };
        return counts;
    }, [customers]);



    // Update the URL to reflect the current sort
    const handleSortChange = (value: string) => {
        onSortChange(value);
        // Update URL without page reload
        const url = new URL(window.location.href);
        url.searchParams.set('sort', value);
        window.history.pushState({}, '', url.toString());
    };

    return (
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/20 rounded-lg border border-border/30'>
            {/* Status Summary */}
            <div className='flex items-center gap-3 flex-wrap'>
                <span className='text-sm font-medium text-muted-foreground'>الحالة:</span>
                <Badge variant="outline" className="border-primary/20 text-primary">
                    الكل: {statusCounts.all}
                </Badge>
                <Badge variant="outline" className="border-special-fg text-special-fg">
                    VIP: {statusCounts.vip}
                </Badge>
                <Badge variant="outline" className="border-success-fg text-success-fg">
                    نشط: {statusCounts.active}
                </Badge>
                <Badge variant="outline" className="border-neutral-fg text-neutral-fg">
                    غير نشط: {statusCounts.inactive}
                </Badge>
            </div>

            {/* Sort Controls */}
            <div className='flex items-center gap-3'>
                <Icon name="Filter" size="sm" className="text-muted-foreground" />
                <Select value={currentSort} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="ترتيب حسب" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">جميع العملاء</SelectItem>
                        <SelectItem value="vip">VIP فقط</SelectItem>
                        <SelectItem value="active">نشط فقط</SelectItem>
                        <SelectItem value="inactive">غير نشط فقط</SelectItem>
                        <SelectItem value="most-orders">الأكثر طلباً</SelectItem>
                        <SelectItem value="least-orders">الأقل طلباً</SelectItem>
                        <SelectItem value="newest">الأحدث</SelectItem>
                        <SelectItem value="oldest">الأقدم</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
} 