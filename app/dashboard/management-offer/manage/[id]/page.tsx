import { notFound } from 'next/navigation';
import { Package, Settings } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getOfferById, getAllProducts } from '../../actions';
import { AssignedProducts } from '../../components/AssignedProducts';
import { ProductSelector } from '../../components/ProductSelector';
import { OfferBannerUpload } from '../../components/OfferBannerUpload';

interface ManageOfferPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ManageOfferPage({ params }: ManageOfferPageProps) {
    // Await the params Promise
    const { id } = await params;

    // Fetch offer and products data in parallel
    const [offer, allProducts] = await Promise.all([
        getOfferById(id).catch(() => null),
        getAllProducts().catch(() => [])
    ]);

    if (!offer) {
        notFound();
    }

    // Get assigned product IDs for filtering
    const assignedProductIds = offer.productAssignments?.map(assignment => assignment.product.id) || [];

    return (
        <div className="flex min-h-screen flex-col">
            {/* Enhanced Header */}
            <header className="sticky top-0 z-10 border-b border-border bg-background p-4 shadow-sm md:p-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Settings className="h-6 w-6 text-feature-products" />
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">إدارة المنتجات</h1>
                            <p className="text-sm text-muted-foreground">
                                مجموعة: {offer.name}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 space-y-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Banner Upload Section */}
                    <OfferBannerUpload
                        offerId={offer.id}
                        offerName={offer.name}
                        currentBannerUrl={offer.bannerImage}
                    />

                    {/* Offer Info Card */}
                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-feature-commerce/10 rounded-lg">
                                    <Package className="h-6 w-6 text-feature-commerce" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-foreground">{offer.name}</h2>
                                    {offer.description && (
                                        <p className="text-sm text-muted-foreground mt-1">{offer.description}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="text-center">
                                    <p className="font-semibold text-feature-products">
                                        {offer.productAssignments?.length || 0}
                                    </p>
                                    <p className="text-muted-foreground">منتج</p>
                                </div>
                                {offer.hasDiscount && offer.discountPercentage && (
                                    <div className="text-center">
                                        <p className="font-semibold text-feature-commerce">
                                            {offer.discountPercentage}%
                                        </p>
                                        <p className="text-muted-foreground">خصم</p>
                                    </div>
                                )}
                                <div className="text-center">
                                    <p className={`font-semibold ${offer.isActive ? 'text-green-600' : 'text-muted-foreground'}`}>
                                        {offer.isActive ? 'نشط' : 'غير نشط'}
                                    </p>
                                    <p className="text-muted-foreground">الحالة</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Current Products */}
                    <AssignedProducts
                        offerId={offer.id}
                        offerName={offer.name}
                        assignedProducts={offer.productAssignments || []}
                        hasDiscount={offer.hasDiscount}
                        discountPercentage={offer.discountPercentage}
                    />

                    <Separator className="my-8" />

                    {/* Add Products */}
                    <ProductSelector
                        offerId={offer.id}
                        offerName={offer.name}
                        availableProducts={allProducts}
                        assignedProductIds={assignedProductIds}
                    />
                </div>
            </main>
        </div>
    );
} 