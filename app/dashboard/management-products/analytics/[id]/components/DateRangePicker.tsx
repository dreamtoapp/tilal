'use client';
import React, { useState } from 'react';

export default function DateRangePicker({
    valueFrom,
    valueTo,
    onChange,
}: {
    valueFrom?: string;
    valueTo?: string;
    onChange: (from: string, to: string) => void;
}) {
    // Use controlled component pattern: internal state syncs with props
    const [from, setFrom] = useState(valueFrom || '');
    const [to, setTo] = useState(valueTo || '');

    // Effect to update internal state if props change (e.g., "Apply Full Range" button)
    React.useEffect(() => {
        if (valueFrom !== undefined) setFrom(valueFrom);
    }, [valueFrom]);

    React.useEffect(() => {
        if (valueTo !== undefined) setTo(valueTo);
    }, [valueTo]);

    return (
        <div className='flex items-center gap-2'>
            <label className='text-xs text-muted-foreground'>من</label>
            <input
                type='date'
                value={from} // Controlled by internal state
                onChange={(e) => {
                    const newFrom = e.target.value;
                    setFrom(newFrom); // Update internal state
                    onChange(newFrom, to); // Call parent's onChange
                }}
                className='rounded border-border bg-input px-2 py-1 text-xs text-foreground focus:ring-1 focus:ring-ring focus:outline-none'
            />
            <label className='text-xs text-muted-foreground'>إلى</label>
            <input
                type='date'
                value={to} // Controlled by internal state
                onChange={(e) => {
                    const newTo = e.target.value;
                    setTo(newTo); // Update internal state
                    onChange(from, newTo); // Call parent's onChange
                }}
                className='rounded border-border bg-input px-2 py-1 text-xs text-foreground focus:ring-1 focus:ring-ring focus:outline-none'
            />
        </div>
    );
} 