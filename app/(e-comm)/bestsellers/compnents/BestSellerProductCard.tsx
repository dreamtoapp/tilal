import Image from 'next/image';
import Link from '@/components/link';
import { Icon } from '@/components/icons/Icon';

export interface BestSellerProductCardProps {
    id: string;
    name: string;
    slug: string;
    price: number;
    imageUrl?: string;
    salesCount: number;
    rank?: number;
}

export default function BestSellerProductCard({
    id,
    name,
    slug,
    price,
    imageUrl,
    salesCount,
    rank
}: BestSellerProductCardProps) {
    return (
        <div
            key={id}
            className="group block rounded-lg border bg-card shadow-sm hover:shadow-lg transition overflow-hidden relative"
            aria-label={name}
        >
            <div className="relative w-full aspect-square bg-muted">
                <Image
                    src={imageUrl || '/fallback/fallback.avif'}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={rank !== undefined && rank < 4}
                />
                <span className="absolute top-2 left-2 flex items-center gap-1 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow">
                    <Icon name="Flame" className="inline-block mr-1" />
                    الأكثر مبيعًا
                </span>
                {rank !== undefined && (
                    <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow">
                        #{rank + 1}
                    </span>
                )}
            </div>
            <div className="p-3">
                <div className="font-semibold text-base truncate mb-1">{name}</div>
                <div className="text-sm text-muted-foreground mb-1">{price.toLocaleString()} ر.س</div>
                <div className="text-xs text-muted-foreground">مبيعات: {salesCount}</div>
                <Link href={`/product/${slug}`} className="mt-2 inline-block w-full text-center bg-primary text-primary-foreground rounded px-3 py-1 font-semibold hover:bg-primary/90 transition">
                    عرض المنتج
                </Link>
            </div>
        </div>
    );
} 