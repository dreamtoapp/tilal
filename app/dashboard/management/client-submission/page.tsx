// app/dashboard/contact/page.tsx
// import { Suspense } from 'react';
import { fetchSubmissions } from './actions/fetchSubmissions';
import { fetchReplies } from './actions/fetchReplies';
import ClientSubmissionTabs from './components/ClientSubmissionTabs';

export default async function ContactPage() {
  const initialSubmissions = await fetchSubmissions();
  const initialReplies = await fetchReplies();

  return (
    <div className='p-6'>
      <h1 className='mb-6 text-2xl font-bold'>رسائل العملاء</h1>
      <ClientSubmissionTabs initialSubmissions={initialSubmissions} initialReplies={initialReplies} />
    </div>
  );
}
