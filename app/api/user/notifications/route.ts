import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch notifications for the user
    // Replace this with actual database query once implemented
    const notifications = [
      {
        id: '1',
        title: 'طلب جديد',
        body: 'لقد تم تقديم طلب جديد برقم #12345.',
        type: 'order',
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: '/user/purchase-history'
      },
      {
        id: '2',
        title: 'تحديث النظام',
        body: 'تم تحديث النظام إلى الإصدار الأحدث.',
        type: 'system',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '3',
        title: 'عرض خاص',
        body: 'خصم 20% على جميع المنتجات حتى نهاية الأسبوع!',
        type: 'promotion',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        actionUrl: '/offers/special'
      },
      {
        id: '4',
        title: 'تعليق جديد',
        body: 'قام أحمد بذكرك في تعليق.',
        type: 'user',
        read: false,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        mentionedUser: { name: 'أحمد', image: '' },
        actionUrl: '/user/ratings'
      }
    ];

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

type Params = Promise<{ notificationId?: string }>;

export async function POST(req: Request, { params }: { params: Params }) {
  const awaited = await params;
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    if (action === 'markAllAsRead') {
      // Logic to mark all notifications as read for the user
      // Replace with actual database update
      console.log(`Marking all notifications as read for user ${userId}`);
      return NextResponse.json({ success: true });
    } else if (awaited.notificationId) {
      // Logic to mark a single notification as read
      // Replace with actual database update
      console.log(`Marking notification ${awaited.notificationId} as read for user ${userId}`);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating notification status:', error);
    return NextResponse.json({ error: 'Failed to update notification status' }, { status: 500 });
  }
} 