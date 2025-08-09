import { getDashboardSummary } from '@/lib/dashboardSummary';

import DashboardHomePage from './management-dashboard/components/DashboardHomePage';

export default async function DashboardHome() {
  const summary = await getDashboardSummary();
  return <DashboardHomePage summary={summary} />;
}
