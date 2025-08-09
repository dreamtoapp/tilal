import { Info } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import db from '@/lib/prisma';
import { PageProps } from '@/types/commonTypes';
import { categoryIncludeRelation } from '@/types/databaseTypes';

const getCategory = async (categoryId: string) => {
  return await db.category.findUnique({
    where: { id: categoryId },
    include: categoryIncludeRelation,
  });
};

export default async function CategoryDetails({ params }: PageProps<{ id: string }>) {
  const { id } = await params;
  const category = await getCategory(id);
  if (!category) return notFound();

  return (
    <div dir="rtl" className="space-y-6 p-4">

      {/* بطاقة التصنيف */}
      <Card className="p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative w-32 h-32 rounded-md overflow-hidden border">
          <Image
            src={category.imageUrl || "/placeholder.svg"}
            alt={category.name}
            fill
            className="object-cover"
          />
        </div>
        <div className='flex flex-col'>
          <h2 className="text-2xl font-bold text-primary text-center sm:text-right">{category.name}</h2>
          {category.description && (
            <p className="mt-2 text-sm text-muted-foreground text-center sm:text-right">
              {category.description}
            </p>
          )}
        </div>
      </Card>

      {/* المنتجات */}
      {category.productAssignments && category.productAssignments.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {category.productAssignments.map((product) => (
            <Card
              key={product.id}
              className="relative overflow-hidden rounded-2xl shadow-md group transition-shadow hover:shadow-xl"
            >
              <div className="relative h-72">
                <Image
                  src={product.product.imageUrl ?? "/placeholder.svg"}
                  alt={product.product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10" />
                <div className="absolute top-3 right-3 z-20 flex flex-wrap gap-2">
                  <Badge className="bg-background text-foreground border">{product.product.brand}</Badge>
                  {product.product.outOfStock ? (
                    <Badge variant="destructive">غير متوفر</Badge>
                  ) : product.product.stockQuantity ? (
                    <Badge variant="default">المتوفر: {product.product.stockQuantity}</Badge>
                  ) : null}
                </div>
              </div>

              <div className="relative z-20 p-4 bg-background space-y-2">
                <h3 className="text-lg font-semibold text-foreground">{product.product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.product.material} • {product.product.color} • {product.product.size}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">
                    {product.product.price.toLocaleString()} ر.س
                  </span>
                  {product.product.compareAtPrice && (
                    <span className="text-sm line-through text-muted-foreground">
                      {product.product.compareAtPrice.toLocaleString()} ر.س
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {product.product.tags?.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>

                {product.product.details && (
                  <details className="pt-2 text-sm text-muted-foreground">
                    <summary className="cursor-pointer">تفاصيل المنتج</summary>
                    <div className="pt-2 whitespace-pre-line">{product.product.details}</div>
                    <div className="pt-2 text-xs space-y-1">
                      {product.product.careInstructions && <p><strong>العناية:</strong> {product.product.careInstructions}</p>}
                      {product.product.weight && <p><strong>الوزن:</strong> {product.product.weight}</p>}
                      {product.product.dimensions && <p><strong>الأبعاد:</strong> {product.product.dimensions}</p>}
                      {product.product.shippingDays && <p><strong>أيام الشحن:</strong> {product.product.shippingDays} يوم</p>}
                      {product.product.returnPeriodDays && <p><strong>مدة الإرجاع:</strong> {product.product.returnPeriodDays} يوم</p>}
                    </div>
                  </details>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Alert className="border border-border bg-muted/50 text-muted-foreground shadow-sm">
          <Info className="h-5 w-5" />
          <AlertTitle>لا توجد منتجات</AlertTitle>
          <AlertDescription>
            لا يحتوي هذا التصنيف على منتجات حالياً. يرجى التحقق لاحقًا أو استكشاف تصنيفات أخرى.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
