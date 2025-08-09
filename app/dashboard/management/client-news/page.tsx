import { fetchSubscribers } from './actions/newsletter';
import SubscriberTable from './component/SubscriberTable';

export default async function DashboardPage() {
  const subscribers = await fetchSubscribers();

  return (
    <div className='container mx-auto p-6 text-right' dir='rtl'>
      <h1 className='mb-6 text-center text-3xl font-bold'>مشتركو النشرة الإخبارية</h1>

      {/* Pass subscribers to the Client Component */}
      <SubscriberTable subscribers={subscribers} />
    </div>
  );
}
