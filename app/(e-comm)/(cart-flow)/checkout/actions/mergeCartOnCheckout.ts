'use server';
import db from '@/lib/prisma';
import { checkIsLogin } from '@/lib/check-is-login';
import { cookies } from 'next/headers';

async function getCartIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('localCartId')?.value || null;
}

export async function mergeCartOnCheckout() {
  const user = await checkIsLogin();
  const localCartId = await getCartIdFromCookie();

  if (user) {
    // Return user's cart (already merged during login)
    const userCart = await db.cart.findUnique({
      where: { userId: user.id },
      include: { items: { include: { product: true } } },
    });
    return userCart;
  }

  // Guest - return local cart if exists
  if (localCartId) {
    return await db.cart.findUnique({
      where: { id: localCartId },
      include: { items: { include: { product: true } } },
    });
  }

  return null;
} 