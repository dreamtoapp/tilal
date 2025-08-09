import { notFound } from 'next/navigation';
import { Icon } from '@/components/icons/Icon';
import ProductUpsert from '../../new/components/ProductUpsert';
import { getProductFormData } from '../../new/actions/getProductData';
import db from '@/lib/prisma';

interface EditProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getProduct(id: string) {
    try {
        const product = await db.product.findUnique({
            where: { id },
            include: {
                supplier: true,
                categoryAssignments: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        return product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    // Await params first according to Next.js 15 requirements
    const { id } = await params;

    // Fetch product data and form options (categories, suppliers)
    const [product, formData] = await Promise.all([
        getProduct(id),
        getProductFormData()
    ]);

    if (!product) {
        notFound();
    }

    // Transform product data to match form structure
    const defaultValues = {
        id: product.id,
        name: product.name,
        description: product.details || '',
        price: product.price,
        supplierId: product.supplierId,
        categoryIds: product.categoryAssignments.map(ca => ca.categoryId),
        published: product.published,
        outOfStock: product.outOfStock,
        requiresShipping: product.requiresShipping,
        hasQualityGuarantee: product.hasQualityGuarantee,
        manageInventory: product.manageInventory,
    };

    return (
        <div className="container mx-auto py-8 px-4 md:px-6" dir="rtl">
            {/* Header with BackButton and Title in same row */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Icon name="Edit3" className="h-6 w-6 text-feature-products icon-enhanced" />
                        <h1 className="text-2xl font-bold text-primary">تعديل المنتج</h1>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <p className="text-sm text-muted-foreground">
                    قم بتحديث معلومات المنتج &quot;{product.name}&quot;. الحقول المطلوبة مشار إليها بعلامة (*).
                </p>
            </div>

            <ProductUpsert
                mode="update"
                defaultValues={defaultValues}
                categories={formData.categories}
                suppliers={formData.suppliers}
            />
        </div>
    );
} 