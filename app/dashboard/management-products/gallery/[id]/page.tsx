import { Suspense } from 'react';
import { Icon } from '@/components/icons/Icon';
import ProductGalleryManager from './components/ProductGalleryManager';
import GalleryManagerSkeleton from './components/GalleryManagerSkeleton';
import prisma from '@/lib/prisma';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductGalleryPage({ params }: PageProps) {
    const { id } = await params;

    try {
        const product = await prisma.product.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                imageUrl: true,
                images: true,
            }
        });

        if (!product) {
            return (
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-destructive">المنتج غير موجود</h1>
                            <p className="text-muted-foreground">لم يتم العثور على المنتج المطلوب</p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Icon name="Images" className="h-6 w-6 text-feature-products icon-enhanced" />
                            معرض صور المنتج
                        </h1>
                        <p className="text-muted-foreground">{product.name}</p>
                    </div>
                </div>

                {/* Gallery Manager */}
                <Suspense fallback={<GalleryManagerSkeleton />}>
                    <ProductGalleryManager product={product} />
                </Suspense>
            </div>
        );
    } catch (error) {
        console.error('Error loading product:', error);
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-destructive">خطأ في تحميل المنتج</h1>
                        <p className="text-muted-foreground">حدث خطأ أثناء تحميل بيانات المنتج</p>
                    </div>
                </div>
            </div>
        );
    }
} 