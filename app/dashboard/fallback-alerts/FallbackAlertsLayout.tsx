// app/dashboard/FallbackAlertsLayout.tsx
// UI layout for displaying recent Pusher fallback alerts to admins (dashboard scope)
// Follows project coding standards and best UX practices

import React from 'react';
import { iconVariants } from '@/lib/utils';
import { Icon } from '@/components/icons/Icon';

// Props: Array of fallback alert objects
export type FallbackAlertType = {
  id: string;
  userId: string;
  message: string;
  timestamp: string;
  error?: string;
};

interface FallbackAlertsLayoutProps {
  alerts: FallbackAlertType[];
}

const FallbackAlertsLayout: React.FC<FallbackAlertsLayoutProps> = ({ alerts }) => {
  return (
    <section className='mx-auto w-full max-w-2xl p-4'>
      <h2 className='mb-4 flex items-center gap-2 text-xl font-bold text-yellow-700'>
        <Icon name="AlertTriangle" size="md" animation="pulse" className={iconVariants({ size: 'md', animation: 'pulse', className: 'text-yellow-500' })} />
        تنبيهات فشل إرسال الدعم الفوري (Fallback Alerts)
      </h2>
      {alerts.length === 0 ? (
        <div className='py-8 text-center text-gray-400'>لا توجد تنبيهات فشل حالياً</div>
      ) : (
        <ul className='space-y-4'>
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className='flex flex-col gap-1 rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-4 shadow'
            >
              <div className='flex items-center gap-2'>
                <Icon name="Zap" size="sm" animation="pulse" className="h-5 w-5 text-yellow-400 animate-pulse" />
                <span className='font-semibold text-yellow-800'>User: {alert.userId}</span>
                <span className='ml-auto text-xs text-gray-500'>
                  {new Date(alert.timestamp).toLocaleString('ar-EG')}
                </span>
              </div>
              <div className='mt-1 text-gray-800'>{alert.message}</div>
              {alert.error && <div className='mt-1 text-xs text-red-500'>خطأ: {alert.error}</div>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default FallbackAlertsLayout;
