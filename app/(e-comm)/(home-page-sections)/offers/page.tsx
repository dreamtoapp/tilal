import { Metadata } from 'next';
import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { getOffers } from './actions/getOffers';
import OfferCard from './components/OfferCard';

export const metadata: Metadata = {
  title: 'العروض المميزة | متجر الأزياء',
  description: 'اكتشف أحدث العروض والخصومات على منتجاتنا المميزة'
};

export default async function OffersPage() {
  const offers = await getOffers();
  const featuredOffer = offers[0]; // First offer gets featured treatment
  const remainingOffers = offers.slice(1); // Rest of the offers

  return (
    <div className="container mx-auto bg-background px-4 py-8 text-foreground">


      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-3xl font-bold md:text-4xl lg:text-5xl">
          العروض المميزة
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          اكتشف أحدث العروض والخصومات على منتجاتنا المميزة لتجربة تسوق استثنائية
        </p>
        <div className="mt-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            {offers.length} عرض نشط
          </Badge>
        </div>
      </div>

      {/* Featured Offer */}
      {featuredOffer && (
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">العرض المميز</h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-12">
              <OfferCard offer={featuredOffer} isFeatured={true} />
            </div>
          </div>
        </div>
      )}

      {/* Remaining Offers */}
      {remainingOffers.length > 0 && (
        <div>
          <h2 className="mb-6 text-2xl font-bold">جميع العروض</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {remainingOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {offers.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">لا توجد عروض حالياً</h2>
          <p className="text-muted-foreground mb-6">
            تحقق من العروض لاحقاً أو تصفح منتجاتنا المميزة
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            العودة للرئيسية
          </Link>
        </div>
      )}
    </div>
  );
}
