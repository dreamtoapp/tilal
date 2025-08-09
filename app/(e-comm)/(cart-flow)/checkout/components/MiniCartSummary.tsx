import {
  ShoppingCart,
  Tag,
  Truck,
  Receipt,
  Percent
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '../../../../../lib/formatCurrency';
import CartItemsToggle from './client/CartItemsToggle';
import { useCartStore } from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/cartStore';

interface PlatformSettings {
  taxPercentage: number;
  shippingFee: number;
  minShipping: number;
}

interface MiniCartSummaryProps {
  platformSettings: PlatformSettings;
}

export default function MiniCartSummary({ platformSettings }: MiniCartSummaryProps) {
  // Use Zustand cart for live updates
  const { cart: zustandCart } = useCartStore();
  const items = Object.values(zustandCart);
  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1), 0);
  const deliveryFee = subtotal >= platformSettings.minShipping ? 0 : platformSettings.shippingFee;
  const taxAmount = subtotal * (platformSettings.taxPercentage / 100); // Tax on subtotal only
  const total = subtotal + deliveryFee + taxAmount;
  const totalItems = items.length; // Count unique products, not total quantity
  const savings = subtotal >= platformSettings.minShipping ? platformSettings.shippingFee : 0; // Show savings if free delivery

  // Handle empty cart
  if (!items.length) {
    return (
      <Card className="shadow-lg border-l-4 border-orange-500">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart className="h-5 w-5 text-orange-500" />
            ملخص الطلب
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">السلة فارغة</p>
            <p className="text-sm text-orange-600">يجب إضافة منتجات للمتابعة</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-l-4 border-feature-commerce card-hover-effect sticky top-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <ShoppingCart className="h-5 w-5 text-feature-commerce icon-enhanced" />
          ملخص الطلب
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-feature-commerce-soft text-feature-commerce">
            {totalItems} منتج
          </Badge>
          {savings > 0 && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              توصيل مجاني!
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pricing Breakdown */}
        <div className="space-y-4">
          {/* Subtotal */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag className="h-4 w-4" />
              <span className="text-sm">الإجمالي الفرعي</span>
            </div>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>

          {/* Delivery Fee */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span className="text-sm">رسوم التوصيل</span>
              {deliveryFee === 0 && (
                <Badge variant="outline" className="text-xs px-1 py-0 border-green-600 text-green-700">
                  مجاني
                </Badge>
              )}
            </div>
            <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
              {deliveryFee === 0 ? (
                <span className="flex items-center gap-1">
                  <span className="line-through text-muted-foreground text-xs">25.00</span>
                  <span className="text-green-600">مجاني</span>
                </span>
              ) : (
                formatCurrency(deliveryFee)
              )}
            </span>
          </div>

          {/* Free Delivery Progress */}
          {deliveryFee > 0 && (
            <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span>أضف {formatCurrency(platformSettings.minShipping - subtotal)}</span>
                  <Badge variant="outline" className="text-xs px-2 py-1 border-blue-600 text-blue-700 whitespace-nowrap">
                    {formatCurrency(platformSettings.minShipping)} الحد الأدنى
                  </Badge>
                </div>
                <span className="text-feature-commerce font-medium">
                  {Math.round((subtotal / platformSettings.minShipping) * 100)}%
                </span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full">
                <div
                  className="bg-feature-commerce h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((subtotal / platformSettings.minShipping) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Tax */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Percent className="h-4 w-4" />
              <span className="text-sm">ضريبة القيمة المضافة ({platformSettings.taxPercentage}%)</span>
            </div>
            <span className="font-medium">{formatCurrency(taxAmount)}</span>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between text-lg font-bold p-3 bg-feature-commerce-soft rounded-lg">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-feature-commerce" />
              <span>الإجمالي النهائي</span>
            </div>
            <span className="text-feature-commerce">{formatCurrency(total)}</span>
          </div>
        </div>

        <Separator />

        {/* Client-side Cart Items Toggle */}
        <CartItemsToggle items={items.map(item => ({ ...item, id: item.product.id }))} />

        {/* Security Notice */}
        <div className="text-xs text-muted-foreground text-center p-3 bg-muted/20 rounded-lg border">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span>🔒</span>
            <span className="font-medium">معاملة آمنة</span>
          </div>
          <span>جميع بياناتك محمية ومشفرة</span>
        </div>
      </CardContent>
    </Card>
  );
}
