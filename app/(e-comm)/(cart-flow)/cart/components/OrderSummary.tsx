import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from '@/components/link';
import { useRouter } from 'next/navigation';
import { useCheckIsLogin } from '@/hooks/use-check-islogin';

// Types
type GuestCartItem = { product: any; quantity: number };
type ServerCartItem = { id: string; product: any; quantity: number };

interface OrderSummaryProps {
  items: (ServerCartItem | GuestCartItem)[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  taxPercentage: number;
  onCheckout: () => void;
  showLoginDialog: boolean;
  setShowLoginDialog: (show: boolean) => void;
}

// Free Shipping Banner Component
function FreeShippingBanner({ subtotal }: { subtotal: number }) {
  if (subtotal >= 100) return null;

  return (
    <div className="text-xs text-feature-commerce bg-feature-commerce-soft p-3 rounded-lg border border-feature-commerce/20">
      أضف {(100 - subtotal).toLocaleString()} ر.س للحصول على شحن مجاني
    </div>
  );
}

// Order Details Component
function OrderDetails({
  items,
  subtotal,
  shipping,
  tax,
  taxPercentage
}: {
  items: (ServerCartItem | GuestCartItem)[];
  subtotal: number;
  shipping: number;
  tax: number;
  taxPercentage: number;
}) {
  return (
    <div className="space-y-3 text-sm">

      <div className="flex justify-between">
        <span className="text-muted-foreground">المجموع الفرعي ({items.length} منتج)</span>
        <span className="font-medium text-foreground">{subtotal.toLocaleString()} ر.س</span>
      </div>

      <div className="flex justify-between">
        <span className="text-muted-foreground">ضريبة القيمة المضافة ({taxPercentage}%)</span>
        <span className="font-medium text-foreground">{tax.toFixed(2)} ر.س</span>
      </div>

      <div className="flex justify-between">
        <span className="flex items-center gap-1 text-muted-foreground">
          الشحن
          {shipping === 0 && <span className="text-xs bg-feature-commerce-soft text-feature-commerce px-2 py-0.5 rounded-full">مجاني</span>}
        </span>
        <span className="font-medium text-foreground">
          {shipping === 0 ? 'مجاني' : `${shipping} ر.س`}
        </span>
      </div>





      <FreeShippingBanner subtotal={subtotal} />
    </div>
  );
}

// Total Amount Component
function TotalAmount({ total }: { total: number }) {
  return (
    <div className="border-t border-feature-commerce/20 pt-4">
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-foreground">الإجمالي</span>
        <span className="text-2xl font-bold text-feature-commerce">{total.toLocaleString()} ر.س</span>
      </div>
    </div>
  );
}

// Action Buttons Component
function ActionButtons({
  onCheckout,

}: {
  onCheckout: () => void;
  showLoginDialog: boolean;
  setShowLoginDialog: (show: boolean) => void;
}) {
  const { isAuthenticated } = useCheckIsLogin();
  const router = useRouter();

  return (
    <div className="space-y-3 pt-2">
      {/* Login requirement banner for non-authenticated users */}
      {!isAuthenticated && (
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-muted">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-feature-commerce">🔐</span>
            <span className="font-medium">تسجيل الدخول مطلوب</span>
          </div>
          <p>سجل دخولك لإتمام الطلب وحفظ سلة التسوق</p>
        </div>
      )}

      {/* Checkout button - direct navigation for non-authenticated users */}
      {isAuthenticated ? (
        <Button
          className="w-full btn-save text-lg py-3 h-12"
          onClick={onCheckout}
        >
          متابعة للدفع
        </Button>
      ) : (
        <Button
          asChild
          className="w-full btn-save text-lg py-3 h-12"
          onClick={() => router.push('/auth/login')}
        >
          <Link href="/auth/login">تسجيل الدخول للدفع</Link>
        </Button>
      )}

      <Button asChild variant="outline" className="w-full border-feature-commerce text-feature-commerce hover:bg-feature-commerce-soft">
        <Link href="/">متابعة التسوق</Link>
      </Button>
    </div>
  );
}

// Main Order Summary Component
export default function OrderSummary({
  items,
  subtotal,
  shipping,
  tax,
  total,
  taxPercentage,
  onCheckout,
  showLoginDialog,
  setShowLoginDialog
}: OrderSummaryProps) {
  return (
    <div className="sticky top-4">
      <Card className="shadow-lg border-l-4 border-feature-commerce">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-feature-commerce">ملخص الطلب</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <OrderDetails
            items={items}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            taxPercentage={taxPercentage}
          />
          <TotalAmount total={total} />
          <ActionButtons
            onCheckout={onCheckout}
            showLoginDialog={showLoginDialog}
            setShowLoginDialog={setShowLoginDialog}
          />
        </CardContent>
      </Card>
    </div>
  );
} 