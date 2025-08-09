import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Product } from '@/types/databaseTypes';
import AddToCart from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/AddToCart';
import Image from 'next/image';
import { Icon } from '@/components/icons/Icon';

interface AddToCartModalProps {
    open: boolean;
    onClose: () => void;
    product: Product;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({ open, onClose, product }) => {
    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="max-w-md w-full p-3 sm:p-5 flex flex-col gap-3 rounded-2xl shadow-xl max-h-[90vh]"
                aria-modal="true"
                role="dialog"
                tabIndex={-1}
            >
                <div className="overflow-y-auto flex-1">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold mb-1">{product.name}</DialogTitle>
                        {product.brand && <span className="text-xs text-muted-foreground">({product.brand})</span>}
                        {product.description && <span className="text-xs text-muted-foreground line-clamp-2">{product.description}</span>}
                    </DialogHeader>
                    <div className="w-full flex justify-center my-3">
                        <div className="relative w-full max-w-xs h-40 sm:h-56 bg-gray-100 rounded-2xl shadow-md overflow-hidden">
                            <Image
                                src={product.imageUrl || '/fallback/product-fallback.avif'}
                                alt={product.name || 'صورة المنتج'}
                                fill
                                sizes="(max-width: 640px) 100vw, 320px"
                                className="object-cover"
                                loading="lazy"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-1 w-full">
                        <div className="text-2xl font-bold text-primary">{product.price} ر.س</div>
                        <div className="flex items-center justify-between w-full gap-1 text-xs text-yellow-500">
                            <div className="flex items-center gap-1 text-xs text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Icon
                                        key={i}
                                        name="Star"
                                        size="xs"
                                        className={i < Math.floor(product.rating ?? 0) ? 'text-yellow-500' : 'text-gray-300'}
                                    />
                                ))}
                                <span>{product.rating ?? '--'}</span>
                                <span className="text-muted-foreground">({product.reviewCount ?? 0})</span>
                            </div>
                            <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                                {!product.outOfStock ? (
                                    <div className="text-xs text-green-600">متوفر</div>
                                ) : (
                                    <div className="text-xs text-destructive">غير متوفر</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex flex-col gap-2 mt-4 bg-background z-10 p-2 sm:static sm:bg-transparent">
                    <AddToCart product={product} className="w-full py-3 text-base font-bold" />
                    {/* <button onClick={onClose} className="w-full py-3 text-base border rounded">إلغاء</button> */}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default React.memo(AddToCartModal); 