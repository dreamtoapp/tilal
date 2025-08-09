'use client';

import { Loader2 } from 'lucide-react';

interface CartSyncIndicatorProps {
  isSyncing: boolean;
  className?: string;
}

export const CartSyncIndicator = ({ isSyncing, className = '' }: CartSyncIndicatorProps) => {
  if (!isSyncing) return null;

  return (
    <div className={`flex items-center gap-1 text-xs text-muted-foreground ${className}`}>
      <Loader2 className="h-3 w-3 animate-spin" />
      <span>مزامنة</span>
    </div>
  );
}; 