import Image from 'next/image';
import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Percent } from 'lucide-react';
import type { Offer } from '../actions/getOffers';

interface OfferCardProps {
  offer: Offer;
  isFeatured?: boolean;
}

export default function OfferCard({ offer, isFeatured = false }: OfferCardProps) {
  const fallbackImage = '/fallback/fallback.avif';
  const hasValidImage = offer.bannerImage &&
    (offer.bannerImage.startsWith('/') || offer.bannerImage.startsWith('http'));

  const imageUrl = hasValidImage ? offer.bannerImage! : fallbackImage;

  return (
    <Link href={`/offers/${offer.slug}`}>
      <Card className={`
        group overflow-hidden transition-all duration-300 hover:shadow-lg
        ${isFeatured ? 'col-span-full md:col-span-2' : ''}
      `}>
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={imageUrl}
            alt={offer.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"}
          />

          {/* Discount Badge */}
          {offer.hasDiscount && offer.discountPercentage && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-destructive text-destructive-foreground font-bold">
                <Percent className="w-3 h-3 mr-1" />
                {offer.discountPercentage}% خصم
              </Badge>
            </div>
          )}

          {/* Product Count Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-black/70 text-white">
              <Package className="w-3 h-3 mr-1" />
              {offer._count?.productAssignments || 0} منتج
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
            {offer.name}
          </h3>
          {offer.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {offer.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              عرض مميز
            </span>
            <span className="text-sm font-medium text-primary">
              عرض التفاصيل
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 