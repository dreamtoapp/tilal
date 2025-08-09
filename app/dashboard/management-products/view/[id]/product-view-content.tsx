'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge'; // Assuming you have a Badge component
import { Separator } from '@/components/ui/separator'; // Assuming Separator
import { Icon } from '@/components/icons/Icon';
import { Product as FullProductType } from '@prisma/client'; // For full product type with relations
import { User as PrismaUser } from '@prisma/client';
import { Review as PrismaReview } from '@prisma/client';
import { Category as PrismaCategory } from '@prisma/client';
import { Supplier as PrismaSupplier } from '@prisma/client';

// Define more specific types for related data if not using Prisma types directly
interface ReviewWithUser extends PrismaReview {
  user: Pick<PrismaUser, 'name' | 'image'> | null;
}

interface CategoryAssignmentWithCategory {
  category: PrismaCategory;
}

interface ProductForView extends Omit<FullProductType, 'reviews' | 'categoryAssignments' | 'supplier'> {
  reviews: ReviewWithUser[];
  categoryAssignments: CategoryAssignmentWithCategory[];
  supplier: PrismaSupplier | null;
  averageRating: number;
  reviewCount: number;
}

interface ProductViewContentProps {
  product: ProductForView;
}

// Helper to format dates


export default function ProductViewContent({ product }: ProductViewContentProps) {
  const filledStarColor = "text-yellow-500 fill-yellow-500";
  const emptyStarColor = "text-muted-foreground fill-muted";

  return (
    <div className="grid md:grid-cols-3 gap-8 lg:gap-12 items-start">
      {/* Left Column: Image and Gallery */}
      <div className="md:col-span-1 grid gap-4">
        {product.imageUrl && (
          <div className="aspect-square relative border border-border rounded-lg overflow-hidden shadow-md">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        {product.images && product.images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-2">
            {product.images.map((imgUrl, index) => (
              <div key={index} className="aspect-square relative border border-border rounded-md overflow-hidden shadow-sm">
                <Image
                  src={imgUrl}
                  alt={`${product.name} gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Middle Column: Main Info, Price, Specs */}
      <div className="md:col-span-1 grid gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
          {product.supplier && (
            <p className="text-sm text-muted-foreground mb-1">
              المورد: <span className="font-medium text-foreground">{product.supplier.name}</span>
            </p>
          )}
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                name="Star"
                className={`w-5 h-5 ${star <= product.averageRating ? filledStarColor : emptyStarColor}`}
              />
            ))}
            <span className="text-sm text-muted-foreground">
              ({product.averageRating.toFixed(1)} من {product.reviewCount} تقييمات)
            </span>
          </div>
          {product.categoryAssignments && product.categoryAssignments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {product.categoryAssignments.map(ca => (
                <Badge key={ca.category.id} variant="secondary">{ca.category.name}</Badge>
              ))}
            </div>
          )}
          <p className="text-foreground/80 text-base leading-relaxed">{product.details}</p>
        </div>

        <Separator />

        <div className="grid gap-2">
          <h3 className="text-lg font-semibold text-foreground">المواصفات</h3>
          {product.brand && <InfoItem label="العلامة التجارية" value={product.brand} />}
          {product.productCode && <InfoItem label="رمز المنتج (SKU)" value={product.productCode} />}
          {product.gtin && <InfoItem label="GTIN" value={product.gtin} />}
          {product.size && <InfoItem label="الحجم" value={product.size} />}
          {product.color && <InfoItem label="اللون" value={product.color} />}
          {product.material && <InfoItem label="الخامة" value={product.material} />}
          {product.dimensions && <InfoItem label="الأبعاد" value={product.dimensions} />}
          {product.weight && <InfoItem label="الوزن" value={product.weight} />}
          {product.features && product.features.length > 0 && (
            <InfoItem label="الميزات" value={product.features.join('، ')} />
          )}
        </div>
      </div>

      {/* Right Column: Price, Stock, Actions (Placeholder) */}
      <div className="md:col-span-1 grid gap-6">
        <div className="rounded-lg border bg-card p-6 shadow-lg">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-bold text-primary">
              {product.price.toLocaleString('ar-EG', { style: 'currency', currency: 'SAR' })}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-lg text-muted-foreground line-through">
                {product.compareAtPrice.toLocaleString('ar-EG', { style: 'currency', currency: 'SAR' })}
              </span>
            )}
          </div>
          {product.costPrice && (
            <p className="text-xs text-muted-foreground">سعر التكلفة: {product.costPrice.toLocaleString('ar-EG', { style: 'currency', currency: 'SAR' })}</p>
          )}

          <Separator className="my-4" />

          <div className="space-y-3">
            <InfoPill icon={<Icon name="Package" size="lg" />} label="حالة المخزون" value={product.outOfStock ? 'غير متوفر' : 'متوفر'} valueClass={product.outOfStock ? 'text-destructive' : 'text-emerald-600'} />
            {product.manageInventory && product.stockQuantity !== null && (
              <InfoPill icon={<Icon name="Info" size="lg" />} label="الكمية المتاحة" value={product.stockQuantity.toString()} />
            )}
            <InfoPill icon={<Icon name="Tag" size="lg" />} label="الحالة" value={product.published ? 'منشور' : 'غير منشور'} valueClass={product.published ? 'text-emerald-600' : 'text-amber-600'} />
            <InfoPill icon={<Icon name="Truck" size="lg" />} label="يتطلب شحن" value={product.requiresShipping ? 'نعم' : 'لا'} />
          </div>

          {/* Placeholder for Add to Cart or other actions if this were a public page */}
        </div>

        {product.careInstructions && (
          <div className="rounded-lg border bg-card p-4 shadow">
            <h4 className="font-semibold mb-1 text-foreground">تعليمات العناية</h4>
            <p className="text-sm text-muted-foreground">{product.careInstructions}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value?: string | number | null }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function InfoPill({ label, value, icon, valueClass }: { label: string; value: string; icon?: React.ReactNode; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span>{label}:</span>
      </div>
      <span className={`font-semibold ${valueClass || 'text-foreground'}`}>{value}</span>
    </div>
  );
}
