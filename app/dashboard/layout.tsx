import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { UserRole } from '@prisma/client';
import NotificationPortal from '@/components/ui/NotificationPortal';
import ServiceWorkerRegistration from '@/app/components/ServiceWorkerRegistration';
import AdminNotificationWrapper from '@/app/components/AdminNotificationWrapper';
import DashboardNav from './components/DashboardNav';
import DashboardFooter from './components/DashboardFooter';
import { getPendingOrdersCount } from './helpers/navigationMenu';

export default async function LayoutNew({ children }: { children: React.ReactNode }) {
    // This layout is used for the dashboard pages
    const session = await auth();
    // Fix: Accept both string and enum for role, and handle legacy lowercase roles
    const userRole = (session?.user as { role?: string })?.role;
    if (!session?.user || (userRole !== UserRole.ADMIN && userRole !== 'ADMIN')) {
        return redirect('/auth/login');
    }

    // Fetch pending orders count for navigation badge
    const pendingOrdersCount = await getPendingOrdersCount();

    // Hardcode RTL for now; in the future, detect from language/i18n
    return (
        <div className='flex min-h-screen w-full bg-background flex-col' dir='rtl'>
            {/* Top Navigation Bar */}
            <DashboardNav pendingOrdersCount={pendingOrdersCount} />

            {/* Main Content Area */}
            <div className='flex flex-1 flex-col pt-16'>
                <main className='w-full flex-1 bg-background p-6 flex flex-col'>
                    {children}
                </main>

                {/* Footer */}
                <DashboardFooter />
            </div>

            {/* Notification Components */}
            <NotificationPortal />
            <ServiceWorkerRegistration />
            <AdminNotificationWrapper />
        </div>
    );
} 