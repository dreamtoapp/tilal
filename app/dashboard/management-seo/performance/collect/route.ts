import { NextRequest } from 'next/server';
import db from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    let metric;
    try {
      // Defensive: handle empty body (req.body is always defined in Next.js, but body may be empty)
      const text = await req.text();
      if (!text) {
        return new Response('No body', { status: 400 });
      }
      metric = JSON.parse(text);
    } catch (e) {
      return new Response('Invalid JSON', { status: 400 });
    }
    // Store the metric in the database
    await db.webVital.create({
      data: {
        name: metric.name,
        value: Number(metric.value),
        page: metric.page,
        userAgent: metric.userAgent,
        timestamp: new Date(metric.timestamp),
        device: metric.device,
        browser: metric.browser,
        city: metric.city,
        country: metric.country,
        additional: metric.additional ?? undefined,
      },
    });
    return new Response('ok');
  } catch (e) {
    console.error('Web Vitals Collect Error:', e);
    return new Response('error', { status: 500 });
  }
}
