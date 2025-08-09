import DriverHeader from './components/DriverHeader';
import FooterTabs from './components/FooterTabs';
import getSession from '@/lib/getSession';
import { getOrderCount } from './actions/getOrderCount';
// import ServiceWorkerRegistration from './components/ServiceWorkerRegistration';

export default async function DriverLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    const user = session?.user;
    const driverId = user?.id || '';
    const drivername = user?.name || 'السائق';
    const avatarUrl = user?.image || undefined;
    const orderCount = driverId ? await getOrderCount(driverId) : { counts: { assigned: 0, delivered: 0, canceled: 0 } };

    return (
        <>
            {/* <ServiceWorkerRegistration /> */}
            <div className="flex min-h-screen w-full flex-col items-center justify-between bg-background">
                <DriverHeader
                    drivername={drivername}
                    avatarUrl={avatarUrl}
                    driverId={driverId}
                    assignedOrders={orderCount.counts?.assigned || 0}
                />
                <main className="flex-1 w-full max-w-md mx-auto ">{children}</main>
                <FooterTabs
                    assignedOrders={orderCount.counts?.assigned || 0}
                    deliveredOrders={orderCount.counts?.delivered || 0}
                    canceledOrders={orderCount.counts?.canceled || 0}
                    driverId={driverId}
                />
            </div>
        </>
    );
} 