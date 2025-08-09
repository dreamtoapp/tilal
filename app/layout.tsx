import './globals.css';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from '@/components/ui/sonner';
import { cairo } from './font';
import { GoogleAnalytics } from '@next/third-parties/google';

import { Directions } from '../constant/enums';
import NextAuthSessionProvider from '../providers/session-provider';
import { ThemeProvider } from '../providers/theme-provider';
import WebVitalsCollector from '@/components/seo/WebVitalsCollector';
import { TooltipProvider } from '@/components/ui/tooltip';
import ServiceWorkerRegistration from '@/app/components/ServiceWorkerRegistration';

export const metadata: Metadata = {
  title: 'Dream To App',
  manifest: '/manifest.webmanifest', // Automatically mapped
  // themeColor: "#2196f3",
  appleWebApp: {
    capable: true,
    title: 'Dream To App',
    statusBarStyle: 'black-translucent',
  },
};


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = 'ar'; // Hardcoded for now
  const dir = Directions.RTL; // Set direction dynamically later

  return (
    // <SessionProvider>
    <html lang={locale} dir={dir} suppressHydrationWarning>
      {/* <head>{head()}</head> */}
      <body className={`${cairo.className} min-h-screen bg-background antialiased`}>
        <ServiceWorkerRegistration />
        <NextAuthSessionProvider>
          <WebVitalsCollector />
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <NextTopLoader />
              <main className='min-h-screen'>{children}</main>
              <Toaster position='top-center' />
            </TooltipProvider>
          </ThemeProvider>
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || ''} />
        </NextAuthSessionProvider>
        {/* </NotificationsProvider> */}
      </body>
    </html>
    // </SessionProvider>
  );
}
