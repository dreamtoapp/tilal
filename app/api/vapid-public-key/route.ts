import { NextResponse } from 'next/server';

export async function GET() {
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidPublicKey) {
    return NextResponse.json({ error: 'VAPID public key not set' }, { status: 500 });
  }
  return new NextResponse(vapidPublicKey, { status: 200 });
} 