import React from 'react';
import { Package, Percent, Eye, EyeOff, Edit3 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from '@/components/link';
import AddImage from '@/components/AddImage';

import type { Offer } from '../actions/get-offers';
import { ToggleOfferStatus } from './ToggleOfferStatus';
import { DeleteOfferAlert } from './DeleteOfferAlert';

interface OfferCardProps {
    offer: Offer;
}

const OfferStatusBadge = ({ offer }: { offer: Offer }) => (
    <Badge
        variant={offer.isActive ? 'default' : 'secondary'}
        className={`absolute left-3 top-3 w-fit shadow-lg backdrop-blur-sm ${offer.isActive
            ? 'bg-feature-commerce/90 text-white border-feature-commerce/70'
            : 'bg-muted/90 text-muted-foreground border-muted-foreground/30'
            }`}
    >
        {offer.isActive ? (
            <div className="flex items-center gap-2 px-1 py-0.5">
                <Eye size={14} />
                <span className="font-medium">نشط</span>
            </div>
        ) : (
            <div className="flex items-center gap-2 px-1 py-0.5">
                <EyeOff size={14} />
                <span className="font-medium">غير نشط</span>
            </div>
        )}
    </Badge>
);

const DiscountBadge = ({ offer }: { offer: Offer }) => {
    if (!offer.hasDiscount || !offer.discountPercentage) return null;

    return (
        <Badge className="absolute right-3 bottom-3 bg-feature-commerce/90 text-white shadow-lg border-feature-commerce/70 backdrop-blur-sm hover:bg-feature-commerce transition-colors">
            <div className="flex items-center gap-2 px-1 py-0.5">
                <Percent size={14} />
                <span className="font-semibold">{offer.discountPercentage}% خصم</span>
            </div>
        </Badge>
    );
};

const OfferBanner = ({ offer }: { offer: Offer }) => (
    <div className="relative h-48 w-full overflow-hidden rounded-xl border border-feature-commerce/30 shadow-lg">
        <AddImage
            url={offer.bannerImage || undefined}
            recordId={offer.id}
            table="offer"
            tableField="bannerImage"
            autoUpload={true}
            className="w-full h-full"
            alt={`صورة بانر العرض - ${offer.name}`}
        />
        <OfferStatusBadge offer={offer} />
        <DiscountBadge offer={offer} />
    </div>
);

const OfferInfo = ({ offer }: { offer: Offer }) => (
    <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
                {offer.header && (
                    <h3 className="font-bold text-lg text-feature-commerce mb-1 line-clamp-1 leading-tight">{offer.header}</h3>
                )}
                {offer.subheader && (
                    <div className="text-sm text-feature-commerce/80 mb-1 line-clamp-1 leading-tight">{offer.subheader}</div>
                )}
                <h3 className="font-bold text-xl text-foreground mb-2 line-clamp-2 leading-tight">{offer.name}</h3>
                {offer.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {offer.description}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-1 text-sm text-feature-products bg-feature-products-soft px-3 py-2 rounded-lg border border-feature-products/20 shadow-sm">
                <Package size={16} />
                <span className="font-semibold">{offer._count?.productAssignments || 0}</span>
                <span className="font-medium">منتج</span>
            </div>
        </div>

        <div className="flex items-center gap-3 text-sm flex-wrap">
            <div className="flex items-center gap-2 text-feature-settings bg-feature-settings-soft px-3 py-2 rounded-lg border border-feature-settings/20">
                <span className="font-medium">الترتيب:</span>
                <span className="font-semibold">{offer.displayOrder}</span>
            </div>
            {offer.hasDiscount && (
                <div className="flex items-center gap-2 text-feature-commerce bg-feature-commerce-soft px-3 py-2 rounded-lg border border-feature-commerce/20 shadow-sm">
                    <Percent size={14} />
                    <span className="font-semibold">خصم {offer.discountPercentage}%</span>
                </div>
            )}
        </div>
    </div>
);

const ActionButtons = ({ offer }: { offer: Offer }) => (
    <div className="flex items-center gap-3">
        {/* View/Manage Products */}
        <Link
            href={`/dashboard/management-offer/manage/${offer.id}`}
            className="flex-1"
        >
            <Button variant="outline" size="default" className="btn-view-outline w-full hover:bg-feature-products-soft hover:border-feature-products transition-colors">
                <Package size={16} />
                إدارة المنتجات
            </Button>
        </Link>

        {/* Edit */}
        <Link href={`/dashboard/management-offer/edit/${offer.id}`}>
            <Button variant="outline" size="default" className="btn-edit hover:shadow-md transition-all px-4">
                <Edit3 size={16} />
                تعديل
            </Button>
        </Link>

        {/* Toggle Status */}
        <ToggleOfferStatus offer={offer} />

        {/* Delete */}
        <DeleteOfferAlert offerId={offer.id} />
    </div>
);

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
    return (
        <Card className={`
      group flex h-full flex-col overflow-hidden 
      transition-all duration-300 hover:shadow-xl card-hover-effect card-border-glow
      ${offer.isActive
                ? 'border-l-4 border-l-feature-commerce bg-card'
                : 'border-l-4 border-l-muted opacity-75 bg-card'
            }
    `}>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Package className={`h-5 w-5 icon-enhanced ${offer.isActive ? 'text-feature-commerce' : 'text-muted-foreground'}`} />
                    <span className={`font-bold ${offer.isActive ? 'text-feature-commerce' : 'text-muted-foreground'}`}>
                        مجموعة منتجات
                    </span>
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 p-4">
                {/* Enhanced Layout: Banner takes full width, info below */}
                <div className="space-y-6">
                    <OfferBanner offer={offer} />
                    <OfferInfo offer={offer} />
                </div>
            </CardContent>

            <Separator className="bg-border" />

            <CardFooter className="bg-muted/30 p-4">
                <ActionButtons offer={offer} />
            </CardFooter>
        </Card>
    );
};

OfferCard.displayName = 'OfferCard';
export default OfferCard; 