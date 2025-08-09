import { getOrderAnalyticsData } from './action/getOrderAnalyticsData';
import OrderAnalyticsClient from './component/OrderAnalyticsClient';

export default async function OrdersReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const from = sp?.from;
  const to = sp?.to;

  // جلب البيانات من الخادم
  const data = await getOrderAnalyticsData({ from, to });

  return <OrderAnalyticsClient {...data} initialFrom={from} initialTo={to} />;
}
