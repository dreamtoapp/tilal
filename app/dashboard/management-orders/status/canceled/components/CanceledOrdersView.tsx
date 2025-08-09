'use client';
// app/dashboard/orders-management/status/canceled/components/CanceledOrdersView.tsx
import React, { useState, useMemo } from 'react';

import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

import {
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';

import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Icon } from '@/components/icons/Icon';
import { cn } from '@/lib/utils';
import { Order } from '@/types/databaseTypes';
import { Badge } from '@/components/ui/badge';

import { restoreOrder } from '../actions/restore-order';

interface CanceledOrdersViewProps {
    orders: Order[];
    canceledCount: number;
    currentPage: number;
    pageSize: number;
    reasonFilter?: string;
}

export default function CanceledOrdersView({
    orders,
    canceledCount,
    currentPage,
    pageSize,
    reasonFilter
}: CanceledOrdersViewProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReason, setSelectedReason] = useState(reasonFilter || 'all');
    const [sortBy, setSortBy] = useState('canceledAt');
    const [sortOrder] = useState<'asc' | 'desc'>('desc');
    const [loading, setLoading] = useState(false);

    // Calculate statistics
    const statistics = useMemo(() => {
        const totalLoss = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
        const uniqueCustomers = new Set(orders.map(order => order.customer?.id)).size;
        const uniqueDrivers = new Set(orders.map(order => order.driver?.id).filter(Boolean)).size;
        const avgOrderValue = orders.length > 0 ? totalLoss / orders.length : 0;

        // Count cancellation reasons
        const reasonCounts = orders.reduce((acc, order) => {
            const reason = order.resonOfcancel || 'other';
            acc[reason] = (acc[reason] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalLoss,
            uniqueCustomers,
            uniqueDrivers,
            avgOrderValue,
            totalOrders: orders.length,
            reasonCounts
        };
    }, [orders]);

    // Calculate total pages
    const totalPages = Math.ceil(canceledCount / pageSize) || 1;

    // Update URL with new page number and filters
    const updateFilters = (page: number, newReason?: string, newSortBy?: string, newSortOrder?: 'asc' | 'desc') => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());

        if (newReason && newReason !== 'all') {
            params.set('reason', newReason);
        } else {
            params.delete('reason');
        }
        if (newSortBy) {
            params.set('sortBy', newSortBy);
        }
        if (newSortOrder) {
            params.set('sortOrder', newSortOrder);
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    // Handle reason filter change
    const handleReasonChange = (value: string) => {
        setSelectedReason(value);
        updateFilters(1, value);
    };

    // Handle sorting
    const handleSortChange = (value: string) => {
        setSortBy(value);
        updateFilters(currentPage, undefined, value, sortOrder);
    };

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchTerm);
    };

    // Export to CSV
    const handleExport = () => {
        const csvContent = [
            ['رقم الطلب', 'العميل', 'المبلغ', 'سبب الإلغاء', 'تاريخ الإلغاء'].join(','),
            ...orders.map(order => [
                order.orderNumber || '—',
                order.customer?.name || order.customer?.email || '—',
                `${order.amount} ر.س`,
                getCancellationReasonLabel(order.resonOfcancel || 'other'),
                order.updatedAt ? format(new Date(order.updatedAt), 'yyyy-MM-dd') : '—'
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `canceled-orders-${format(new Date(), 'yyyy-MM-dd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Handle order recovery (restore canceled order)
    const handleRecoverOrder = async (orderId: string) => {
        setLoading(true);
        try {
            await restoreOrder(orderId);
            // Refresh the page after successful restore
            router.refresh();
        } catch (error) {
            console.error('Error restoring order:', error);
        } finally {
            setLoading(false);
        }
    };

    // Generate pagination buttons
    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={i === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilters(i)}
                    className="h-8 w-8"
                >
                    {i}
                </Button>
            );
        }

        return (
            <div className="flex items-center justify-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateFilters(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                >
                    <Icon name="ChevronRight" className="h-4 w-4" />
                </Button>

                {pages}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateFilters(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                >
                    <Icon name="ChevronLeft" className="h-4 w-4" />
                </Button>
            </div>
        );
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'PPP', { locale: ar });
        } catch (error) {
            return 'تاريخ غير صالح';
        }
    };

    // Format currency for display
    const formatCurrency = (amount: number) => {
        const formatted = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
        return `${formatted} ر.س`;
    };

    // Format number for display
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    // Get cancellation reason label
    const getCancellationReasonLabel = (reason: string) => {
        const reasonMap: Record<string, string> = {
            'customer_request': 'طلب العميل',
            'Customer requested cancellation': 'طلب العميل',
            'customer requested cancellation': 'طلب العميل',
            'out_of_stock': 'نفاد المخزون',
            'delivery_issue': 'مشكلة في التوصيل',
            'payment_failed': 'فشل الدفع',
            'other': 'سبب آخر',
            'admin_canceled': 'إلغاء إداري',
            'system_error': 'خطأ في النظام',
            'duplicate_order': 'طلب مكرر',
            'invalid_address': 'عنوان غير صحيح',
            'price_change': 'تغيير في السعر',
        };
        return reasonMap[reason] || 'سبب آخر';
    };

    // Get cancellation reason display with appropriate styling
    const getCancellationReasonDisplay = (reason?: string) => {
        if (!reason) {
            return (
                <Badge variant="outline" className="bg-muted text-muted-foreground border-border px-3 py-1 rounded-full text-xs font-medium">
                    غير محدد
                </Badge>
            );
        }

        const reasonMap: Record<string, { label: string, color: string, icon: string }> = {
            'customer_request': {
                label: 'طلب العميل',
                color: 'bg-feature-users-soft text-feature-users border-feature-users',
                icon: '👤'
            },
            'Customer requested cancellation': {
                label: 'طلب العميل',
                color: 'bg-feature-users-soft text-feature-users border-feature-users',
                icon: '👤'
            },
            'customer requested cancellation': {
                label: 'طلب العميل',
                color: 'bg-feature-users-soft text-feature-users border-feature-users',
                icon: '👤'
            },
            'out_of_stock': {
                label: 'نفاد المخزون',
                color: 'bg-feature-products-soft text-feature-products border-feature-products',
                icon: '📦'
            },
            'delivery_issue': {
                label: 'مشكلة في التوصيل',
                color: 'bg-feature-suppliers-soft text-feature-suppliers border-feature-suppliers',
                icon: '🚚'
            },
            'payment_failed': {
                label: 'فشل الدفع',
                color: 'bg-destructive/10 text-destructive border-destructive/20',
                icon: '💳'
            },
            'admin_canceled': {
                label: 'إلغاء إداري',
                color: 'bg-feature-settings-soft text-feature-settings border-feature-settings',
                icon: '⚙️'
            },
            'system_error': {
                label: 'خطأ في النظام',
                color: 'bg-destructive/10 text-destructive border-destructive/20',
                icon: '⚠️'
            },
            'duplicate_order': {
                label: 'طلب مكرر',
                color: 'bg-warning/10 text-warning border-warning/20',
                icon: '🔄'
            },
            'invalid_address': {
                label: 'عنوان غير صحيح',
                color: 'bg-feature-commerce-soft text-feature-commerce border-feature-commerce',
                icon: '📍'
            },
            'price_change': {
                label: 'تغيير في السعر',
                color: 'bg-feature-analytics-soft text-feature-analytics border-feature-analytics',
                icon: '💰'
            },
            'other': {
                label: 'سبب آخر',
                color: 'bg-muted text-muted-foreground border-border',
                icon: '❓'
            },
        };

        const reasonInfo = reasonMap[reason] || {
            label: 'سبب آخر',
            color: 'bg-muted text-muted-foreground border-border',
            icon: '❓'
        };

        return (
            <Badge variant="outline" className={cn(
                'border px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit',
                reasonInfo.color
            )}>
                <span className="text-xs">{reasonInfo.icon}</span>
                <span>{reasonInfo.label}</span>
            </Badge>
        );
    };

    return (
        <div className="space-y-6" dir="rtl">
            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-destructive/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground mb-1">إجمالي الخسائر</p>
                                <span className="text-2xl font-bold text-destructive font-mono">
                                    {formatNumber(statistics.totalLoss)}
                                </span>
                            </div>
                            <div className="p-3 bg-destructive/10 rounded-xl">
                                <Icon name="DollarSign" className="h-6 w-6 text-destructive" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-feature-users shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground mb-1">العملاء المتأثرون</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-feature-users font-mono">
                                        {formatNumber(statistics.uniqueCustomers)}
                                    </span>
                                    <span className="text-sm font-medium text-feature-users/80">عميل</span>
                                </div>
                            </div>
                            <div className="p-3 bg-feature-users-soft rounded-xl">
                                <Icon name="Users" className="h-6 w-6 text-feature-users" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-feature-suppliers shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground mb-1">السائقون المتأثرون</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-feature-suppliers font-mono">
                                        {formatNumber(statistics.uniqueDrivers)}
                                    </span>
                                    <span className="text-sm font-medium text-feature-suppliers/80">سائق</span>
                                </div>
                            </div>
                            <div className="p-3 bg-feature-suppliers-soft rounded-xl">
                                <Icon name="Truck" className="h-6 w-6 text-feature-suppliers" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-feature-analytics shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-muted-foreground mb-1">متوسط قيمة الطلب</p>
                                <span className="text-2xl font-bold text-feature-analytics font-mono">
                                    {formatNumber(statistics.avgOrderValue)}
                                </span>
                            </div>
                            <div className="p-3 bg-feature-analytics-soft rounded-xl">
                                <Icon name="BarChart3" className="h-6 w-6 text-feature-analytics" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Controls */}
            <Card className="border-feature-commerce shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-md">
                            <div className="relative flex-1">
                                <Icon name="Search" className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="البحث في الطلبات..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pr-10"
                                />
                            </div>
                        </form>

                        {/* Filters */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                                <Icon name="AlertTriangle" className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-foreground">سبب الإلغاء:</span>
                                <Select value={selectedReason} onValueChange={handleReasonChange}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">جميع الأسباب</SelectItem>
                                        <SelectItem value="customer">طلب العميل</SelectItem>
                                        <SelectItem value="out_of_stock">نفاد المخزون</SelectItem>
                                        <SelectItem value="delivery_issue">مشكلة في التوصيل</SelectItem>
                                        <SelectItem value="payment_issue">مشكلة في الدفع</SelectItem>
                                        <SelectItem value="other">أسباب أخرى</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <Icon name="Filter" className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-foreground">ترتيب:</span>
                                <Select value={sortBy} onValueChange={handleSortChange}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="canceledAt">تاريخ الإلغاء</SelectItem>
                                        <SelectItem value="amount">المبلغ</SelectItem>
                                        <SelectItem value="customer">اسم العميل</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                onClick={handleExport}
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <Icon name="Download" className="h-4 w-4" />
                                تصدير CSV
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Orders List */}
            {orders.length > 0 ? (
                <div className="grid gap-4">
                    {orders.map((order, index) => (
                        <Card key={order.id} className="transition-colors duration-200 hover:shadow-sm">
                            <CardContent className="p-4 space-y-4">
                                {/* Main Content Row */}
                                <div className="grid gap-4 md:grid-cols-12 md:items-center">
                                    {/* Order Number */}
                                    <div className="md:col-span-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center justify-center w-8 h-8 bg-destructive/10 text-destructive rounded-full text-sm font-bold">
                                                {((currentPage - 1) * pageSize + index + 1).toString().padStart(2, '0')}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1">
                                                    <Icon name="XCircle" className="h-4 w-4 text-destructive" />
                                                    <span className="font-mono text-sm font-semibold text-destructive">
                                                        {order.orderNumber || '—'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="md:col-span-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Icon name="User" className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">
                                                    {order.customer?.name || order.customer?.email || 'غير معروف'}
                                                </span>
                                            </div>
                                            {order.customer?.phone && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Icon name="Phone" className="h-3 w-3" />
                                                    <span className="font-mono">{order.customer.phone}</span>
                                                </div>
                                            )}
                                            {order.items && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Icon name="Package" className="h-3 w-3" />
                                                    <span>{order.items.length} منتج</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Order Details */}
                                    <div className="md:col-span-2">
                                        <div className="space-y-1">
                                            <div className="text-lg font-bold text-destructive" style={{ fontFamily: 'monospace' }}>
                                                {formatCurrency(order.amount || 0)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cancellation Date */}
                                    <div className="md:col-span-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Icon name="Clock" className="h-4 w-4" />
                                            <span>{formatDate(String(order.updatedAt))}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="md:col-span-2">
                                        <div className="flex items-center gap-2 justify-end">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleRecoverOrder(order.id)}
                                                disabled={loading}
                                                className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                                            >
                                                <Icon name="RefreshCw" className={cn("h-4 w-4", loading && "animate-spin")} />
                                                استعادة
                                            </Button>
                                            <Link href={`/dashboard/show-invoice/${order.id}`}>
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <Icon name="Eye" className="h-4 w-4" />
                                                    تفاصيل
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Row - Cancellation Reason */}
                                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">سبب الإلغاء:</span>
                                        {getCancellationReasonDisplay(order.resonOfcancel || 'other')}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="border-dashed border-2 border-border">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                            <Icon name="XCircle" className="h-10 w-10 text-destructive/60" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2">لا توجد طلبات ملغية</h3>
                        <p className="text-sm text-muted-foreground text-center mb-4">
                            {reasonFilter && reasonFilter !== 'all'
                                ? 'لا توجد طلبات ملغية بهذا السبب'
                                : 'لا توجد طلبات ملغية حالياً'}
                        </p>
                        <div className="flex gap-2">
                            <Link href="/dashboard/management-orders">
                                <Button variant="outline" size="sm">
                                    عرض جميع الطلبات
                                </Button>
                            </Link>
                            <Link href="/dashboard/management-products/new">
                                <Button size="sm">
                                    إضافة منتج جديد
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Pagination */}
            {orders.length > 0 && (
                <Card className="border-border shadow-sm">
                    <CardFooter className="flex items-center justify-between p-4">
                        <div className="text-sm text-muted-foreground">
                            عرض {((currentPage - 1) * pageSize) + 1} إلى {Math.min(currentPage * pageSize, canceledCount)} من {canceledCount} طلب
                        </div>
                        {renderPagination()}
                    </CardFooter>
                </Card>
            )}
        </div>
    );
} 