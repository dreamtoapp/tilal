/**
 * Syncs pending cart changes to the server.
 * @param pendingChanges - Object mapping product IDs to quantity/timestamp changes
 */
export async function syncCartChanges(
  pendingChanges: Record<string, { quantity: number; timestamp: number }>
): Promise<void> {
  // referenced to avoid TS6133 unused parameter error
  void pendingChanges;
  // TODO: Implement server sync logic
  return;
}

/**
 * Fetches the current cart from the server.
 * @returns An object with an items array (each item should have product and quantity)
 */
export async function getCart(): Promise<{ items: Array<{ productId: string; product?: any; quantity: number }> }> {
  return { items: [] };
} 