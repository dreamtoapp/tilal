'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

// 🔔 Client-side notification counter hook
export function useNotificationCounter(initialCount: number = 0) {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(initialCount);

  // Sync with initial server count
  useEffect(() => {
    setUnreadCount(initialCount);
  }, [initialCount]);

  // Functions to update counter
  const incrementCount = useCallback(() => {
    setUnreadCount(prev => prev + 1);
  }, []);

  const decrementCount = useCallback(() => {
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const updateCount = useCallback((newCount: number) => {
    setUnreadCount(Math.max(0, newCount));
  }, []);

  const resetCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  // Fetch fresh count from server
  const refreshCount = useCallback(async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch('/api/user/notifications/count');
      const data = await response.json();
      if (data.success) {
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error('Failed to refresh notification count:', error);
    }
  }, [session?.user?.id]);

  return {
    unreadCount,
    incrementCount,
    decrementCount,
    updateCount,
    resetCount,
    refreshCount
  };
} 