import { getMilestonesReportData } from './action/getMilestonesReportData';
import MilestonesReportClient
  from './component/MilestonesReportClient'; // Will create this next

export default async function MilestonesReportPage() {
  // This report currently doesn't use date filters from searchParams for its core data,
  // as it fetches historical milestones. Filters could be added later if needed.
  const data = await getMilestonesReportData();

  return (
    <div className='rtl mx-auto max-w-7xl px-4 py-10 text-right md:px-6'>
      <div className="flex justify-between items-center mb-8">
        <h1 className='text-3xl font-bold text-foreground'>تقرير الإنجازات والأهداف</h1>
      </div>
      <MilestonesReportClient milestones={data.milestones} error={data.error} />
    </div>
  );
}
