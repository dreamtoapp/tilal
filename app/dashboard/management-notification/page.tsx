// Dashboard Alerts Page with Filters and Mark All as Read
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getAllNotifications, markAllNotificationsRead } from '@/lib/notifications';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Package, Newspaper } from 'lucide-react';
import { UserNotification } from '@/types/databaseTypes';

export default async function AlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  const { type } = await searchParams;

  // Fetch all notifications for the user (optionally filtered)
  const notifications = await getAllNotifications({
    userId: session.user.id,
    type: type || undefined,
  });
  const unreadCount = notifications.filter((n: UserNotification) => !n.read).length;
  const hasUnread = unreadCount > 0;

  // List of unique types for filter
  const types = Array.from(new Set(notifications.map((n: UserNotification) => n.type).filter(Boolean)));

  // Mark all as read (server action)
  async function handleMarkAllRead() {
    'use server';
    await markAllNotificationsRead({ userId: session?.user?.id || '', type: type || undefined });
    redirect('/dashboard/alerts');
  }

  return (
    <div className='mx-auto max-w-3xl space-y-4 p-4'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>كل الإشعارات</h1>
        {hasUnread && (
          <form action={handleMarkAllRead}>
            <Button type='submit' variant='secondary' size='sm'>
              تعليم الكل كمقروءة
            </Button>
          </form>
        )}
      </div>
      {/* Filters */}
      <div className='mb-4 flex flex-wrap gap-2'>
        <a
          href='/dashboard/alerts'
          className={`rounded px-3 py-1 ${!type ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          الكل
        </a>
        {types.map((filterType) => (
          <a
            key={String(filterType)}
            href={`/dashboard/alerts?type=${filterType}`}
            className={`rounded px-3 py-1 ${type === filterType ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {filterType === 'ORDER' && 'الطلبات'}
            {filterType === 'INFO' && 'معلومات'}
            {filterType === 'SUCCESS' && 'نجح'}
            {filterType === 'WARNING' && 'تحذير'}
            {filterType === 'DESTRUCTIVE' && 'خطأ'}
            {filterType === 'PROMO' && 'عروض'}
            {filterType === 'SYSTEM' && 'النظام'}
            {!['ORDER', 'INFO', 'SUCCESS', 'WARNING', 'DESTRUCTIVE', 'PROMO', 'SYSTEM'].includes(String(filterType)) && String(filterType)}
          </a>
        ))}
      </div>
      {notifications.length === 0 ? (
        <div className='py-12 text-center text-gray-400'>لا توجد إشعارات بعد</div>
      ) : (
        notifications.map((notif: UserNotification) => (
          <Card
            key={notif.id}
            className={`flex items-center gap-4 ${!notif.read ? '' : 'opacity-60'}`}
          >
            <CardContent className='flex w-full items-center gap-4'>
              {/* Icon by type */}
              {notif.type === 'ORDER' && <Package className='text-green-500' />}
              {notif.type === 'INFO' && <Bell className='text-blue-400' />}
              {notif.type === 'SUCCESS' && <Bell className='text-green-500' />}
              {notif.type === 'WARNING' && <Bell className='text-yellow-500' />}
              {notif.type === 'DESTRUCTIVE' && <Bell className='text-red-500' />}
              {notif.type === 'PROMO' && <Newspaper className='text-purple-500' />}
              {notif.type === 'SYSTEM' && <Bell className='text-gray-500' />}
              <div className='flex-1'>
                <div className='font-medium'>{notif.title}</div>
                <div className='text-sm text-gray-600'>{notif.body}</div>
                <div className='text-xs text-gray-400'>
                  {new Date(notif.createdAt).toLocaleString('ar-EG')}
                </div>
              </div>
              {!notif.read && <Badge variant='destructive'>جديد</Badge>}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
