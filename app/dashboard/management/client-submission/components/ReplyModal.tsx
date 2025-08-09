import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ReplyModalProps {
    open: boolean;
    onClose: () => void;
    submission: {
        id: string;
        name: string;
        email: string;
        subject: string;
        message: string;
    } | null;
    onSend: (reply: string) => Promise<void>;
}

const ReplyModal: React.FC<ReplyModalProps> = ({ open, onClose, submission, onSend }) => {
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!open || !submission) return null;

    const handleSend = async () => {
        if (!reply.trim()) {
            setError('الرد مطلوب');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await onSend(reply);
            setReply('');
            onClose();
        } catch (e) {
            setError('حدث خطأ أثناء إرسال الرد');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
            <div className='bg-background rounded-lg shadow-lg p-6 max-w-lg w-full relative'>
                <button
                    className='absolute top-2 left-2 text-muted-foreground hover:text-primary text-lg font-bold'
                    onClick={onClose}
                    aria-label='إغلاق'
                >
                    ×
                </button>
                <h3 className='text-xl font-bold mb-2 text-primary'>رد على: {submission.subject}</h3>
                <div className='mb-2 text-sm text-muted-foreground'>
                    <span className='font-semibold'>من: </span>{submission.name} ({submission.email})
                </div>
                <div className='mb-4 p-3 bg-muted rounded text-foreground whitespace-pre-line'>
                    {submission.message}
                </div>
                <textarea
                    className='w-full border rounded p-2 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary'
                    rows={4}
                    placeholder='اكتب الرد هنا...'
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    disabled={loading}
                />
                {error && <div className='text-red-600 text-xs mb-2'>{error}</div>}
                <div className='flex justify-end'>
                    <Button onClick={handleSend} disabled={loading}>
                        {loading ? 'جاري الإرسال...' : 'إرسال الرد'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ReplyModal; 