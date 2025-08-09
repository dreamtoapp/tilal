'use client';
import { useState, Suspense } from 'react';
import RealTimeTable from './RealTimeTable';
import OutgoingRepliesTable from './OutgoingRepliesTable';
import { RealTimeTableSkeleton } from './RealTimeTable';

export default function ClientSubmissionTabs({ initialSubmissions, initialReplies }: { initialSubmissions: any[]; initialReplies: any[] }) {
    const [tab, setTab] = useState<'incoming' | 'outgoing'>('incoming');

    return (
        <div>
            <div className='mb-6 flex gap-4'>
                <button
                    className={`px-4 py-2 rounded ${tab === 'incoming' ? 'bg-primary text-white' : 'bg-muted text-foreground'}`}
                    onClick={() => setTab('incoming')}
                >
                    الرسائل الواردة
                </button>
                <button
                    className={`px-4 py-2 rounded ${tab === 'outgoing' ? 'bg-primary text-white' : 'bg-muted text-foreground'}`}
                    onClick={() => setTab('outgoing')}
                >
                    الرسائل الصادرة
                </button>
            </div>
            {tab === 'incoming' ? (
                <Suspense fallback={<RealTimeTableSkeleton />}>
                    <RealTimeTable initialSubmissions={initialSubmissions} />
                </Suspense>
            ) : (
                <OutgoingRepliesTable initialReplies={initialReplies} />
            )}
        </div>
    );
} 