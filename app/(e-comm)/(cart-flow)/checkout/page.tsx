import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CheckoutClient from "./components/CheckoutClient";
import { getUser } from "./actions/getUser";
import { mergeCartOnCheckout } from "./actions/mergeCartOnCheckout";
import { getAddresses } from "./actions/getAddresses";
import { debug, error } from '@/utils/logger';

async function getPlatformSettings() {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/platform-settings`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    error('Error fetching platform settings:', err instanceof Error ? err.message : String(err));
    // Return default values if API fails
    return {
      taxPercentage: 15,
      shippingFee: 25,
      minShipping: 200
    };
  }
}

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login?redirect=/checkout");
  }

  const [user, cart, addresses, platformSettings] = await Promise.all([
    getUser(session.user.id),
    mergeCartOnCheckout(),
    getAddresses(session.user.id),
    getPlatformSettings()
  ]);
  debug('Platform settings and cart:', { platformSettings, cart });

  // Check if database cart is empty, but don't redirect immediately
  // The CheckoutClient will handle Zustand cart as fallback
  if (!cart || !cart.items || cart.items.length === 0) {
    debug("Database cart is empty, will use Zustand cart as fallback");
  }

  if (!user) return null;
  return <CheckoutClient user={user} cart={{
    ...cart, items: (cart?.items ?? []).map(item => ({
      ...item,
      id: item.id,
      product: item.product ? { id: item.product.id, name: item.product.name, price: item.product.price } : null
    }))
  }} addresses={addresses} platformSettings={platformSettings} />;
}
