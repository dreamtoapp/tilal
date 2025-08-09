import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className='flex flex-col items-center justify-center py-8 text-muted-foreground'>
        <Inbox className='w-12 h-12 mb-2' />
        <span className='text-lg font-semibold'>{message}</span>
    </div>
);

export default EmptyState; 