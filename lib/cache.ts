import { cache as reactCache } from 'react';
import { unstable_cache as nextCache } from 'next/cache';

// cacheData: Next.js/React 19 best practice cache utility
// Usage: cacheData(fn, keyArray, { revalidate, tags })
export function cacheData(
  cb: (...args: any[]) => Promise<any>,
  keyArray: string[],
  options: { revalidate?: number | false; tags?: string[] },
) {
  return (...args: any[]) => nextCache(reactCache(cb), keyArray, options)(...args);
}

