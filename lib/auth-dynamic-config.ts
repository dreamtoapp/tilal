// lib/auth-dynamic-config.ts
// Dynamic OAuth configuration for Vercel deployments

export function getNextAuthURL(): string {
  // Production domain (your custom domain)
  if (process.env.VERCEL_ENV === 'production' && process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // Custom production domain
  if (process.env.NEXTAUTH_URL && process.env.NODE_ENV === 'production') {
    return process.env.NEXTAUTH_URL;
  }

  // Preview deployments (automatic)
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Development
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXTAUTH_URL || 'http://localhost:3000';
  }

  // Fallback
  return process.env.NEXTAUTH_URL || 'http://localhost:3000';
}

export function getOAuthCallbackURL(provider: string): string {
  const baseUrl = getNextAuthURL();
  return `${baseUrl}/api/auth/callback/${provider}`;
}

// Helper to get environment-specific OAuth config
export function getOAuthConfig() {
  const isProduction = process.env.VERCEL_ENV === 'production';
  const isPreview = process.env.VERCEL_ENV === 'preview';
  const isDevelopment = process.env.NODE_ENV === 'development';

  return {
    // Google OAuth
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackUrl: getOAuthCallbackURL('google'),
    },
    
    // Base configuration
    baseUrl: getNextAuthURL(),
    environment: {
      isProduction,
      isPreview,
      isDevelopment,
      vercelUrl: process.env.VERCEL_URL,
      customDomain: process.env.NEXTAUTH_URL,
    }
  };
} 