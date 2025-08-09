"use client";
import WishlistRemoveButton from './WishlistRemoveButton';

export default function WishlistRemoveButtonWrapper({ productId, onRemove }: { productId: string; onRemove?: (id: string) => void }) {
    return <WishlistRemoveButton productId={productId} onRemove={onRemove} />;
} 