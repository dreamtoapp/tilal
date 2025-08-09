'use client';
import { useState } from 'react';
// import dynamic from "next/dynamic";
// const Pusher = dynamic(() => import("pusher-js"), { ssr: false });
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from './StatusBadge';
import MessageModal from './MessageModal';
import SearchInput from './SearchInput';
import ReplyCountBadge from './ReplyCountBadge';
import EmptyState from './EmptyState';
import ReplyModal from './ReplyModal';
import { createReplyAction } from '../actions/createReply';
import { Reply as ReplyIcon } from 'lucide-react';
// import { usePusher } from "../../../../provider/pusherContext";

// Define the Submission type
export type Submission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string; // Pre-formatted date string
  replies?: string[]; // Optional replies array
};

// Props for RealTimeTable
type RealTimeTableProps = {
  initialSubmissions: Submission[]; // Define the type for the prop
};

export default function RealTimeTable({ initialSubmissions }: RealTimeTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);

  const handleView = (subject: string, message: string) => {
    setModalTitle(subject);
    setModalMessage(message);
    setModalOpen(true);
  };

  const handleReply = (submission: any) => {
    setSelectedSubmission(submission);
    setReplyModalOpen(true);
  };

  const handleSendReply = async (reply: string) => {
    if (!selectedSubmission) return;
    const formData = new FormData();
    formData.append('submissionId', selectedSubmission.id);
    formData.append('content', reply);
    const res = await createReplyAction(formData);
    if (res.success && res.reply && res.reply.content) {
      setSubmissions(submissions => submissions.map(s =>
        s.id === selectedSubmission.id
          ? { ...s, replies: [...(s.replies || []), res.reply.content] }
          : s
      ));
    }
  };

  const filtered = submissions.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.subject.toLowerCase().includes(q) ||
      s.createdAt.toLowerCase().includes(q)
    );
  });

  return (
    <div className='relative bg-background p-2 sm:p-6 text-foreground'>
      <div className='flex justify-end mb-4'>
        <SearchInput value={search} onChange={setSearch} placeholder='بحث بالاسم أو البريد أو الموضوع أو التاريخ...' />
      </div>
      {/* Title and Total Messages Count */}
      <div className='mb-4 text-right'>
        <h1 className='mb-2 text-2xl font-bold text-primary'>الرسائل الواردة</h1>
        <span className='font-medium text-muted-foreground'>
          إجمالي الرسائل: {filtered.length}
        </span>
      </div>
      <div className='overflow-x-auto rounded'>
        <Table className='min-w-[900px]'>
          {/* Styled Table Header */}
          <TableHeader className='bg-muted/50 sticky top-0 z-10'>
            <TableRow>
              <TableHead className='text-right font-bold text-muted-foreground'>الحالة</TableHead>
              <TableHead className='text-right font-bold text-muted-foreground'>الاسم</TableHead>
              <TableHead className='text-right font-bold text-muted-foreground'>
                البريد الإلكتروني
              </TableHead>
              <TableHead className='text-right font-bold text-muted-foreground'>الموضوع</TableHead>
              <TableHead className='text-right font-bold text-muted-foreground'>الرسالة</TableHead>
              <TableHead className='text-right font-bold text-muted-foreground'>
                تاريخ الاستلام
              </TableHead>
              <TableHead className='text-right font-bold text-muted-foreground'>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            <AnimatePresence>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState message='لا توجد رسائل مطابقة لبحثك حالياً.' />
                  </td>
                </tr>
              ) : (
                filtered.map((submission, index) => (
                  <motion.tr
                    key={submission.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`${index % 2 === 0 ? 'bg-muted/50' : 'bg-background'} transition-colors hover:bg-primary/10 align-middle`}
                  >
                    <TableCell className='text-right'>
                      <StatusBadge replied={!!(submission.replies && submission.replies.length)} />
                    </TableCell>
                    <TableCell className='text-right text-foreground'>{submission.name}</TableCell>
                    <TableCell className='text-right text-foreground'>{submission.email}</TableCell>
                    <TableCell className='text-right text-foreground'>{submission.subject}</TableCell>
                    <TableCell className='line-clamp-2 text-right text-muted-foreground max-w-xs'>
                      {submission.message.length > 60 ? (
                        <>
                          {submission.message.slice(0, 60)}...
                          <button
                            className='ml-2 text-primary underline text-xs'
                            onClick={() => handleView(submission.subject, submission.message)}
                          >
                            عرض
                          </button>
                        </>
                      ) : (
                        submission.message
                      )}
                    </TableCell>
                    <TableCell className='text-right text-muted-foreground'>
                      {submission.createdAt}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center gap-2'>
                        <Button variant='outline' size='sm' className='w-full flex items-center gap-1 justify-center' onClick={() => handleReply(submission)}>
                          <ReplyIcon className='w-4 h-4 mr-1' />
                          رد
                        </Button>
                        <ReplyCountBadge count={submission.replies ? submission.replies.length : 0} />
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      <MessageModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
      />

      <ReplyModal
        open={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        submission={selectedSubmission}
        onSend={handleSendReply}
      />
    </div>
  );
}

export function RealTimeTableSkeleton() {
  return (
    <div className='relative bg-background p-2 sm:p-6 text-foreground'>
      <div className='flex justify-end mb-4'>
        <div className='h-8 w-64 bg-muted animate-pulse rounded' />
      </div>
      <div className='mb-4 text-right'>
        <div className='h-6 w-32 bg-muted animate-pulse rounded mb-2' />
        <div className='h-4 w-24 bg-muted animate-pulse rounded' />
      </div>
      <div className='overflow-x-auto rounded'>
        <table className='min-w-[900px]'>
          <thead className='bg-muted/50 sticky top-0 z-10'>
            <tr>
              {Array.from({ length: 8 }).map((_, i) => (
                <th key={i} className='p-3'>
                  <div className='h-4 w-20 bg-muted animate-pulse rounded' />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 8 }).map((_, j) => (
                  <td key={j} className='p-3'>
                    <div className='h-4 w-full bg-muted animate-pulse rounded' />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
