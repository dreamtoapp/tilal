import { getSalesReportData } from './action/getSalesReportData';
import SalesReportClient from './component/SalesReportClient';

function parseDateParam(param?: string) {
  if (!param) return undefined;
  const d = new Date(param);
  return isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

export default async function SalesReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  // Get filter params from URL
  const from = parseDateParam(sp?.from);
  const to = parseDateParam(sp?.to);
  const showAll = sp?.showAll === 'on';

  // Fetch data on the server
  const data = await getSalesReportData({
    from: showAll ? undefined : from,
    to: showAll ? undefined : to,
  });

  // Provide initial values for the client component
  const today = new Date();
  const initialFrom =
    from || new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
  const initialTo = to || today.toISOString().slice(0, 10);
  const initialShowAll = showAll;

  return (
    <SalesReportClient
      {...data}
      initialFrom={initialFrom}
      initialTo={initialTo}
      initialShowAll={initialShowAll}
    />
  );
}
