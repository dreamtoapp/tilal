import { getFinanceReportData } from './action/getFinanceReportData';
import FinanceReportClient from './component/FinanceReportClient';

export default async function FinanceReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const from = sp?.from;
  const to = sp?.to;

  // جلب البيانات من الخادم
  const data = await getFinanceReportData({ from, to });

  return <FinanceReportClient {...data} initialFrom={from} initialTo={to} />;
}
