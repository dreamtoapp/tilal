'use client';

import { useState, useMemo } from 'react';
import CustomerCard from './CustomerCard';
import CustomerSorting from './CustomerSorting';
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

type CustomerListProps = {
    customers: Customer[];
};

export default function CustomerList({ customers }: CustomerListProps) {
    const [sortBy, setSortBy] = useState<string>('all');

    // Get sorted customers based on selection
    const sortedCustomers = useMemo(() => {
        let filtered = [...customers];

        switch (sortBy) {
            case 'vip':
                filtered = customers.filter(c => c.orderCount >= 6);
                break;
            case 'active':
                filtered = customers.filter(c => c.orderCount >= 1 && c.orderCount < 6);
                break;
            case 'inactive':
                filtered = customers.filter(c => c.orderCount === 0);
                break;
            case 'most-orders':
                filtered = customers.sort((a, b) => b.orderCount - a.orderCount);
                break;
            case 'least-orders':
                filtered = customers.sort((a, b) => a.orderCount - b.orderCount);
                break;
            case 'newest':
                filtered = customers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case 'oldest':
                filtered = customers.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            default:
                // 'all' - no filtering, keep original order
                break;
        }

        return filtered;
    }, [customers, sortBy]);

    return (
        <div className='space-y-6'>
            {/* Sorting Controls */}
            <CustomerSorting customers={customers} onSortChange={setSortBy} currentSort={sortBy} />

            {/* Customer List */}
            <div className='flex-1 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 items-start'>
                {sortedCustomers.length > 0 ? (
                    sortedCustomers.map((customer) => (
                        <CustomerCard key={customer.id} customer={{
                            ...customer,
                            name: customer.name || '',
                        }} />
                    ))
                ) : (
                    <div className='col-span-full flex flex-col items-center justify-center py-12 text-center'>
                        <div className='w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4'>
                            <Icon name="Users" size="lg" className="text-muted-foreground" />
                        </div>
                        <h3 className='text-lg font-semibold text-muted-foreground mb-2'>لا يوجد عملاء</h3>
                        <p className='text-sm text-muted-foreground'>لم يتم العثور على عملاء يطابقون المعايير المحددة</p>
                    </div>
                )}
            </div>
        </div>
    );
} 