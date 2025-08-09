import React from 'react';

interface MessageModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

const MessageModal: React.FC<MessageModalProps> = ({ open, onClose, title, message }) => {
    if (!open) return null;
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
                <h3 className='text-xl font-bold mb-4 text-primary'>{title}</h3>
                <div className='text-foreground whitespace-pre-line'>{message}</div>
            </div>
        </div>
    );
};

export default MessageModal; 