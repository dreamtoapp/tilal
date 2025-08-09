import React, {
  memo,
  useMemo,
} from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Badge } from './ui/badge';

interface AppDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  mode: string;
}

const AppDialog: React.FC<AppDialogProps> = memo(({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  footer,
  children,
  className = '',
  mode = 'default',

}) => {
  // Memoize header and footer to avoid unnecessary re-renders
  const header = useMemo(() => (
    (title || description) && (
      <DialogHeader className='space-y-2 mt-5' dir='rtl'>
        <div className='flex items-center justify-between space-x-2'>
          <div className='flex flex-col space-y-1 items-start'>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </div>
          {mode && <Badge variant={mode === 'new' ? 'outline' : 'destructive'}>{mode}</Badge>}
        </div>



      </DialogHeader>
    )
  ), [title, description, mode]);

  const dialogFooter = useMemo(() => footer ? <DialogFooter>{footer}</DialogFooter> : null, [footer]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${className}`}>
        <DialogDescription>مربع حوار تفاعلي.</DialogDescription>
        {header}
        <div className="flex-1 overflow-y-auto px-1">
          {children}
        </div>
        {dialogFooter}
      </DialogContent>
    </Dialog>
  );
});

AppDialog.displayName = 'AppDialog';

export default AppDialog;
