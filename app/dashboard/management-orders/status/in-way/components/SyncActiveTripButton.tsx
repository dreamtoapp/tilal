"use client";
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { syncActiveTrip } from '@/utils/syncActiveTrip';
import { toast } from 'sonner';

export default function SyncActiveTripButton() {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncActiveTrip();
      toast.success('تم تحديث الطلبات بنجاح');
    } catch (e) {
      toast.error('فشل في تحديث الطلبات');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={syncing}
      variant="outline"
      size="sm"
      className="gap-2 transition-all duration-150 hover:shadow-md"
    >
      <Icon name="RefreshCw" className={`h-4 w-4 ${syncing ? 'animate-spin' : 'icon-enhanced'}`} />
      {syncing ? "جارٍ التحديث..." : "تحديث الطلبات"}
    </Button>
  );
}
