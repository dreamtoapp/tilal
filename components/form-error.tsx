import React from 'react';

interface FormErrorProps {
  message?: string;
  className?: string;
}

const FormError: React.FC<FormErrorProps> = ({ message, className = '' }) => {
  if (!message) return null;
  return (
    <div className={`flex items-center gap-2 rounded bg-destructive/10 px-2 py-1 text-destructive text-xs font-medium mt-1 ${className}`}>
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-destructive">
        <path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z"/>
      </svg>
      <span>{message}</span>
    </div>
  );
};

export default FormError;
