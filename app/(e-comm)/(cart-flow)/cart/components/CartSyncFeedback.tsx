'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface CartSyncFeedbackProps {
  type: 'loading' | 'success' | 'error';
  message?: string;
}

export const CartSyncFeedback = ({ type, message }: CartSyncFeedbackProps) => {
  const getFeedbackContent = () => {
    switch (type) {
      case 'loading':
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          title: 'جاري مزامنة السلة...',
          variant: 'default' as const,
        };
      case 'success':
        return {
          icon: null,
          title: message || 'تم مزامنة السلة بنجاح',
          variant: 'default' as const,
        };
      case 'error':
        return {
          icon: null,
          title: message || 'فشل في المزامنة، تم الاحتفاظ بالمنتجات الحالية',
          variant: 'destructive' as const,
        };
      default:
        return {
          icon: null,
          title: '',
          variant: 'default' as const,
        };
    }
  };

  const content = getFeedbackContent();

  if (!content.title) return null;

  return (
    <Alert variant={content.variant} className="mb-4">
      {content.icon && <div className="mr-2">{content.icon}</div>}
      <AlertDescription>{content.title}</AlertDescription>
    </Alert>
  );
}; 