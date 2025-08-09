export const CART_EVENT = 'cart-changed';

/**
 * Broadcasts that the cart has changed so any listening component can re-fetch.
 * Works across tabs by also writing to localStorage (storage event).
 */
export function emitCartChanged(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(CART_EVENT));
  try {
    localStorage.setItem('cart-updated', Date.now().toString());
  } catch {
    // ignore private / SSR
  }
}

/**
 * Subscribe to cart-changed events. Returns an unsubscribe function.
 */
export function onCartChanged(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener(CART_EVENT, listener);
  const storageHandler = (e: StorageEvent) => {
    if (e.key === 'cart-updated') listener();
  };
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener(CART_EVENT, listener);
    window.removeEventListener('storage', storageHandler);
  };
} 