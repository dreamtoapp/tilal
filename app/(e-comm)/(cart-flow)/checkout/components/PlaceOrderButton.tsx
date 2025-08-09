import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CheckCircle } from "lucide-react";
import InfoTooltip from '@/components/InfoTooltip';
import { createDraftOrder } from '../actions/orderActions';
import { UserProfile } from './UserInfoCard';
import { AddressWithDefault } from "./AddressBook";
import { useCartStore } from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/cartStore';

export interface CartItem {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
    } | null;
}

export interface CartData {
    items: CartItem[];
}

interface PlaceOrderButtonProps {
    cart?: CartData;
    user: UserProfile;
    selectedAddress: AddressWithDefault | null;
    shiftId: string;
    paymentMethod: string;
    termsAccepted: boolean;
    platformSettings?: {
        taxPercentage: number;
        shippingFee: number;
        minShipping: number;
    };
}

export default function PlaceOrderButton({ cart, user, selectedAddress, shiftId, paymentMethod, termsAccepted, platformSettings }: PlaceOrderButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Use Zustand cart for real-time updates and discounts
    const { cart: zustandCart } = useCartStore();
    const zustandItems = Object.values(zustandCart);

    // Use Zustand cart if available, otherwise fall back to props cart
    const items = zustandItems.length > 0 ? zustandItems : (cart?.items || []);
    const hasItems = items.length > 0;

    // Calculate subtotal using effective price (includes discounts)
    const subtotal = items.reduce((sum, item) => {
        if (!item.product) return sum;
        const effectivePrice = 'discountedPrice' in item.product ? (item.product as any).discountedPrice : item.product.price || 0;
        return sum + effectivePrice * (item.quantity || 1);
    }, 0);

    const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

    // Calculate total amount with delivery fee and tax (consistent with MiniCartSummary)
    const defaultSettings = { taxPercentage: 15, shippingFee: 25, minShipping: 200 };
    const settings = platformSettings || defaultSettings;
    const deliveryFee = subtotal >= settings.minShipping ? 0 : settings.shippingFee;
    const taxAmount = subtotal * (settings.taxPercentage / 100); // Tax on subtotal only
    const total = subtotal + deliveryFee + taxAmount;

    // Validation: all 3 conditions
    const isAccountActivated = user.isOtp === true;
    const hasValidLocation = selectedAddress && selectedAddress.latitude && selectedAddress.longitude;
    const isValid = hasItems && isAccountActivated && hasValidLocation && termsAccepted;

    // Info message for why the button is disabled
    let infoMessage = '';
    if (!isAccountActivated) infoMessage = 'يرجى تفعيل الحساب أولاً';
    else if (!hasValidLocation) infoMessage = 'يرجى تحديد موقع العنوان';
    else if (!termsAccepted) infoMessage = 'يجب الموافقة على الشروط والأحكام';
    else if (!hasItems) infoMessage = 'يجب إضافة منتجات للسلة أولاً';

    // Simple sync function
    const syncZustandToDatabase = async () => {
        try {
            const { syncZustandQuantityToDatabase } = await import('@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions');

            // Sync all Zustand items to database (replaces quantities, doesn't add)
            for (const [productId, item] of Object.entries(zustandCart)) {
                await syncZustandQuantityToDatabase(productId, item.quantity);
            }

            console.log('✅ Zustand cart synced to database');
        } catch (error) {
            console.error('❌ Failed to sync Zustand to database:', error);
            throw new Error('فشل في مزامنة السلة مع قاعدة البيانات');
        }
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError(null);

        // Frontend validation for shiftId
        if (!shiftId) {
            setError('يرجى اختيار وقت التوصيل');
            setLoading(false);
            return;
        }
        try {
            // Simple sync: Update database cart with Zustand data
            await syncZustandToDatabase();

            const formData = new FormData();
            formData.append('fullName', user.name || '');
            formData.append('phone', user.phone || '');
            formData.append('addressId', selectedAddress?.id || '');
            formData.append('shiftId', shiftId);
            formData.append('paymentMethod', paymentMethod);
            formData.append('termsAccepted', termsAccepted ? 'true' : 'false');

            const orderNumber = await createDraftOrder(formData);
            router.push(`/happyorder?orderid=${orderNumber}`);
        } catch (err: any) {
            if (err?.validationErrors) setError(err.validationErrors.join('، '));
            else setError(err?.message || 'حدث خطأ أثناء تنفيذ الطلب');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Order Summary */}
            <div className="p-4 bg-feature-commerce-soft rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4 text-feature-commerce" />
                        <span className="font-medium">جاهز للطلب</span>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-sm text-muted-foreground">
                    {totalItems} منتج • إجمالي {total.toFixed(2)} ريال
                </div>
            </div>
            {/* Place Order Button with Info Tooltip */}
            <div className="flex items-center gap-2 w-full">
                <Button
                    className="btn-save w-full h-12 text-lg"
                    disabled={!isValid || loading}
                    onClick={handlePlaceOrder}
                >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {loading ? 'جاري تنفيذ الطلب...' : 'تنفيذ الطلب'}
                </Button>
                {!isValid && (
                    <InfoTooltip
                        content={infoMessage}
                    />
                )}
            </div>
            {error && (
                <div className="text-center text-red-600 text-sm mt-2">
                    {Array.isArray(error) ? error.join('، ') : error}
                </div>
            )}
        </div>
    );
} 