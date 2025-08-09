import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUnreadNotificationCount } from '@/app/(e-comm)/(adminPage)/user/notifications/actions/getUnreadNotificationCount';

// 🔔 Get current unread notification count
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'User not authenticated'
      }, { status: 401 });
    }

    const count = await getUnreadNotificationCount(session.user.id);

    return NextResponse.json({
      success: true,
      count
    });

  } catch (error) {
    console.error('❌ Failed to get notification count:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get notification count'
    }, { status: 500 });
  }
} 