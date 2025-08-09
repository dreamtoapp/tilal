"use server";

import db from '@/lib/prisma';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { checkIsLogin } from '@/lib/check-is-login';
import { z } from 'zod';

// Types for cart with items and products
export type CartItemWithProduct = Awaited<ReturnType<typeof db.cartItem.findFirst>> & { product?: Awaited<ReturnType<typeof db.product.findFirst>> };
export type CartWithItems = Awaited<ReturnType<typeof db.cart.findFirst>> & { items?: CartItemWithProduct[] };

// Helper: get cart ID from cookie
async function getCartIdFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('localCartId')?.value;
}



// Helper: clear cart ID cookie - Server Action
export async function clearCartIdCookie() {
  const cookieStore = await cookies();
  cookieStore.set('localCartId', '', { maxAge: -1 });
}



// Get the current user's or guest's cart
export async function getCart(): Promise<CartWithItems | null> {
  const user = await checkIsLogin();
  const localCartId = await getCartIdFromCookie();

  // Logged-in user
  if (user) {
    let userCart = await db.cart.findUnique({
      where: { userId: user.id },
      include: { items: { include: { product: true } } },
    });

    // Merge guest cart if present
    if (localCartId) {
      try {
        const localCart = await db.cart.findUnique({
          where: { id: localCartId },
          include: { items: { include: { product: true } } },
        });

        if (localCart && localCart.items.length > 0) {
          if (userCart) {
            await db.$transaction(async (tx) => {
              for (const item of localCart.items) {
                if (!userCart) throw new Error('userCart is unexpectedly null');
                const existingItem = userCart.items.find(
                  (i: typeof item) => i.productId === item.productId
                );
                if (existingItem) {
                  await tx.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: existingItem.quantity + item.quantity },
                  });
                } else {
                  await tx.cartItem.create({
                    data: {
                      cartId: userCart.id,
                      productId: item.productId,
                      quantity: item.quantity,
                    },
                  });
                }
              }
            });
            await db.cart.delete({ where: { id: localCartId } });
          } else {
            await db.cart.update({
              where: { id: localCartId },
              data: { userId: user.id },
            });
          }
          userCart = await db.cart.findUnique({
            where: { userId: user.id },
            include: { items: { include: { product: true } } },
          });

          // Clear the cookie immediately after successful merge
          await clearCartIdCookie();
        } else if (!localCart) {
          // Cart was deleted but cookie still exists - clear it
          console.log('Cart not found, clearing stale cookie');
          await clearCartIdCookie();
        }
      } catch (error) {
        console.error('Error during cart merge:', error);
        // Clear cookie on any error to prevent future issues
        await clearCartIdCookie();
      }
    }
    const result = userCart;
    return result;
  }

  // Guest
  if (localCartId) {
    return await db.cart.findUnique({
      where: { id: localCartId },
      include: { items: { include: { product: true } } },
    });
  }
  return null;
}

// Schema for quantity validation
const quantitySchema = z.number().int().min(1).max(99);

// Add item to cart (only for authenticated users)
export async function addItem(productId: string, quantity: number = 1): Promise<void> {
  console.log('[addItem] called with:', { productId, quantity });
  const user = await checkIsLogin();
  console.log('[addItem] user from checkIsLogin:', user);

  // Only proceed with database operations if user is authenticated
  if (!user) {
    console.log('[addItem] User not authenticated, skipping database operations');
    return;
  }

  let cart: CartWithItems | null = null;
  let cartId: string | undefined;
  console.log('[addItem] cartId before:', cartId);

  // Get or create user cart
  cart = await db.cart.findUnique({ where: { userId: user.id } });
  if (!cart) {
    cart = await db.cart.create({ data: { userId: user.id } });
  }
  cartId = cart.id;

  console.log('[addItem] cartId after:', cartId);
  // Log product quantity before add
  let qtyBefore = 0;
  if (cartId) {
    const cartBefore = await db.cart.findUnique({ where: { id: cartId }, include: { items: true } });
    const itemBefore = cartBefore?.items.find(i => i.productId === productId);
    qtyBefore = itemBefore?.quantity || 0;
    console.log(`[addItem] quantity before: ${qtyBefore}`);
  }

  const existingItem = await db.cartItem.findFirst({
    where: { cartId: cartId, productId },
  });

  if (existingItem) {
    await db.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await db.cartItem.create({
      data: {
        cartId: cartId!,
        productId,
        quantity: quantity,
      },
    });
  }

  // Log product quantity after add
  let qtyAfter = 0;
  if (cartId) {
    const cartAfter = await db.cart.findUnique({ where: { id: cartId }, include: { items: true } });
    const itemAfter = cartAfter?.items.find(i => i.productId === productId);
    qtyAfter = itemAfter?.quantity || 0;
    console.log(`[addItem] quantity after: ${qtyAfter}`);
  }

  revalidateTag('cart');
}

