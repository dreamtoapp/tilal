import { useCallback, useEffect, useRef, useState } from 'react';
import { getCachedProductsPage } from '@/app/(e-comm)/homepage/actions/fetchProductsPage';
import type { Product } from '@/types/databaseTypes';

export interface ProductFilters {
  categorySlug?: string;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  // Add more filter fields as needed
}

interface UseProductInfiniteScrollOptions {
  initialProducts: Product[];
  initialPage?: number;
  pageSize?: number;
  filters: ProductFilters;
}

// Define a local type matching the fetchProductsPage return shape
interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
  rating: number | null;
  reviewCount: number;
  outOfStock: boolean;
  details: string | null;
  categoryAssignments: any[];
}

// Add type for fetchProductsPage result
interface ProductsPageResult {
  products: any[];
  currentPage: number;
  totalPages: number;
}

export function useProductInfiniteScroll({
  initialProducts,
  initialPage = 2,
  pageSize = 8,
  filters,
}: UseProductInfiniteScrollOptions) {
  const toProductListItem = (p: any): ProductListItem => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? null,
    imageUrl: p.imageUrl ?? null,
    rating: p.rating ?? null,
    reviewCount: p.reviewCount ?? 0,
    outOfStock: p.outOfStock ?? false,
    details: p.details ?? null,
    categoryAssignments: p.categoryAssignments ?? [],
  });

  const [products, setProducts] = useState<ProductListItem[]>(initialProducts.map(toProductListItem));
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const lastFilters = useRef<ProductFilters>(filters);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Debounce filter changes
  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify(lastFilters.current)) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        setProducts(initialProducts.map(toProductListItem));
        setPage(initialPage);
        setHasMore(true);
        setError(null);
        lastFilters.current = filters;
      }, 400);
    }
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, initialProducts, initialPage]);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getCachedProductsPage({ ...filters, page, pageSize }) as ProductsPageResult;
      if (result.products && result.products.length > 0) {
        setProducts((prev) => [
          ...prev,
          ...result.products.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            compareAtPrice: p.compareAtPrice ?? null,
            imageUrl: p.imageUrl ?? null,
            rating: p.rating ?? null,
            reviewCount: p.reviewCount ?? 0,
            outOfStock: p.outOfStock ?? false,
            details: p.details ?? null,
            categoryAssignments: p.categoryAssignments ?? [],
          }))
        ]);
        setPage((prev) => prev + 1);
        setRetryCount(0);
      } else {
        setHasMore(false);
      }
      setHasMore(result.currentPage < result.totalPages);
    } catch (err: any) {
      setError('\u0641\u0634\u0644 \u0641\u064a \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a. \u064a\u0631\u062c\u0649 \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649.');
      if (retryCount < 2) {
        setTimeout(() => setRetryCount((c) => c + 1), 1000);
      } else {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize, loading, hasMore, retryCount]);

  const reset = useCallback(() => {
    setProducts(initialProducts.map(toProductListItem));
    setPage(initialPage);
    setHasMore(true);
    setError(null);
    setRetryCount(0);
    lastFilters.current = filters;
  }, [initialProducts, initialPage, filters]);

  return {
    products,
    fetchMore,
    loading,
    error,
    hasMore,
    reset,
  };
} 