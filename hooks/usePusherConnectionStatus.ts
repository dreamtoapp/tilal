'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// 🔗 Hook to track Pusher connection status
export default function usePusherConnectionStatus() {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) {
      setIsConnected(false);
      return;
    }

    let pusher: any = null;

    const initializePusher = async () => {
      try {
        const { getPusherClient } = await import('@/lib/pusherClient');
        pusher = await getPusherClient();

        // Connection event handlers
        pusher.connection.bind('connected', () => {
          setIsConnected(true);
        });

        pusher.connection.bind('disconnected', () => {
          setIsConnected(false);
        });

        pusher.connection.bind('failed', () => {
          setIsConnected(false);
        });

        // Set initial state
        setIsConnected(pusher.connection.state === 'connected');

      } catch (error) {
        console.error('Failed to initialize Pusher for connection status:', error);
        setIsConnected(false);
      }
    };

    initializePusher();

    return () => {
      if (pusher?.connection) {
        pusher.connection.unbind('connected');
        pusher.connection.unbind('disconnected');
        pusher.connection.unbind('failed');
      }
    };
  }, [session?.user?.id]);

  return { isConnected };
} 