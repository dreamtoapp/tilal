import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from '@/components/link';

export default function EmptyCart() {
  return (
    <Card className="shadow-lg border-l-4 border-feature-commerce">
      <CardContent className="py-12">
        <div className="text-center text-muted-foreground flex flex-col gap-6">
          <div className="w-24 h-24 mx-auto bg-feature-commerce-soft rounded-full flex items-center justify-center">
            <ShoppingCart className="h-12 w-12 text-feature-commerce" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">سلتك فارغة</h3>
            <p className="text-sm text-muted-foreground mb-6">ابدأ التسوق واكتشف منتجاتنا المميزة</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <Button asChild className="btn-view flex-1">
              <Link href="/">تصفح المنتجات</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 border-feature-commerce text-feature-commerce hover:bg-feature-commerce-soft">
              <Link href="/categories">تصفح الفئات</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 