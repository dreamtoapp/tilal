import Image from "next/image";
import { notFound } from "next/navigation";
import db from "@/lib/prisma";
import { supplierIncludeRelation } from "@/types/databaseTypes";
import { PageProps } from "@/types/commonTypes";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const getSupplier = async (supplierId: string) => {
  return await db.supplier.findUnique({
    where: { id: supplierId },
    include: supplierIncludeRelation,
  });
};

export default async function SupplierDetails({ params }: PageProps<{ id: string }>) {
  const { id } = await params;
  const supplier = await getSupplier(id);
  if (!supplier) return notFound();

  return (
    <div dir="rtl" className="space-y-6 p-4">

      {/* بطاقة المورّد */}
      <Card className="p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative w-32 h-32 rounded-md overflow-hidden border">
          <Image
            src={supplier.logo || "/placeholder.svg"}
            alt={supplier.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 space-y-2 text-center sm:text-right">
          <h2 className="text-2xl font-bold text-primary">{supplier.name}</h2>
          <p className="text-sm text-muted-foreground">{supplier?.email}</p>
          <div className="text-sm space-y-1 text-muted-foreground">
            {supplier.email && <p><strong>البريد الإلكتروني:</strong> {supplier.email}</p>}
            {supplier.phone && <p><strong>الهاتف:</strong> {supplier.phone}</p>}
          </div>
        </div>
      </Card>

      {/* المنتجات */}
      {supplier.products && supplier.products.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {supplier.products.map((product) => (
            <Card
              key={product.id}
              className="relative overflow-hidden rounded-2xl shadow-md group transition-shadow hover:shadow-xl"
            >
              <div className="relative h-72">
                <Image
                  src={product.imageUrl ?? ""}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10" />
                <div className="absolute top-3 right-3 z-20 flex flex-wrap gap-2">
                  <Badge className="bg-background text-foreground border">{product.brand}</Badge>
                  {product.outOfStock ? (
                    <Badge variant="destructive">غير متوفر</Badge>
                  ) : product.stockQuantity ? (
                    <Badge variant="default">المتوفر: {product.stockQuantity}</Badge>
                  ) : null}
                </div>
              </div>

              <div className="relative z-20 p-4 bg-background space-y-2">
                <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.material} • {product.color} • {product.size}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">
                    {product.price.toLocaleString()} ر.س
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm line-through text-muted-foreground">
                      {product.compareAtPrice.toLocaleString()} ر.س
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {product.tags?.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>

                {product.details && (
                  <details className="pt-2 text-sm text-muted-foreground">
                    <summary className="cursor-pointer">تفاصيل المنتج</summary>
                    <div className="pt-2 whitespace-pre-line">{product.details}</div>
                    <div className="pt-2 text-xs space-y-1">
                      {product.careInstructions && <p><strong>العناية:</strong> {product.careInstructions}</p>}
                      {product.weight && <p><strong>الوزن:</strong> {product.weight}</p>}
                      {product.dimensions && <p><strong>الأبعاد:</strong> {product.dimensions}</p>}
                      {product.shippingDays && <p><strong>أيام الشحن:</strong> {product.shippingDays} يوم</p>}
                      {product.returnPeriodDays && <p><strong>مدة الإرجاع:</strong> {product.returnPeriodDays} يوم</p>}
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
            لم يقم هذا المورّد بإضافة أي منتجات حتى الآن. يرجى التحقق لاحقًا أو استكشاف موردين آخرين.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
