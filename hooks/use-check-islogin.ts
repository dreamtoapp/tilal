// lib/auth/client.ts
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { checkIsLogin } from '@/lib/check-is-login';
import { User } from '@/types/databaseTypes';
import { debug } from '@/utils/logger';
// import { useCartStore } from '@/app/(e-comm)/(cart-flow)/cart/cart-controller/cartStore';

// Custom type definitions

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

export const useCheckIsLogin = () => {
  const [session, setSession] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  // Use NextAuth session directly - simpler and more reliable
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        debug('Fetching session from checkIsLogin...');
        const user = await checkIsLogin();
        debug('checkIsLogin result:', !!user, user?.id);

        if (user) {
          setSession(user);
          setStatus('authenticated');
          debug('Set status to authenticated');
        } else {
          setSession(null);
          setStatus('unauthenticated');
          debug('Set status to unauthenticated');
        }
      } catch (sessionError) {
        console.error('Error fetching session:', sessionError instanceof Error ? sessionError.message : 'Unknown error');
        setError(sessionError instanceof Error ? sessionError.message : 'Failed to fetch session');
        setStatus('unauthenticated');
      }
    };

    // Debug logging
    debug('useCheckIsLogin - NextAuth Status:', nextAuthStatus, 'NextAuth Session:', !!nextAuthSession?.user);

    // Simplified logic - use NextAuth status directly
    if (nextAuthStatus === 'authenticated' && nextAuthSession?.user) {
      debug('NextAuth authenticated, fetching session...');
      fetchSession();
    } else if (nextAuthStatus === 'unauthenticated') {
      debug('NextAuth unauthenticated, setting status...');
      setSession(null);
      setStatus('unauthenticated');
    } else if (nextAuthStatus === 'loading') {
      debug('NextAuth loading, setting status...');
      setStatus('loading');
    }

    // Add fallback: if NextAuth is authenticated but we haven't fetched session yet
    if (nextAuthStatus === 'authenticated' && nextAuthSession?.user && status === 'loading') {
      debug('Fallback: NextAuth authenticated but status still loading, fetching session...');
      fetchSession();
    }

  }, [nextAuthSession, nextAuthStatus, status]);

  return {
    session,
    status,
    error,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
};
