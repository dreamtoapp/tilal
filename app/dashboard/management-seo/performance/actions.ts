// app/dashboard/seo/performance/actions.ts
"use server";
import db from '@/lib/prisma';
import { z } from 'zod';
import { ActionError } from '@/types/commonType';

const webVitalSchema = z.object({
  name: z.string(),
  value: z.number(),
  page: z.string(),
  userAgent: z.string(),
  timestamp: z.union([z.string(), z.date()]),
  device: z.string().optional(),
  browser: z.string().optional(),
  additional: z.any().optional(),
});

export async function saveWebVital(data: unknown) {
  const parsed = webVitalSchema.safeParse(data);
  if (!parsed.success) {
    const err: ActionError = { message: 'Invalid web vital payload' };
    throw err;
  }
  const {
    name, value, page, userAgent, timestamp, device, browser, additional
  } = parsed.data;
  try {
    const metric = await db.webVital.create({
      data: {
        name,
        value,
        page,
        userAgent,
        timestamp: new Date(timestamp),
        device,
        browser,
        additional,
      },
    });
    return metric;
  } catch (error) {
    const err: ActionError =
      typeof error === 'object' && error && 'message' in error
        ? { message: (error as ActionError).message, code: (error as ActionError).code }
        : { message: 'فشل في حفظ بيانات الأداء.' };
    throw err;
  }
}

// Add a POST handler for fetching distinct values for filters
export async function POST(req: Request) {
  const { action } = await req.json();
  if (action === "distinct") {
    const [pages, devices, browsers, countries] = await Promise.all([
      db.webVital.findMany({ distinct: ["page"], select: { page: true } }),
      db.webVital.findMany({ distinct: ["device"], select: { device: true } }),
      db.webVital.findMany({ distinct: ["browser"], select: { browser: true } }),
      db.webVital.findMany({ distinct: ["country"], select: { country: true } }),
    ]);
    return Response.json({
      pages: pages.map((x) => x.page).filter(Boolean),
      devices: devices.map((x) => x.device).filter(Boolean),
      browsers: browsers.map((x) => x.browser).filter(Boolean),
      countries: countries.map((x) => x.country).filter(Boolean),
    });
  }
  return Response.json({ error: "Invalid action" }, { status: 400 });
}
