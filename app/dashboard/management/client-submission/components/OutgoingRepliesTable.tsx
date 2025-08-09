import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const OutgoingRepliesTable: React.FC<{ initialReplies: any[] }> = ({ initialReplies }) => {
    const [search, setSearch] = useState('');
    const [modalData, setModalData] = useState<any>(null);

    const filtered = initialReplies.filter((r) => {
        const q = search.toLowerCase();
        return (
            (r.contactSubmission?.name || '').toLowerCase().includes(q) ||
            (r.contactSubmission?.subject || '').toLowerCase().includes(q) ||
            (r.content || '').toLowerCase().includes(q)
        );
    });

    return (
        <div className='border rounded p-2 sm:p-4 bg-background overflow-x-auto'>
            <h2 className='text-lg font-semibold mb-4'>الرسائل الصادرة</h2>
            <div className='flex justify-end mb-4'>
                <input
                    type='text'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder='بحث بالعميل أو الموضوع أو الرد...'
                    className='border border-muted rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-primary text-sm'
                    aria-label='بحث'
                />
            </div>
            <div className='overflow-x-auto rounded'>
                <table className='w-full min-w-[900px]'>
                    <thead className='bg-muted/50 sticky top-0 z-10'>
                        <tr>
                            <th className='p-3 text-right font-bold text-muted-foreground'>العميل</th>
                            <th className='p-3 text-right font-bold text-muted-foreground'>الموضوع</th>
                            <th className='p-3 text-right font-bold text-muted-foreground'>الرد</th>
                            <th className='p-3 text-right font-bold text-muted-foreground'>تاريخ الإرسال</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={4} className='text-center py-8 text-muted-foreground'>لا توجد ردود مطابقة لبحثك حالياً.</td>
                            </tr>
                        ) : (
                            filtered.map((reply, i) => (
                                <tr key={reply.id} className={i % 2 === 0 ? 'bg-muted/50' : 'bg-background'}>
                                    <td className='p-3 text-right'>{reply.contactSubmission?.name || '-'}</td>
                                    <td className='p-3 text-right'>{reply.contactSubmission?.subject || '-'}</td>
                                    <td className='p-3 text-right max-w-xs'>
                                        <span className='inline-flex items-center gap-1'>
                                            <Mail className='w-4 h-4 text-primary' />
                                            {reply.content.length > 60 ? (
                                                <>
                                                    {reply.content.slice(0, 60)}...
                                                    <button
                                                        className='ml-2 text-primary underline text-xs'
                                                        onClick={() => setModalData(reply)}
                                                    >
                                                        عرض المزيد
                                                    </button>
                                                </>
                                            ) : (
                                                reply.content
                                            )}
                                        </span>
                                    </td>
                                    <td className='p-3 text-right whitespace-nowrap'>{reply.sentAt ? new Date(reply.sentAt).toLocaleString('ar-EG') : '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {modalData && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
                    <div className='bg-background rounded-lg shadow-lg p-6 max-w-lg w-full relative'>
                        <button
                            className='absolute top-2 left-2 text-muted-foreground hover:text-primary text-lg font-bold'
                            onClick={() => setModalData(null)}
                            aria-label='إغلاق'
                        >
                            ×
                        </button>
                        <h3 className='text-xl font-bold mb-2 text-primary'>تفاصيل الرد</h3>
                        <div className='mb-2 text-sm text-muted-foreground'>
                            <span className='font-semibold'>العميل: </span>{modalData.contactSubmission?.name || '-'}
                        </div>
                        <div className='mb-2 text-sm text-muted-foreground'>
                            <span className='font-semibold'>الموضوع: </span>{modalData.contactSubmission?.subject || '-'}
                        </div>
                        <div className='mb-2 text-sm text-muted-foreground'>
                            <span className='font-semibold'>تاريخ الإرسال: </span>{modalData.sentAt ? new Date(modalData.sentAt).toLocaleString('ar-EG') : '-'}
                        </div>
                        <div className='mb-4 text-sm text-muted-foreground'>
                            <span className='font-semibold'>الرسالة الأصلية: </span>
                            <div className='p-2 bg-muted rounded mt-1 text-foreground whitespace-pre-line'>
                                {modalData.contactSubmission?.message || '-'}
                            </div>
                        </div>
                        <div className='mb-4 text-sm text-muted-foreground'>
                            <span className='font-semibold'>الرد: </span>
                            <div className='p-2 bg-green-50 rounded mt-1 text-foreground whitespace-pre-line'>
                                {modalData.content}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OutgoingRepliesTable; 