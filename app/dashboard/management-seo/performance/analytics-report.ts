// app/dashboard/seo/performance/analytics-report.ts
"use server";
import db from '@/lib/prisma';
import { ActionError } from '@/types/commonType';

export async function getWebVitalsAnalytics({
  page,
  device,
  browser,
  city,
  country,
  metric,
  dateFrom,
  dateTo,
}: {
  page?: string;
  device?: string;
  browser?: string;
  city?: string;
  country?: string;
  metric?: string;
  dateFrom?: Date;
  dateTo?: Date;
}) {
  try {
    // Build dynamic filter
    const where: any = {};
    if (page) where.page = page;
    if (device) where.device = device;
    if (browser) where.browser = browser;
    if (city) where.city = city;
    if (country) where.country = country;
    if (metric) where.name = metric;
    if (dateFrom || dateTo) {
      where.timestamp = {};
      if (dateFrom) where.timestamp.gte = dateFrom;
      if (dateTo) where.timestamp.lte = dateTo;
    }

    // Query all matching vitals
    const vitals = await db.webVital.findMany({ where });
    if (!vitals.length) return { count: 0, avg: null, p75: null, p95: null, min: null, max: null };

    // Calculate analytics
    const values = vitals.map(v => v.value).sort((a, b) => a - b);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const p75 = values[Math.floor(values.length * 0.75)];
    const p95 = values[Math.floor(values.length * 0.95)];
    const min = values[0];
    const max = values[values.length - 1];

    return {
      count: values.length,
      avg,
      p75,
      p95,
      min,
      max,
      values, // for charting
    };
  } catch (error) {
    const err: ActionError =
      typeof error === 'object' && error && 'message' in error
        ? { message: (error as ActionError).message, code: (error as ActionError).code }
        : { message: 'فشل في جلب بيانات تحليلات الأداء.' };
    throw err;
  }
}
