import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This middleware is now empty because static headers should be set in next.config.js for best practice.
// Only add dynamic logic here if needed (e.g., authentication, conditional redirects, etc.)
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

// Configure middleware to run on specific paths (keep if you plan to add dynamic logic later)
export const config = {
  matcher: [
    '/(e-comm)/:path*',
    '/images/:path*',
    '/fonts/:path*',
    '/fallback/:path*',
  ],
};
