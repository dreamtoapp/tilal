'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AlertCircle, Package } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

import { fetchOrdersAction } from '../../management-dashboard/action/fetchOrders';
import OrderCard from './OrderCard';
import { useSearch } from './SearchContext';
import { useRefresh } from './RefreshContext';
import { Order } from '@/types/databaseTypes';

// Memoize the OrderCard to prevent unnecessary re-renders
const MemoizedOrderCard = memo(OrderCard);

interface OrderCardViewProps {
    initialOrders: Order[];
    status?: string;
}

export default function OrderCardView({ initialOrders = [], status }: OrderCardViewProps) {
    const { searchTerm } = useSearch();
    const { isRefreshing, setRefreshing } = useRefresh();
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pageRef = useRef(page);
    const initialOrdersRef = useRef(initialOrders);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pageSize = 12; // Restore original page size for smooth infinite scroll

    // Update orders when initial orders change
    useEffect(() => {
        if (initialOrdersRef.current.length !== initialOrders.length || status) {
            initialOrdersRef.current = initialOrders;
            setOrders(initialOrders);
            setFilteredOrders(initialOrders);
            setPage(1);
            pageRef.current = 1;
            // Restore original infinite scroll logic
            setHasMore(true);
            setError(null);
        }
    }, [initialOrders, status]);

    const handleRefresh = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setPage(1);
        pageRef.current = 1;
        setHasMore(true);

        try {
            const refreshedOrders = await fetchOrdersAction({
                status: status,
                page: 1,
                pageSize: pageSize * page,
            });

            setOrders(refreshedOrders);
            setFilteredOrders(refreshedOrders);
        } catch (error) {
            setError('فشل في تحديث البيانات');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [status, page, setRefreshing, pageSize]);

    // Handle refresh from header button
    useEffect(() => {
        if (isRefreshing) {
            handleRefresh();
        }
    }, [isRefreshing, handleRefresh]);

    // Search functionality using context
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            if (searchTerm.trim() === '') {
                setFilteredOrders(orders);
            } else {
                const filtered = orders.filter(order =>
                    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    order.customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    order.customer.phone?.includes(searchTerm) ||
                    order.amount.toString().includes(searchTerm)
                );
                setFilteredOrders(filtered);
            }
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm, orders]);

    const fetchMoreData = useCallback(async () => {
        if (!hasMore || isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const newOrders = await fetchOrdersAction({
                status: status,
                page: pageRef.current + 1,
                pageSize,
            });

            setPage((prev) => {
                const newPage = prev + 1;
                pageRef.current = newPage;
                return newPage;
            });

            if (newOrders.length === 0) {
                setHasMore(false);
            } else {
                setOrders((prev) => {
                    const existingIds = new Set(prev.map((order) => order.id));
                    const filteredOrders = newOrders.filter((order: Order) => !existingIds.has(order.id));
                    const updatedOrders = [...prev, ...filteredOrders];

                    if (searchTerm.trim() === '') {
                        setFilteredOrders(updatedOrders);
                    }

                    return updatedOrders;
                });
                setHasMore(newOrders.length >= pageSize);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setError('فشل في تحميل المزيد من الطلبات. يرجى المحاولة مرة أخرى.');
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [hasMore, isLoading, status, searchTerm]);

    // Simple loader
    const Loader = () => (
        <div className="w-full py-8">
            <Card className="shadow-lg border-l-4 border-l-feature-commerce">
                <CardContent className="flex items-center justify-center gap-3 p-6">
                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-feature-commerce"></div>
                    <span className="text-feature-commerce font-medium">جاري تحميل المزيد من الطلبات...</span>
                </CardContent>
            </Card>
        </div>
    );

    // Simple skeleton loader
    const SkeletonLoader = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="shadow-md border-l-4 border-l-feature-commerce">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    // Simple end message
    const EndMessage = () => (
        <div className="w-full py-8">
            <Card className="shadow-lg border-l-4 border-l-feature-commerce">
                <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                    <Package className="h-12 w-12 text-feature-commerce" />
                    <div>
                        <h3 className="font-semibold text-feature-commerce mb-2">تم تحميل جميع الطلبات</h3>
                        <p className="text-muted-foreground text-sm">
                            {filteredOrders.length > 0
                                ? `تم عرض ${filteredOrders.length} طلب`
                                : 'لا توجد طلبات تطابق المعايير المحددة'
                            }
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    // Show skeleton for initial load
    if (!orders.length && isLoading) {
        return <SkeletonLoader />;
    }

    return (
        <div className="space-y-6">
            {/* Orders Display */}
            <InfiniteScroll
                dataLength={filteredOrders.length}
                next={fetchMoreData}
                hasMore={hasMore && !searchTerm}
                loader={<Loader />}
                endMessage={<EndMessage />}
                scrollThreshold={0.9}
            >
                {filteredOrders.length === 0 ? (
                    <Card className="shadow-lg border-l-4 border-l-feature-commerce">
                        <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
                            <AlertCircle className="h-16 w-16 text-muted-foreground" />
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    لا توجد طلبات
                                </h3>
                                <p className="text-muted-foreground">
                                    {searchTerm
                                        ? 'لم يتم العثور على طلبات تطابق البحث المحدد'
                                        : 'لا توجد طلبات في هذا القسم حالياً'
                                    }
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredOrders.map((order) => (
                            <MemoizedOrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </InfiniteScroll>

            {/* Error Handling */}
            {error && (
                <Card className="shadow-lg border-l-4 border-l-red-500">
                    <CardContent className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <span className="text-red-700">{error}</span>
                        </div>
                        <Button
                            onClick={fetchMoreData}
                            variant="outline"
                            size="sm"
                        >
                            إعادة المحاولة
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 