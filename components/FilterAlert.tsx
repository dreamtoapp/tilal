"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function FilterAlert() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const hasFilter = searchParams.has('search') || searchParams.has('description') || searchParams.has('priceMin') || searchParams.has('priceMax') || searchParams.has('category') || searchParams.has('slug');

    const filterDesc = [
        searchParams.get('search') && `اسم المنتج: "${searchParams.get('search')}"`,
        searchParams.get('description') && `الوصف: "${searchParams.get('description')}"`,
        (searchParams.get('priceMin') || searchParams.get('priceMax')) && `السعر: ${searchParams.get('priceMin') || 'أي'} - ${searchParams.get('priceMax') || 'أي'}`,
        (searchParams.get('category') || searchParams.get('slug')) && `الفئة: "${searchParams.get('category') || searchParams.get('slug')}"`,
    ].filter(Boolean).join('، ');

    const handleClear = () => {
        router.push('/');
    };

    if (!hasFilter) return null;

    return (
        <div style={{ position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 49 }}>
            <div className="mx-auto max-w-2xl flex items-center justify-between h-12 rounded-lg bg-muted/80 border border-border px-4 shadow-sm text-sm text-foreground/90 backdrop-blur-sm">
                <span className="truncate">
                    <span className="font-medium text-muted-foreground">تصفية مفعلة:</span> {filterDesc || 'تم تطبيق تصفية على المنتجات.'}
                </span>
                <Button variant="ghost" size="sm" className="ml-2 px-2 py-1 text-xs text-muted-foreground hover:text-primary-foreground" onClick={handleClear}>
                    مسح التصفية
                </Button>
            </div>
        </div>
    );
} 