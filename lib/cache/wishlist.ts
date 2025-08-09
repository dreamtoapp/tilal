/**
 * In-memory session-level cache for wishlist status.
 * Lives on the client runtime; persists only until page refresh.
 */
const cache = new Map<string, boolean>();

export function getCachedWishlist(productId: string): boolean | undefined {
  return cache.get(productId);
}

export function setCachedWishlist(productId: string, inWishlist: boolean): void {
  cache.set(productId, inWishlist);
} 