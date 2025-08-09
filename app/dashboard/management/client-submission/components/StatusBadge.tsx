import React from 'react';
import { CheckCircle, Mail } from 'lucide-react';

const StatusBadge: React.FC<{ replied: boolean }> = ({ replied }) => (
    <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold ${replied ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
        {replied ? (
            <CheckCircle className='w-4 h-4' />
        ) : (
            <Mail className='w-4 h-4' />
        )}
    </span>
);

export default StatusBadge; 