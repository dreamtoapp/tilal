import React, { useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from './cartStore';
import { useCheckIsLogin } from '@/hooks/use-check-islogin';
import { Trash2 } from 'lucide-react';
import debounce from 'debounce';

interface CartQuantityControlsProps {
    productId: string;
    size?: 'sm' | 'md';
    variant?: 'inline' | 'dropdown';
    onDeleteStart?: () => void;
    onDeleteEnd?: () => void;
}

const CartQuantityControls: React.FC<CartQuantityControlsProps> = ({ productId, size = 'md', variant = 'inline', onDeleteStart, onDeleteEnd }) => {
    const { cart, updateQuantity } = useCartStore();
    const { isAuthenticated } = useCheckIsLogin();

    const qty = cart[productId]?.quantity || 0;

    console.log('🔢 CartQuantityControls - productId:', productId, 'qty:', qty, 'isAuthenticated:', isAuthenticated);

    const btnSize = size === 'sm' ? 'icon' : 'default';

    // Debounced server action handlers (300ms delay)
    const debouncedIncServerAction = useMemo(
        () => debounce(async (productId: string) => {
            if (isAuthenticated) {
                console.log('🔢 Debounced: User authenticated, calling server action');
                const { updateItemQuantityByProduct } = await import('@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions');
                await updateItemQuantityByProduct(productId, 1);
                console.log('🔢 Debounced: Server action completed successfully');
            } else {
                console.log('🔢 Debounced: User not authenticated, skipping server action');
            }
        }, 300),
        [isAuthenticated]
    );

    const debouncedDecServerAction = useMemo(
        () => debounce(async (productId: string) => {
            if (isAuthenticated) {
                console.log('🔢 Debounced: User authenticated, calling server action');
                const { updateItemQuantityByProduct } = await import('@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions');
                await updateItemQuantityByProduct(productId, -1);
                console.log('🔢 Debounced: Server action completed successfully');
            } else {
                console.log('🔢 Debounced: User not authenticated, skipping server action');
            }
        }, 300),
        [isAuthenticated]
    );

    const debouncedDeleteServerAction = useMemo(
        () => debounce(async (productId: string) => {
            if (isAuthenticated) {
                console.log('🗑️ Debounced: User authenticated, calling server action');
                const { removeItemByProduct } = await import('@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions');
                await removeItemByProduct(productId);
                console.log('🗑️ Debounced: Server action completed successfully');
            } else {
                console.log('🗑️ Debounced: User not authenticated, skipping server action');
            }
        }, 300),
        [isAuthenticated]
    );

    const handleInc = useCallback(async () => {
        console.log('🔢 handleInc clicked - productId:', productId, 'isAuthenticated:', isAuthenticated);

        // Immediate UI update
        console.log('🔢 Updating Zustand quantity +1');
        updateQuantity(productId, 1);

        // Debounced server action
        debouncedIncServerAction(productId);
    }, [productId, isAuthenticated, updateQuantity, debouncedIncServerAction]);

    const handleDec = useCallback(async () => {
        console.log('🔢 handleDec clicked - productId:', productId, 'isAuthenticated:', isAuthenticated);
        if (qty <= 1) return; // Prevent going below 1

        // Immediate UI update
        console.log('🔢 Updating Zustand quantity -1');
        updateQuantity(productId, -1);

        // Debounced server action
        debouncedDecServerAction(productId);
    }, [productId, isAuthenticated, qty, updateQuantity, debouncedDecServerAction]);

    const handleDelete = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        console.log('🗑️ handleDelete clicked - productId:', productId, 'isAuthenticated:', isAuthenticated);

        // Notify parent that delete is starting
        onDeleteStart?.();

        // Immediate UI update
        console.log('🗑️ Removing item from Zustand');
        updateQuantity(productId, -qty); // Remove all quantity

        // Call server action immediately (not debounced for delete)
        if (isAuthenticated) {
            console.log('🗑️ Calling server action immediately');
            try {
                const { removeItemByProduct } = await import('@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions');
                await removeItemByProduct(productId);
                console.log('🗑️ Server action completed successfully');
            } catch (error) {
                console.error('🗑️ Server action failed:', error);
            }
        } else {
            console.log('🗑️ User not authenticated, skipping server action');
        }

        // Notify parent that delete is complete
        onDeleteEnd?.();
    }, [productId, isAuthenticated, qty, updateQuantity, onDeleteStart, onDeleteEnd]);

    // Cleanup debounced functions on unmount
    React.useEffect(() => {
        return () => {
            debouncedIncServerAction.clear();
            debouncedDecServerAction.clear();
            debouncedDeleteServerAction.clear();
        };
    }, [debouncedIncServerAction, debouncedDecServerAction, debouncedDeleteServerAction]);

    // Early return after all hooks
    if (qty === 0) return null; // product not yet in cart

    // Variant-based styling
    const containerClasses = variant === 'dropdown'
        ? 'flex items-center gap-1 text-sm'
        : 'flex items-center gap-2';

    const buttonClasses = variant === 'dropdown'
        ? 'h-7 w-7 rounded-full text-xs'
        : 'h-8 w-8 rounded-full';

    const quantityClasses = variant === 'dropdown'
        ? 'text-xs font-medium w-6 text-center select-none'
        : 'text-sm font-medium w-6 text-center select-none';

    return (
        <div className={containerClasses}>
            <Button
                variant='outline'
                size={btnSize}
                onClick={handleInc}
                className={buttonClasses}
                aria-label='Increase quantity'
            >
                +
            </Button>
            <span className={quantityClasses}>{qty}</span>
            <Button
                variant='outline'
                size={btnSize}
                onClick={handleDec}
                disabled={qty <= 1}
                className={buttonClasses}
                aria-label='Decrease quantity'
            >
                –
            </Button>
            <Button
                variant='outline'
                size={btnSize}
                onClick={handleDelete}
                className={`${buttonClasses} text-destructive hover:text-destructive hover:bg-destructive/10`}
                aria-label='Remove item from cart'
            >
                <Trash2 className='h-4 w-4' />
            </Button>
        </div>
    );
};

export default CartQuantityControls; 