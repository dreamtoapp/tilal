import Image from 'next/image';
import Link from '@/components/link';
import { getPromotions } from '../../actions/getPromotions';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

// Add Promotion type
interface Promotion {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    imageUrl?: string;
    discountPercentage?: number;
    productAssignments?: { product: any }[];
    description?: string;
}

export default async function FeaturedPromotions() {
    const promotions = await getPromotions() as Promotion[];
    const activePromotions = promotions.filter((offer: Promotion) => offer.isActive);

    if (activePromotions.length === 0) return null;

    return (
        <section className="my-8">
            <div className="flex items-center gap-2 pb-2">
                <h2 className="text-xl font-bold text-foreground">العروض المميزة</h2>
                <Badge variant="outline">
                    {activePromotions.length}
                </Badge>

            </div>

            <ScrollArea className="w-full max-w-full overflow-x-auto pb-2">
                <div className="flex flex-row gap-4">
                    {activePromotions.map((offer: Promotion, idx: number) => (
                        <div
                            key={offer.id}
                            className="block min-w-[320px] max-w-xs overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            {/* Offer Image */}
                            <div className="relative aspect-video overflow-hidden">
                                {offer.imageUrl ? (
                                    <Image
                                        src={offer.imageUrl}
                                        alt={offer.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        priority={idx < 8}
                                    />
                                ) : (
                                    <div className="h-full w-full bg-gradient-to-r from-primary/30 to-primary/10" />
                                )}

                                {/* Discount Badge */}
                                {offer.discountPercentage && (
                                    <span className="absolute right-3 top-3 rounded-full bg-destructive px-3 py-1 text-sm font-bold text-destructive-foreground shadow">
                                        {offer.discountPercentage}% خصم
                                    </span>
                                )}
                            </div>

                            {/* Offer Details */}
                            <div className="p-4">
                                <h3 className="mb-2 text-lg font-semibold flex items-center gap-2">
                                    {offer.name}
                                    {Array.isArray(offer.productAssignments) && (
                                        offer.productAssignments.length > 0 ? (
                                            <span
                                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-feature-products-soft text-feature-products border border-feature-products animate-fade-in"
                                                title="عدد المنتجات المرتبطة بهذا العرض"
                                            >
                                                {offer.productAssignments.length} منتج
                                            </span>
                                        ) : (
                                            <span
                                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-muted animate-fade-in"
                                                title="لا توجد منتجات مرتبطة بهذا العرض بعد"
                                            >
                                                لا توجد منتجات بعد
                                            </span>
                                        )
                                    )}
                                </h3>
                                {offer.description && (
                                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                                        {offer.description}
                                    </p>
                                )}

                                {/* View Products Button */}
                                <Link href={`/offers/${offer.slug}`}
                                    className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow text-center"
                                >
                                    تفاصيل العرض
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="h-2" />
            </ScrollArea>
        </section>
    );
}