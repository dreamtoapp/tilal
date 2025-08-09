// Zustand optimized cart store for instant UI and background sync
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/databaseTypes';

interface CartItem {
  product: Product;
  quantity: number;
  lastUpdated: number;
}

interface CartState {
  cart: Record<string, CartItem>;
  isSyncing: boolean;
  lastSyncTime: number | null;
  pendingChanges: Record<string, { quantity: number; timestamp: number }>;
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  syncToServer: () => Promise<void>;
  fetchFromServer: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getPendingChanges: () => Record<string, { quantity: number; timestamp: number }>;
}

export const useOptimizedCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: {},
      isSyncing: false,
      lastSyncTime: null,
      pendingChanges: {},
      addItem: (product, quantity) => {
        set((state) => {
          const existing = state.cart[product.id];
          const newQuantity = existing ? existing.quantity + quantity : quantity;
          const newCart = {
            ...state.cart,
            [product.id]: {
              product,
              quantity: newQuantity,
              lastUpdated: Date.now(),
            },
          };
          const newPendingChanges = {
            ...state.pendingChanges,
            [product.id]: { quantity: newQuantity, timestamp: Date.now() },
          };
          return { cart: newCart, pendingChanges: newPendingChanges };
        });
      },
      updateQuantity: (productId, delta) => {
        set((state) => {
          const existing = state.cart[productId];
          if (!existing) return state;
          const newQuantity = Math.max(0, existing.quantity + delta);
          const newCart = { ...state.cart };
          const newPendingChanges = { ...state.pendingChanges };
          if (newQuantity === 0) {
            delete newCart[productId];
            delete newPendingChanges[productId];
          } else {
            newCart[productId] = {
              ...existing,
              quantity: newQuantity,
              lastUpdated: Date.now(),
            };
            newPendingChanges[productId] = { quantity: newQuantity, timestamp: Date.now() };
          }
          return { cart: newCart, pendingChanges: newPendingChanges };
        });
      },
      removeItem: (productId) => {
        set((state) => {
          const newCart = { ...state.cart };
          const newPendingChanges = { ...state.pendingChanges };
          delete newCart[productId];
          delete newPendingChanges[productId];
          return { cart: newCart, pendingChanges: newPendingChanges };
        });
      },
      clearCart: () => {
        set({ cart: {}, pendingChanges: {} });
      },
      syncToServer: async () => {
        const { pendingChanges } = get();
        if (Object.keys(pendingChanges).length === 0) return;
        set({ isSyncing: true });
        try {
          const { syncCartChanges } = await import('../actions/optimizedCartActions');
          await syncCartChanges(pendingChanges);
          set({ pendingChanges: {}, lastSyncTime: Date.now() });
        } catch (error) {
          console.error('Cart sync failed:', error);
        } finally {
          set({ isSyncing: false });
        }
      },
      fetchFromServer: async () => {
        set({ isSyncing: true });
        try {
          const { getCart } = await import('../actions/optimizedCartActions');
          const serverCart = await getCart();
          if (serverCart?.items) {
            const zustandCart: Record<string, CartItem> = {};
            serverCart.items.forEach((item: any) => {
              if (item.product) {
                zustandCart[item.productId] = {
                  product: item.product,
                  quantity: item.quantity,
                  lastUpdated: Date.now(),
                };
              }
            });
            set({ cart: zustandCart, lastSyncTime: Date.now() });
          }
        } catch (error) {
          console.error('Cart fetch failed:', error);
        } finally {
          set({ isSyncing: false });
        }
      },
      getTotalItems: () => Object.values(get().cart).reduce((acc, item) => acc + item.quantity, 0),
      getTotalPrice: () => Object.values(get().cart).reduce((acc, item) => acc + (item.quantity * item.product.price), 0),
      getPendingChanges: () => get().pendingChanges,
    }),
    {
      name: 'optimized-cart-storage',
      partialize: (state) => ({ cart: state.cart }),
    },
  ),
); 