// Update quantity of a cart item
export async function updateItemQuantity(itemId: string, quantity: number): Promise<void> {
  console.log('[updateItemQuantity] called with:', { itemId, quantity });

  // Prevent quantity from going below 1
  const minQuantity = Math.max(1, quantity);
  console.log('[updateItemQuantity] enforcing minimum quantity:', minQuantity);

  const validQty = quantitySchema.parse(minQuantity);
  console.log('[updateItemQuantity] updating database with quantity:', validQty);

  await db.cartItem.update({
    where: { id: itemId },
    data: { quantity: validQty },
  });

  console.log('[updateItemQuantity] database update completed');
  revalidateTag('cart');
}

// Remove item from cart (and delete the cart itself if it becomes empty)
export async function removeItem(itemId: string): Promise<void> {
  console.log('[removeItem] called with:', { itemId });

  // Find the cartId first (needed after deletion)
  const cartItem = await db.cartItem.findUnique({ where: { id: itemId } });
  console.log('[removeItem] cartItem found:', !!cartItem, 'cartId:', cartItem?.cartId);
  if (!cartItem) {
    console.log('[removeItem] Cart item not found, revalidating and returning');
    revalidateTag('cart');
    return;
  }

  console.log('[removeItem] deleting cart item from database');
  await db.cartItem.delete({ where: { id: itemId } });
  console.log('[removeItem] cart item deleted from database');

  // Check if the cart has any remaining items; if none, delete the cart
  const remaining = await db.cartItem.count({ where: { cartId: cartItem.cartId } });
  console.log('[removeItem] remaining items in cart:', remaining);
  if (remaining === 0) {
    console.log('[removeItem] no remaining items, deleting cart');
    await db.cart.delete({ where: { id: cartItem.cartId } });
    console.log('[removeItem] cart deleted');
  }

  console.log('[removeItem] revalidating cart tag');
  revalidateTag('cart');
  console.log('[removeItem] completed');
}

// Merge guest cart into user cart on login
export async function mergeGuestCartOnLogin(guestCartId: string, userId: string): Promise<void> {
  const guestCart = await db.cart.findUnique({
    where: { id: guestCartId },
    include: { items: true },
  });
  let userCart = await db.cart.findUnique({ where: { userId } });
  if (!userCart) {
    userCart = await db.cart.create({ data: { userId } });
  }
  if (guestCart && guestCart.items.length > 0) {
    await db.$transaction(async (tx) => {
      for (const item of guestCart.items) {
        if (!userCart) throw new Error('userCart is unexpectedly null');
        const existingItem = await tx.cartItem.findFirst({
          where: { cartId: userCart.id, productId: item.productId },
        });
        if (existingItem) {
          await tx.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + item.quantity },
          });
        } else {
          await tx.cartItem.create({
            data: {
              cartId: userCart.id,
              productId: item.productId,
              quantity: item.quantity,
            },
          });
        }
      }
    });
    await db.cart.delete({ where: { id: guestCartId } });
  }
  revalidateTag('cart');
}

// Get the total number of items in the cart (for header badge)
export async function getCartCount(): Promise<number> {
  const cart = await getCart();
  if (!cart || !cart.items) return 0;
  return cart.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
}

