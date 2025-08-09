import { notFound } from 'next/navigation';
import { PageProps } from '@/types/commonTypes';
import { Icon } from '@/components/icons/Icon';
import db from '@/lib/prisma';
import ProductViewContent from './product-view-content';

async function getFullProductDetails(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        supplier: true,
        categoryAssignments: {
          include: { category: true },
        },
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return product;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    throw new Error('Failed to load product data');
  }
}

export default async function ProductViewPage({ params }: PageProps<{ id: string }>) {
  try {
    // Resolve params promise
    const { id } = await params;

    // Fetch product data
    const product = await getFullProductDetails(id);

    if (!product) {
      notFound();
    }

    // Calculate statistics
    const totalReviews = product.reviews.length;
    const averageRating = totalReviews > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    const productWithStats = {
      ...product,
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviewCount: totalReviews,
    };

    return (
      <div className="container mx-auto py-8 px-4 md:px-6" dir="rtl">
        {/* Header with BackButton and Title in same row */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Icon name="Eye" className="h-6 w-6 text-feature-analytics icon-enhanced" />
              <h1 className="text-2xl font-bold text-primary md:text-3xl">
                تفاصيل المنتج: {product.name}
              </h1>
            </div>
          </div>
        </div>

        <ProductViewContent product={productWithStats} />
      </div>
    );
  } catch (error) {
    console.error('Error loading product:', error);

    return (
      <div className="container mx-auto py-8 px-4 md:px-6" dir="rtl">
        {/* Header with BackButton and Title in same row - Error State */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Icon name="Eye" className="h-6 w-6 text-destructive icon-enhanced" />
              <h1 className="text-2xl font-bold text-destructive">خطأ في تحميل المنتج</h1>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-red-700 mb-2">
            حدث خطأ أثناء تحميل بيانات المنتج
          </h3>
          <p className="text-red-600">
            يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالدعم الفني.
          </p>
        </div>
      </div>
    );
  }
}