import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ProductCardAdapter from '@/app/(e-comm)/(home-page-sections)/product/cards/ProductCardAdapter';

import { getOfferWithProducts } from '../actions/getOfferWithProducts';
import { PageProps } from '@/types/commonTypes';

export async function generateMetadata({ params }: PageProps<{ slug: string }>): Promise<Metadata> {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const offer = await getOfferWithProducts(slug);
    if (!offer || !offer.offer) {
        return { title: 'العرض غير موجود' };
    }
    return {
        title: offer.offer.name,
        description: offer.offer.description || `تصفح المنتجات ضمن عرض ${offer.offer.name}`,
        openGraph: {
            title: offer.offer.name,
            description: offer.offer.description || `تصفح المنتجات ضمن عرض ${offer.offer.name}`,
            images: offer.offer.bannerImage ? [{ url: offer.offer.bannerImage, alt: offer.offer.name }] : [],
        },
    };
}

export default async function OfferPage({ params }: PageProps<{ slug: string }>) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const data = await getOfferWithProducts(slug);
    if (!data || !data.offer) notFound();
    const { offer, products } = data;

    return (
        <div className="container mx-auto bg-background px-4 py-8 text-foreground">
            <Card className="shadow-lg border-l-4 border-feature-commerce card-hover-effect card-border-glow mt-6">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <ShoppingCart className="h-5 w-5 text-feature-commerce icon-enhanced" />
                        {offer.name}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-6">
                        {offer.bannerImage && (
                            <div className="relative w-full md:w-1/3 h-48 md:h-64 rounded-lg overflow-hidden">
                                <Image
                                    src={offer.bannerImage}
                                    alt={offer.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    priority
                                />
                            </div>
                        )}
                        <div className="flex-1 flex flex-col gap-2">
                            {offer.header && <h2 className="text-2xl font-bold">{offer.header}</h2>}
                            {offer.subheader && <p className="text-muted-foreground">{offer.subheader}</p>}
                            {offer.description && <p className="mt-2">{offer.description}</p>}
                            <div className="flex items-center gap-4 mt-2">
                                {offer.hasDiscount && offer.discountPercentage ? (
                                    <span className="rounded bg-feature-commerce-soft px-3 py-1 text-feature-commerce font-semibold">
                                        خصم {offer.discountPercentage}%
                                    </span>
                                ) : (
                                    <span className="rounded bg-muted px-3 py-1 text-muted-foreground">بدون خصم</span>
                                )}
                                <span className={`rounded px-3 py-1 font-semibold ${offer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {offer.isActive ? 'نشط' : 'غير نشط'}
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground mt-1">ترتيب العرض: {offer.displayOrder}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <h2 className="mt-12 mb-2 text-2xl font-bold">المنتجات ضمن العرض</h2>
            <div className="mb-6 text-muted-foreground text-sm font-medium">عدد المنتجات: {products.length}</div>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product: any, idx: number) => (
                        <div key={product.id} className="product-card">
                            <ProductCardAdapter
                                product={product}
                                discountPercentage={offer.hasDiscount && offer.discountPercentage !== null ? offer.discountPercentage : undefined}
                                index={idx}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-12">لا توجد منتجات مرتبطة بهذا العرض حالياً.</div>
            )}
        </div>
    );
} 