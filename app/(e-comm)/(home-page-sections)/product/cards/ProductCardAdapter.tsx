'use client';

import ProductCard from '@/app/(e-comm)/(home-page-sections)/product/cards/ProductCard';
import { Product } from '@/types/databaseTypes';
import React from 'react';
import { useCartStore } from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/cartStore';

interface ProductCardAdapterProps {
    product: Product;
    className?: string;
    index?: number;
    discountPercentage?: number; // Optional global discount
    priority?: boolean;
}

const ProductCardAdapter = React.memo(function ProductCardAdapter({ product, className, discountPercentage, priority }: ProductCardAdapterProps) {
    const { cart } = useCartStore();
    const cartQty = cart[product.id]?.quantity ?? 0;
    const inCart = cartQty > 0;

    // Discount logic: globally adapt product if discountPercentage is provided
    let adaptedProduct = product;
    if (discountPercentage && discountPercentage > 0) {
        adaptedProduct = {
            ...product,
            compareAtPrice: product.price,
            price: +(product.price * (1 - discountPercentage / 100)).toFixed(2),
        };
    }

    return (
        <ProductCard
            product={adaptedProduct}
            className={className}
            quantity={cartQty}
            isInCart={inCart}
            priority={priority}
        />
    );
});

export default ProductCardAdapter; 