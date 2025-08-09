'use client';
import { useInView } from 'react-intersection-observer';
import ProductCardAdapter from '@/app/(e-comm)/(home-page-sections)/product/cards/ProductCardAdapter';
import ProductCardSkeleton from '@/app/(e-comm)/(home-page-sections)/product/cards/ProductCardSkeleton';
import { useEffect, useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';
import debounce from 'debounce';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { ProductFilters } from '../helpers/useProductInfiniteScroll';

interface ProductInfiniteGridProps {
    initialProducts: any[];
    filters: ProductFilters;
}

const PAGE_SIZE = 8;
const fetcher = (url: string) => {
    console.log('🌐 SWR FETCHER: Fetching from API:', url);
    return fetch(url).then(res => res.json());
};

function buildQuery(filters: ProductFilters, pageIndex: number) {
    const params = new URLSearchParams();
    params.set('page', (pageIndex + 1).toString());
    params.set('pageSize', PAGE_SIZE.toString());
    if (filters.categorySlug) params.set('slug', filters.categorySlug);
    if (filters.search) params.set('search', filters.search);
    if (filters.priceMin !== undefined) params.set('priceMin', String(filters.priceMin));
    if (filters.priceMax !== undefined) params.set('priceMax', String(filters.priceMax));
    return `/api/products-grid?${params.toString()}`;
}

export default function ProductInfiniteGrid({ initialProducts, filters }: ProductInfiniteGridProps) {
    const getKey = (pageIndex: number, previousPageData: any) => {
        if (previousPageData && (!previousPageData.products || previousPageData.products.length === 0)) return null;
        return buildQuery(filters, pageIndex);
    };

    const {
        data,
        error,
        size,
        setSize,
        isValidating
    } = useSWRInfinite(getKey, fetcher, {
        revalidateFirstPage: false
    });

    const products = data ? data.flatMap((page: any) => page.products || []) : initialProducts;
    const hasMore = data ? (data[data.length - 1]?.products?.length === PAGE_SIZE) : initialProducts.length === PAGE_SIZE;
    const loading = isValidating && size > 1;

    const { ref, inView } = useInView({ threshold: 0.1, rootMargin: '200px 0px' });

    // Debounced load more
    const debouncedLoadMore = useMemo(() => debounce(() => setSize(size + 1), 200), [setSize, size]);

    useEffect(() => {
        if (inView && hasMore && !loading) {
            debouncedLoadMore();
        }
    }, [inView, hasMore, loading, debouncedLoadMore]);

    // Clean Empty State Component
    const EmptyState = () => (
        <div className="py-16 px-6 text-center">
            <div className="mx-auto w-28 h-28 mb-8 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                <Icon name="Package" className="w-14 h-14 text-primary/60" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
                لا توجد منتجات متاحة حالياً
            </h3>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
                {filters.search || filters.categorySlug
                    ? 'لم نتمكن من العثور على منتجات تطابق بحثك. جرب تعديل معايير البحث أو استكشف فئات أخرى.'
                    : 'نحن نعمل على إضافة منتجات جديدة ومميزة. ستعود قريباً مع تشكيلة واسعة من المنتجات عالية الجودة.'
                }
            </p>
        </div>
    );

    return (
        <div className="container mx-auto bg-transparent border-none shadow-none">
            {products.length > 0 ? (
                <>
                    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 bg-transparent border-none shadow-none" aria-label="قائمة المنتجات">
                        {products.map((product: any, index: number) => (
                            <li key={product.id || index} className="" data-index={index} style={{ contentVisibility: 'auto', containIntrinsicSize: '0 520px' }}>
                                <ProductCardAdapter product={product} className="h-full w-full" index={index} priority={index < 8} />
                            </li>
                        ))}
                        {loading && Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={`skeleton_${i}`} />)}
                    </ul>
                    <div ref={ref} className="mt-8 flex w-full flex-col items-center py-6" role="status" aria-live="polite">
                        {error && (
                            <div className="text-center mb-6">
                                <div className="text-red-500 mb-4 flex items-center justify-center gap-2">
                                    <Icon name="AlertCircle" className="w-5 h-5" />
                                    فشل في تحميل المنتجات. يرجى المحاولة مرة أخرى.
                                </div>
                                <Button variant="outline" onClick={() => setSize(1)}>
                                    <Icon name="RefreshCw" className="w-4 h-4 mr-2" />
                                    إعادة المحاولة
                                </Button>
                            </div>
                        )}
                        {hasMore && !loading && (
                            <Button onClick={() => setSize(size + 1)} className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg shadow hover:bg-primary/90">
                                <Icon name="Download" className="w-4 h-4 mr-2" />
                                تحميل المزيد
                            </Button>
                        )}
                    </div>
                </>
            ) : (
                <EmptyState />
            )}
        </div>
    );
} 