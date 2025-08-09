// app/dashboard/fallback-alerts/page.tsx
// Server page for displaying recent Pusher fallback alerts in the dashboard

import FallbackAlertsLayout, { FallbackAlertType } from './FallbackAlertsLayout';
import db from '@/lib/prisma';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تنبيهات فشل الدعم الفوري | لوحة التحكم',
  description: 'عرض تنبيهات فشل إرسال الدعم الفوري (Pusher fallback alerts) للمشرفين.',
};

// Fetch recent fallback alerts (last 24h, fallback only)
async function getFallbackAlerts(): Promise<FallbackAlertType[]> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const alerts = await db.supportPing.findMany({
    where: { timestamp: { gte: since } },
    orderBy: { timestamp: 'desc' },
    take: 50,
  });
  // Only show fallbacks (simulate with error field or add fallback flag in model if needed)
  return alerts.map((a) => ({
    id: a.id,
    userId: a.userId,
    message: a.message,
    timestamp: a.timestamp.toISOString(), // Ensure string type
  }));
}

export default async function FallbackAlertsPage() {
  const alerts = await getFallbackAlerts();
  return <FallbackAlertsLayout alerts={alerts} />;
}
