import { addItem, getCart } from '@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cart = await getCart();
    return NextResponse.json(cart || { items: [] });
  } catch (error) {
    console.error('API cart get error:', error);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { productId, quantity } = await req.json();
  try {
    await addItem(productId, quantity ?? 1);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('API cart add error', e);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
} 