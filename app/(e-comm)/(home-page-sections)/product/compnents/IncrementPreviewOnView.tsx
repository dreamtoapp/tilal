"use client";
import { useEffect } from 'react';
import { incrementPreviewCount } from '../actions/incrementPreviewCount';

export default function IncrementPreviewOnView({ productId }: { productId: string }) {
    useEffect(() => {
        // Only increment preview count once per product per tab
        const key = `previewed_${productId}`;
        if (!sessionStorage.getItem(key)) {
            incrementPreviewCount(productId);
            sessionStorage.setItem(key, '1');
        }
    }, [productId]);
    return null;
} 