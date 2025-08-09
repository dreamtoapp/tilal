'use client';

import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    imageUrl?: string;
    price?: number;
    category?: string;
    supplier?: string;
    outOfStock: boolean;
}

export default function ProductInfo({ product }: { product: Product }) {
    if (!product) return null;

    return (
        <article className='flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-1 shadow-sm'> {/* Updated border and bg */}
            {product.imageUrl && (
                <div className="relative h-10 w-10 rounded border-border overflow-hidden"> {/* Updated border */}
                    <Image
                        src={product.imageUrl}
                        alt={product.name || 'Product image'}
                        fill
                        sizes="(max-width: 640px) 40px, 40px"
                        className='object-cover'
                        loading='lazy'
                    />
                </div>
            )}

            <div className='flex flex-col flex-1'>
                <h2 className='text-lg font-semibold text-primary'>{product.name}</h2>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
                    <InfoItem label="ID" value={product.id} />
                    <InfoItem label="السعر" value={product.price ? `${product.price} ريال` : undefined} />
                    <InfoItem label="التصنيف" value={product.category} />
                    <InfoItem label="المورد" value={product.supplier} />
                </dl>
            </div>

            <AvailabilityBadge available={!product.outOfStock} />
        </article>
    );
}

function InfoItem({ label, value }: { label: string; value?: string | number }) {
    if (!value) return null;

    return (
        <div className="text-xs text-muted-foreground">
            <dt className="inline font-medium">{label}:</dt>
            <dd className="inline"> {value}</dd>
        </div>
    );
}

function AvailabilityBadge({ available }: { available: boolean }) {
    return (
        <span
            role="status"
            aria-live="polite"
            // Using more theme-consistent badge colors, similar to 'published' status
            // You might want to create specific badge variants in your UI library for these
            className={`rounded px-2 py-1 text-xs font-bold ${available
                ? 'bg-emerald-600 text-white' // Or e.g., bg-success text-success-foreground
                : 'bg-destructive text-destructive-foreground' // Or e.g., bg-error text-error-foreground
                }`}
        >
            {available ? 'متوفر' : 'غير متوفر'}
        </span>
    );
} 