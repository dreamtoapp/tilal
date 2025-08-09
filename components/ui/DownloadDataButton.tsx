'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

interface DownloadDataButtonProps {
  targetRef: React.RefObject<HTMLElement>;
  fileName?: string;
  buttonText?: string;
  className?: string;
}

// This component is a lightweight alternative to PDF export
const DownloadDataButton: React.FC<DownloadDataButtonProps> = ({
  buttonText = 'تصدير البيانات',
  className = '',
}) => {
  return (
    <Button
      type='button'
      className={`cursor-not-allowed bg-gray-400 opacity-60 shadow ${className}`}
      aria-label='تصدير البيانات'
      disabled
      title='ميزة تصدير البيانات غير مفعلة حالياً'
    >
      {buttonText}
    </Button>
  );
};

export default DownloadDataButton;
