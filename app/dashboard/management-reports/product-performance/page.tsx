import { getProductPerformanceData } from './action/getProductPerformanceData';
import ProductPerformanceClient from './component/ProductPerformanceClient';

export default async function ProductPerformancePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  // فلترة التاريخ (يمكنك التوسعة لاحقًا)
  const from = sp?.from;
  const to = sp?.to;

  // جلب البيانات من الخادم
  const data = await getProductPerformanceData({ from, to });

  return <ProductPerformanceClient {...data} initialFrom={from} initialTo={to} />;
}
