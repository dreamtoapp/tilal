import { NextResponse } from 'next/server';
import { getUserStats } from '@/app/(e-comm)/(adminPage)/user/profile/action/getUserStats';

export async function GET() {
  try {
    const userStats = await getUserStats();
    return NextResponse.json(userStats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(null, { status: 500 });
  }
} 