'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    
    // Function to check if the query matches
    const updateMatches = () => {
      if (typeof window !== 'undefined') {
        setMatches(window.matchMedia(query).matches);
      }
    };
    
    // Initial check
    updateMatches();
    
    // Create media query listener
    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener('change', updateMatches);
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', updateMatches);
    };
  }, [query]);

  // Return false during SSR to prevent hydration mismatch
  return mounted ? matches : false;
} 