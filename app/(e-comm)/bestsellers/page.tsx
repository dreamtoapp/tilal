import { getBestSellers } from './actions/getBestSellers';
import { Icon } from '@/components/icons/Icon';
import BestSellerProductCard from './compnents/BestSellerProductCard';

export default async function BestSellersPage() {
    const { products } = await getBestSellers({ page: 1, limit: 12 });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Icon name="Flame" className="text-orange-500" />
                المنتجات الأكثر مبيعًا
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {products
                    .filter((product): product is NonNullable<typeof product> => !!product)
                    .map((product, idx) => (
                        <BestSellerProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            slug={product.slug}
                            price={product.price}
                            imageUrl={product.imageUrl || ''}
                            salesCount={typeof product.salesCount === 'number' ? product.salesCount : 0}
                            rank={idx}
                        />
                    ))}
            </div>
        </div>
    );
} 