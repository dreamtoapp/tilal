'use client';

import CartQuantityControls from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/CartQuantityControls';
import AddToCart from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/AddToCart';
import WishlistButton from '@/app/(e-comm)/(home-page-sections)/product/cards/WishlistButton';
import { Product } from '@prisma/client';
import { useCartStore } from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/cartStore';

export default function ProductQuantity({ product }: { product: Product }) {
  const { cart } = useCartStore();
  const cartQuantity = cart[product.id]?.quantity || 0;
  const isInCart = cartQuantity > 0;

  return (
    <div className='space-y-4 flex  items-center justify-between w-full'>
      {isInCart ? (
        <div className="flex items-center justify-center">
          <CartQuantityControls productId={product.id} size="md" />
        </div>
      ) : (
        <AddToCart
          product={product}
          quantity={1}
          inStock={!product.outOfStock}
          size='lg'
        />
      )}
      <div className='flex flex-wrap gap-3 border border-primary rounded-full p-2'>
        <WishlistButton productId={product.id} className='p-2' size='lg' showBackground={true} />
      </div>
    </div>
  );
}
