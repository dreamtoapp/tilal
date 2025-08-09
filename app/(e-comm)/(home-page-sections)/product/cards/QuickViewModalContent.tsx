import { useRef } from 'react';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';

import { toast } from 'sonner';
import Link from '@/components/link';
import { X } from 'lucide-react';
import type { Product } from '@/types/databaseTypes';
import type { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';

export default function QuickViewModalContent({
    product,
    ratingFormatted,
    formatNum,
    setOpen,
}: {
    product: Product;
    ratingFormatted: string | null;
    formatNum: (n: number) => string;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
    const discountPercent = hasDiscount && product.compareAtPrice
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0;
    const images = (product.images?.length ? product.images : [product.imageUrl]).filter(Boolean) as string[];

    return (
        <DialogContent className="w-full max-w-3xl p-0 overflow-hidden bg-background rounded-2xl shadow-2xl">
            {/* Accessible DialogTitle for screen readers */}
            <DialogTitle>
                <span className="sr-only">{product.name}</span>
            </DialogTitle>
            {/* Sticky header with product name, price, and close */}
            <div className="sticky top-0 z-20 flex items-center justify-between bg-background/95 px-6 py-4 border-b border-border">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="text-lg sm:text-2xl font-bold truncate text-foreground" title={product.name}>{product.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xl font-bold text-feature-commerce">{product.price.toLocaleString()} ر.س</span>
                        {hasDiscount && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-semibold animate-pulse">
                                خصم {discountPercent}%
                            </span>
                        )}
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span className="text-sm line-through text-muted-foreground">{product.compareAtPrice.toLocaleString()} ر.س</span>
                        )}
                    </div>
                </div>
                <button
                    ref={closeButtonRef}
                    onClick={() => setOpen(false)}
                    aria-label="إغلاق المعاينة السريعة"
                    className="ml-2 rounded-full p-2 hover:bg-muted focus:bg-muted focus:outline-none focus:ring-2 focus:ring-primary transition"
                >
                    <X className="w-5 h-5 text-muted-foreground" />
                </button>
            </div>
            {/* ...rest of modal content... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 max-h-[80vh] overflow-y-auto">
                {/* Image carousel or single image */}
                <div className="relative flex flex-col items-center justify-center bg-muted/40 p-4 md:p-6 min-h-[320px]">
                    {images.length > 1 ? (
                        <div className="w-full max-w-[400px] aspect-square rounded-xl overflow-hidden bg-white shadow-md">
                            {/* Simple carousel: show all images with horizontal scroll */}
                            <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-muted/60 scrollbar-track-transparent">
                                {images.map((img, idx) => (
                                    <Image
                                        key={img + idx}
                                        src={img}
                                        alt={product.name}
                                        width={320}
                                        height={320}
                                        className="object-contain w-80 h-80 rounded-xl flex-shrink-0 border border-border bg-white transition-transform hover:scale-105"
                                        draggable={false}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <Image
                            src={images[0]}
                            alt={product.name}
                            width={400}
                            height={320}
                            className="object-contain w-full h-80 rounded-xl border border-border bg-white shadow-md"
                            draggable={false}
                        />
                    )}
                    {product.rating && (
                        <div className="absolute bottom-8 left-8 flex items-center gap-1 bg-secondary/80 px-2 py-1 rounded-full shadow text-secondary-foreground text-xs font-semibold">
                            <Icon name="Star" size="xs" className="fill-yellow-500/80 text-yellow-500" />
                            <span>{ratingFormatted}</span>
                            {product.reviewCount > 0 && (
                                <Link href={`/product/${product.slug}#reviews`} className=" text-secondary-foreground hover:underline ml-1">({formatNum(product.reviewCount)} تقييم)</Link>
                            )}
                        </div>
                    )}
                </div>
                {/* ...rest of details section... */}
                <div className="flex flex-col gap-4 p-4 md:p-6 bg-background/80 rounded-b-2xl md:rounded-b-none md:rounded-r-2xl min-h-[320px]">
                    {/* Shipping, return, guarantee badges */}
                    <div className="flex flex-wrap gap-3 text-xs mb-2">
                        {product.shippingDays && (
                            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                                <Icon name="Truck" size="xs" /> {product.shippingDays} أيام شحن
                            </span>
                        )}
                        {product.returnPeriodDays && (
                            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                                <Icon name="RotateCw" size="xs" /> إرجاع {product.returnPeriodDays} يوم
                            </span>
                        )}
                        {product.hasQualityGuarantee && (
                            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                                <Icon name="ShieldCheck" size="xs" /> ضمان
                            </span>
                        )}
                    </div>

                    {/* Features
                    {product.features?.length > 0 && (
                        <div className="bg-muted/60 rounded-lg p-3 border border-border">
                            <h3 className="text-sm font-semibold mb-2 text-foreground">المزايا السريعة</h3>
                            <ul className="list-disc pr-4 space-y-1 text-xs text-muted-foreground">
                                {product.features.slice(0, 5).map((f: string, i: number) => (
                                    <li key={i}>{f}</li>
                                ))}
                            </ul>
                        </div>
                    )} */}

                    {/* Specs */}
                    <div className="flex flex-col gap-2 text-xs text-muted-foreground h-40 overflow-y-auto">
                        {product.brand && (
                            <div><span className="font-medium text-foreground">العلامة التجارية:</span> {product.brand}</div>
                        )}
                        {product.size && (
                            <div><span className="font-medium text-foreground">المقاس:</span> {product.size}</div>
                        )}
                        {product.details && (
                            <div><span className="font-medium text-foreground">تفاصيل إضافية:</span> {product.details}</div>
                        )}
                        {product.description && (
                            <div><span className="font-medium text-foreground">الوصف:</span> {product.description}</div>
                        )}
                        {product.features && product.features.length > 0 && (
                            <div>
                                <span className="font-medium text-foreground">المزايا:</span>
                                <ul className="list-disc pr-4 space-y-1">
                                    {product.features.map((f: string, i: number) => (
                                        <li key={i}>{f}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {!(product.brand || product.size || product.details || product.description || (product.features && product.features.length > 0)) && (
                            <div className="text-center text-muted-foreground">لا توجد مواصفات متوفرة</div>
                        )}
                    </div>


                    {/* Actions */}
                    <div className="flex flex-row sm:flex-row gap-3 pt-4 mt-auto items-center justify-center">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center justify-center gap-2 font-semibold text-base border-primary hover:bg-primary/10 focus:ring-2 focus:ring-primary"
                            aria-label="مشاركة رابط المنتج"
                            onClick={async () => {
                                const shareUrl = `${window.location.origin}/product/${product.slug}`;
                                if (typeof navigator !== 'undefined' && navigator.share) {
                                    try {
                                        await navigator.share({ title: product.name, text: product.name, url: shareUrl });
                                        toast.success('تمت المشاركة بنجاح');
                                    } catch {
                                        /* مشاركة ملغاة */
                                    }
                                } else {
                                    if (navigator.clipboard && window.isSecureContext) {
                                        await navigator.clipboard.writeText(shareUrl);
                                        toast.success('تم نسخ رابط المنتج');
                                    } else {
                                        const textArea = document.createElement('textarea');
                                        textArea.value = shareUrl;
                                        textArea.style.position = 'fixed';
                                        textArea.style.opacity = '0';
                                        document.body.appendChild(textArea);
                                        textArea.select();
                                        try { document.execCommand('copy'); toast.success('تم نسخ رابط المنتج'); } catch { }
                                        document.body.removeChild(textArea);
                                    }
                                }
                            }}
                        >
                            <Icon name="Share2" size="sm" />
                        </Button>
                        <Link
                            href={`/product/${product.slug}`}
                            className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary/90 text-primary-foreground px-4 py-2 text-base font-semibold shadow hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary transition"
                            aria-label="عرض التفاصيل الكاملة للمنتج"
                        >
                            <Icon name="Eye" size="sm" /> صفحة المنتج ↗
                        </Link>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
} 