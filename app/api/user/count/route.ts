import { NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function GET() {
  try {
    const count = await db.user.count({ where: { role: 'CUSTOMER' } });
    return new NextResponse(
      JSON.stringify({ count }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
        },
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ count: 0, error: 'Database error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 