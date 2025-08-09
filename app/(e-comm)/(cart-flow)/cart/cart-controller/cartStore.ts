// Zustand cart store: local state only, no API calls
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/databaseTypes';
import { emitCartChanged } from '@/lib/cart-events';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  cart: Record<string, CartItem>;
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  setCart: (cart: Record<string, CartItem>) => void;
  getTotalItems: () => number;
  getTotalUniqueItems: () => number;
  getTotalPrice: () => number;
}

const getEffectivePrice = (product: Product) =>
  'discountedPrice' in product ? (product as any).discountedPrice : product.price;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: {},
      addItem: (product, quantity) => {
        set((state) => {
          const existing = state.cart[product.id];
          const newCart = {
            ...state.cart,
            [product.id]: {
              product,
              quantity: existing ? existing.quantity + quantity : quantity,
            },
          };
          emitCartChanged();
          return { cart: newCart };
        });
      },
      updateQuantity: (productId, delta) => {
        set((state) => {
          const existing = state.cart[productId];
          if (!existing) return state;
          const newQty = Math.max(0, existing.quantity + delta);
          const newCart = { ...state.cart };
          if (newQty === 0) delete newCart[productId];
          else newCart[productId] = { ...existing, quantity: newQty };
          emitCartChanged();
          return { cart: newCart };
        });
      },
      removeItem: (productId) => {
        set((state) => {
          const newCart = { ...state.cart };
          delete newCart[productId];
          emitCartChanged();
          return { cart: newCart };
        });
      },
      clearCart: () => {
        set(() => ({ cart: {} }));
        emitCartChanged();
      },
      setCart: (cart) => {
        set({ cart });
        emitCartChanged();
      },
      getTotalItems: () => Object.values(get().cart).reduce((acc, item) => acc + item.quantity, 0),
      getTotalUniqueItems: () => Object.keys(get().cart).length,
      getTotalPrice: () =>
        Object.values(get().cart).reduce(
          (acc, item) => acc + item.quantity * getEffectivePrice(item.product),
          0,
        ),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cart: state.cart }),
    },
  ),
); 