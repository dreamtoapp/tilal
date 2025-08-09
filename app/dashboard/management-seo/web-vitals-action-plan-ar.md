# خطة عمل متكاملة للاستفادة القصوى من web-vitals في منصة Next.js

## مقدمة

مكتبة [web-vitals](https://web.dev/vitals/) من Google تتيح لك قياس أهم مؤشرات الأداء الحقيقية (LCP, CLS, INP, FID, TTFB) مباشرة من المستخدمين. دمجها بشكل صحيح في مشروعك يمنحك رؤية دقيقة حول تجربة المستخدم ويساعدك في تحسين سرعة الموقع، التفاعل، وثبات التصميم.

---

## 1. لماذا web-vitals؟
- **قياس الأداء الحقيقي** من منظور المستخدم النهائي.
- **تحديد مشاكل الأداء بدقة** (صفحات بطيئة، مشاكل في التفاعل أو الثبات).
- **تحسين ترتيب الموقع في نتائج البحث** (Google تستخدم هذه المؤشرات في الترتيب).
- **مراقبة مستمرة للأداء بعد كل تحديث أو نشر.**

---

## 2. ما الذي سنقيسه؟
- **LCP** (Largest Contentful Paint): سرعة تحميل العنصر الرئيسي.
- **CLS** (Cumulative Layout Shift): ثبات التصميم وعدم تحرك العناصر بشكل مفاجئ.
- **INP** (Interaction to Next Paint): سرعة استجابة الموقع للتفاعل.
- **FID** (First Input Delay): تأخير أول تفاعل (مهم للمتصفحات القديمة).
- **TTFB** (Time to First Byte): سرعة استجابة الخادم.

---

## 3. خطة التنفيذ خطوة بخطوة

### الخطوة 1: تثبيت المكتبة
```pwsh
pnpm add web-vitals
```

### الخطوة 2: إنشاء ملف قياس مركزي
أنشئ ملف `lib/web-vitals.ts`:
```ts
import { getCLS, getFID, getLCP, getINP, getTTFB } from 'web-vitals';
export function reportWebVitals(onReport: (metric: any) => void) {
  getCLS(onReport);
  getFID(onReport);
  getLCP(onReport);
  getINP(onReport);
  getTTFB(onReport);
}
```

### الخطوة 3: جمع البيانات من المتصفح (مكون Client صغير)
- أنشئ مكون React Client (مثلاً: `WebVitalsCollector.tsx`) وضعه فقط في صفحة `/dashboard/seo/performance`:
```tsx
'use client';
import { useEffect } from 'react';
import { reportWebVitals } from '@/lib/web-vitals';

export default function WebVitalsCollector() {
  useEffect(() => {
    reportWebVitals(async (metric) => {
      // استدعاء Server Action مباشرة لمسار page server action
      await fetch('/dashboard/seo/performance/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
      });
    });
  }, []);
  return null;
}
```

> **ملاحظة:** لا تضع هذا المكون في layout أو أي مكان عام، بل فقط في صفحة الأداء.

### الخطوة 4: إنشاء Server Action لتخزين البيانات
- في `app/dashboard/seo/performance/collect/route.ts`:
```ts
import { NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';

export async function POST(req: NextRequest) {
  const metric = await req.json();
  // خزّن النتائج في قاعدة بيانات أو ملف
  await writeFile('web-vitals.log', JSON.stringify(metric) + '\n', { flag: 'a' });
  return new Response('ok');
}
```

### الخطوة 5: عرض البيانات في صفحة الأداء (Server Component)
- أنشئ صفحة `/dashboard/seo/performance/page.tsx`:
```tsx
import fs from 'fs/promises';
import WebVitalsCollector from '@/components/seo/WebVitalsCollector';

export default async function PerformancePage() {
  let vitals = [];
  try {
    const data = await fs.readFile('web-vitals.log', 'utf-8');
    vitals = data.trim().split('\n').map(JSON.parse);
  } catch {}

  // تحليل البيانات (مثلاً: حساب المتوسط لكل مؤشر)
  const lcpValues = vitals.filter(v => v.name === 'LCP').map(v => v.value);
  const avgLCP = lcpValues.length ? (lcpValues.reduce((a, b) => a + b, 0) / lcpValues.length).toFixed(2) : '-';

  return (
    <div>
      <WebVitalsCollector />
      <h1>أداء الموقع (Core Web Vitals)</h1>
      <p>متوسط LCP: {avgLCP} ثانية</p>
      {/* أضف رسومات بيانية أو جداول لباقي المؤشرات */}
    </div>
  );
}
```

### الخطوة 6: تحليل النتائج وعرضها في لوحة التحكم
- أنشئ صفحة `/dashboard/seo/performance`.
- اجلب البيانات من API أو قاعدة البيانات.
- اعرض القيم الحالية لكل مؤشر (LCP, CLS, INP, FID, TTFB) مع رسومات بيانية (استخدم مكتبة مثل [recharts](https://recharts.org/) أو [chart.js](https://www.chartjs.org/)).
- أضف تنبيهات تلقائية إذا تجاوزت القيم الحدود الموصى بها (مثلاً: LCP > 2.5s).

---

## 4. نصائح للاستفادة القصوى
- **قس الأداء لكل صفحة وليس فقط الصفحة الرئيسية.**
- **اربط النتائج مع بيانات المستخدم (device, browser, locale) لتحليل المشاكل بدقة.**
- **استخدم النتائج لتحديد أولويات التحسين (مثلاً: صفحات المنتجات البطيئة أولاً).**
- **ادمج النتائج مع تقارير Google Analytics أو Search Console لمزيد من التحليل.**
- **قم بمراجعة النتائج بعد كل نشر أو تحديث رئيسي.**

---

## 5. مثال عملي كامل (ملخص)

1. أضف web-vitals:
   ```pwsh
   pnpm add web-vitals
   ```
2. lib/web-vitals.ts:
   ```ts
   import { getCLS, getFID, getLCP, getINP, getTTFB } from 'web-vitals';
   export function reportWebVitals(onReport: (metric: any) => void) {
     getCLS(onReport);
     getFID(onReport);
     getLCP(onReport);
     getINP(onReport);
     getTTFB(onReport);
   }
   ```
3. لا تضع أي كود web-vitals أو useEffect في app/layout.tsx إطلاقًا إذا كان SSR. اجمع البيانات فقط في صفحة الأداء عبر مكون Client صغير.

4. app/api/web-vitals/route.ts:
   ```ts
   import { NextRequest } from 'next/server';
   import { writeFile } from 'fs/promises';
   export async function POST(req: NextRequest) {
     const metric = await req.json();
     await writeFile('web-vitals.log', JSON.stringify(metric) + '\n', { flag: 'a' });
     return new Response('ok');
   }
   ```
5. أنشئ صفحة أداء في لوحة التحكم لعرض النتائج وتحليلها.

---

## 6. مصادر مفيدة
- [web.dev/vitals](https://web.dev/vitals/)
- [web-vitals npm](https://www.npmjs.com/package/web-vitals)
- [تحليل الأداء في Next.js](https://nextjs.org/docs/advanced-features/measuring-performance)

---

باتباع هذه الخطة ستحصل على رؤية دقيقة وفورية لأداء موقعك من منظور المستخدم الفعلي، وستتمكن من تحسين تجربة المستخدم ورفع ترتيب موقعك في نتائج البحث.

---

## خطة عمل web-vitals مع Server Actions وبدون API Route أو useEffect في layout

### 1. جمع البيانات من المتصفح (مكون Client مخصص لصفحة الأداء فقط)
- أنشئ مكون React Client (مثلاً: `WebVitalsCollector.tsx`) وضعه فقط في صفحة `/dashboard/seo/performance`:

```tsx
'use client';
import { useEffect } from 'react';
import { reportWebVitals } from '@/lib/web-vitals';

export default function WebVitalsCollector() {
  useEffect(() => {
    reportWebVitals(async (metric) => {
      // استدعاء Server Action مباشرة لمسار page server action
      await fetch('/dashboard/seo/performance/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
      });
    });
  }, []);
  return null;
}
```

> **ملاحظة:** لا تضع هذا المكون في layout أو أي مكان عام، بل فقط في صفحة الأداء.

### 2. إنشاء Server Action لتخزين البيانات
- في `app/dashboard/seo/performance/collect/route.ts`:

```ts
import { NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';

export async function POST(req: NextRequest) {
  const metric = await req.json();
  // خزّن النتائج في قاعدة بيانات أو ملف
  await writeFile('web-vitals.log', JSON.stringify(metric) + '\n', { flag: 'a' });
  return new Response('ok');
}
```

### 3. عرض البيانات في صفحة الأداء (Server Component)
- أنشئ صفحة `/dashboard/seo/performance/page.tsx`:

```tsx
import fs from 'fs/promises';
import WebVitalsCollector from '@/components/seo/WebVitalsCollector';

export default async function PerformancePage() {
  let vitals = [];
  try {
    const data = await fs.readFile('web-vitals.log', 'utf-8');
    vitals = data.trim().split('\n').map(JSON.parse);
  } catch {}

  // تحليل البيانات (مثلاً: حساب المتوسط لكل مؤشر)
  const lcpValues = vitals.filter(v => v.name === 'LCP').map(v => v.value);
  const avgLCP = lcpValues.length ? (lcpValues.reduce((a, b) => a + b, 0) / lcpValues.length).toFixed(2) : '-';

  return (
    <div>
      <WebVitalsCollector />
      <h1>أداء الموقع (Core Web Vitals)</h1>
      <p>متوسط LCP: {avgLCP} ثانية</p>
      {/* أضف رسومات بيانية أو جداول لباقي المؤشرات */}
    </div>
  );
}
```

### 4. أين تظهر البيانات؟
- البيانات ستظهر فقط في صفحة `/dashboard/seo/performance`.
- لا حاجة لأي useEffect في layout أو أي API route عام.
- كل شيء يتم عبر Server Action خاص بالصفحة.

---

## ملخص
- اجمع بيانات web-vitals فقط عند زيارة صفحة الأداء.
- استخدم مكون Client صغير في الصفحة فقط.
- Server Action يستقبل البيانات ويخزنها.
- صفحة Server Component تعرض التحليل مباشرة.
- لا تضع أي كود web-vitals في layout أو في أي مكان عام.

> **تأكيد:** في Next.js 15، استخدم فقط Server Action (route handler) لجمع بيانات web-vitals، ولا تستخدم أي API route أو كود في layout. كل شيء يتم في صفحة الأداء فقط.
