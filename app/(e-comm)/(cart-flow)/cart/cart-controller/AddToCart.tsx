"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icons/Icon";
import { useCartStore } from "./cartStore";
import { Product } from "@/types/databaseTypes";
import { addItem } from "@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions";
import { useCheckIsLogin } from "@/hooks/use-check-islogin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AddToCartProps {
    product: Product;
    quantity?: number;
    inStock?: boolean;
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
    onSuccess?: () => void;
    onError?: (error: any) => void;
}

export default function AddToCart({
    product,
    quantity = 1,
    inStock = true,
    variant = "default",
    size = "default",
    className,
    onSuccess,
    onError,
}: AddToCartProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const { addItem: addItemLocal } = useCartStore();
    const { isAuthenticated } = useCheckIsLogin();
    console.log("isAuthenticated", isAuthenticated)

    const handleAddToCart = async (qty: number = quantity) => {
        if (!inStock) return;
        let rollbackNeeded = false;
        try {
            setIsLoading(true);
            addItemLocal(product as any, qty);
            rollbackNeeded = true;
            // Always call backend, for both guests and authenticated users
            await addItem(product.id, qty);
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("cart-changed"));
                localStorage.setItem("cart-updated", Date.now().toString());
            }
            setIsAdded(true);
            toast.success("تمت إضافة المنتج إلى السلة", {
                description: product.name,
            });
            onSuccess?.();
        } catch (error) {
            if (rollbackNeeded) {
                addItemLocal(product as any, -qty);
            }
            toast.error("حدث خطأ أثناء الإضافة إلى السلة، تم التراجع عن التغيير");
            onError?.(error);
        } finally {
            setIsLoading(false);
            setTimeout(() => setIsAdded(false), 2000);
        }
    };

    const btnSize = size === "sm" ? "xs" : size === "lg" ? "md" : "sm";
    return (
        <Button
            variant={variant}
            size={size}
            onClick={() => handleAddToCart()}
            disabled={isLoading || !inStock || isAdded}
            className={cn(
                isAdded && "btn-add",
                !inStock && "cursor-not-allowed opacity-50",
                className
            )}
        >
            {isAdded ? (
                <>
                    <Icon name="Check" size={btnSize} />
                    {size !== "icon" && <span className="mr-2">تمت الإضافة</span>}
                </>
            ) : (
                <>
                    <Icon name="ShoppingCart" size={btnSize} />
                    {size !== "icon" && (
                        <span className="mr-2">{!inStock ? "غير متوفر" : "إضافة إلى السلة"}</span>
                    )}
                </>
            )}
        </Button>
    );
} 