// Clear cart for logged-in user or guest cart (by cookie)
export async function clearCart(): Promise<void> {
  // Delete cart for logged-in user or guest cart (by cookie)
  const user = await checkIsLogin();
  const localCartId = await getCartIdFromCookie();

  if (user) {
    // Remove user cart completely
    await db.cart.deleteMany({ where: { userId: user.id } });
  }

  if (localCartId) {
    try {
      await db.cart.delete({ where: { id: localCartId } });
    } catch (e) {
      // cart may not exist
    }
    await clearCartIdCookie();
  }

  revalidateTag('cart');
}

// Helper: Sync Zustand quantity to database (replaces quantity, doesn't add)
export async function syncZustandQuantityToDatabase(productId: string, quantity: number): Promise<void> {
  console.log('[syncZustandQuantityToDatabase] called with:', { productId, quantity });
  const user = await checkIsLogin();
  console.log('[syncZustandQuantityToDatabase] user from checkIsLogin:', user);

  // Only proceed with database operations if user is authenticated
  if (!user) {
    console.log('[syncZustandQuantityToDatabase] User not authenticated, skipping database operations');
    return;
  }

  let cart: CartWithItems | null = null;
  let cartId: string | undefined;

  // Get or create user cart
  cart = await db.cart.findUnique({ where: { userId: user.id } });
  if (!cart) {
    cart = await db.cart.create({ data: { userId: user.id } });
  }
  cartId = cart.id;

  const existingItem = await db.cartItem.findFirst({
    where: { cartId: cartId, productId },
  });

  if (existingItem) {
    // Replace quantity instead of adding
    await db.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: quantity }, // ✅ REPLACES quantity
    });
  } else {
    // Create new item with exact quantity
    await db.cartItem.create({
      data: {
        cartId: cartId!,
        productId,
        quantity: quantity,
      },
    });
  }

  console.log('[syncZustandQuantityToDatabase] quantity synced to:', quantity);
  revalidateTag('cart');
}

// Convenience: remove item using productId rather than itemId
export async function removeItemByProduct(productId: string): Promise<void> {
  console.log('[removeItemByProduct] called with:', { productId });
  const user = await checkIsLogin();
  console.log('[removeItemByProduct] user from checkIsLogin:', user);

  // Only proceed with database operations if user is authenticated
  if (!user) {
    console.log('[removeItemByProduct] User not authenticated, skipping database operations');
    return;
  }

  const cart = await getCart();
  console.log('[removeItemByProduct] cart found:', !!cart, 'items count:', cart?.items?.length || 0);
  if (!cart || !cart.items) {
    console.log('[removeItemByProduct] No cart or items found');
    return;
  }

  const item = cart.items.find((i) => i.productId === productId);
  console.log('[removeItemByProduct] item found:', !!item, 'itemId:', item?.id);
  if (!item) {
    console.log('[removeItemByProduct] Item not found in cart');
    return;
  }

  console.log('[removeItemByProduct] calling removeItem with itemId:', item.id);
  await removeItem(item.id);
  console.log('[removeItemByProduct] removeItem completed');
}

// Update quantity using productId (positive or negative delta). If quantity <=0 after update, item is removed.
export async function updateItemQuantityByProduct(productId: string, delta: number): Promise<void> {
  console.log('[updateItemQuantityByProduct] called with:', { productId, delta });
  const user = await checkIsLogin();
  console.log('[updateItemQuantityByProduct] user from checkIsLogin:', user);

  // Only proceed with database operations if user is authenticated
  if (!user) {
    console.log('[updateItemQuantityByProduct] User not authenticated, skipping database operations');
    return;
  }

  const cart = await getCart();
  console.log('[updateItemQuantityByProduct] cart found:', !!cart, 'items count:', cart?.items?.length || 0);
  if (!cart || !cart.items) return;
  const item = cart.items.find((i) => i.productId === productId);
  console.log('[updateItemQuantityByProduct] item found:', !!item, 'current quantity:', item?.quantity || 0);
  if (!item) return;
  const newQty = Math.max(1, (item.quantity ?? 0) + delta); // Prevent going below 1
  console.log('[updateItemQuantityByProduct] updating quantity from', item.quantity, 'to', newQty);
  await updateItemQuantity(item.id, newQty);
  console.log('[updateItemQuantityByProduct] quantity update completed');
} 