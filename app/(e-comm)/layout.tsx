import Footer from './homepage/component/Fotter/Fotter';
import HeaderUnified from './homepage/component/Header/HeaderUnified.server';
import CustomMobileBottomNav from './homepage/component/Header/CustomMobileBottomNav';
import { fetchEcommLayoutData } from './helpers/layoutData';
import FilterAlert from '@/components/FilterAlert';
import RealtimeNotificationListener from './(adminPage)/user/notifications/components/RealtimeNotificationListener';
// import NotificationTest from '@/app/components/NotificationTest';

export default async function EcommerceLayout({ children }: { children: React.ReactNode }) {
  try {
    const {
      companyData,
      session,

      userSummary,
      notificationCount,
      alerts,

      productCount,
      clientCount,
    } = await fetchEcommLayoutData();
    const typedCompanyData = companyData as any;

    return (
      <div className="flex flex-col min-h-screen">
        <HeaderUnified
          user={userSummary}
          unreadCount={notificationCount}
          defaultAlerts={alerts}
          logo={typedCompanyData?.logo || ''}
          logoAlt={typedCompanyData?.fullName || 'Dream to app'}
          isLoggedIn={!!session}
        />
        <FilterAlert />
        <CustomMobileBottomNav />
        {/* Real-time notification listener - only for logged-in users */}
        {session && <RealtimeNotificationListener />}
        {/* Test component for notifications - DEVELOPMENT ONLY */}
        {/* {process.env.NODE_ENV === 'development' && <NotificationTest />} */}
        <main className='flex-grow'>
          <div className='container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-18 md:pt-20 pb-8'>
            {children}
          </div>
        </main>
        <Footer
          companyName={typedCompanyData?.fullName}
          aboutus={typedCompanyData?.bio}
          email={typedCompanyData?.email}
          phone={typedCompanyData?.phoneNumber}
          address={typedCompanyData?.address}
          facebook={typedCompanyData?.facebook}
          instagram={typedCompanyData?.instagram}
          twitter={typedCompanyData?.twitter}
          linkedin={typedCompanyData?.linkedin}
          productCount={productCount}
          clientCount={clientCount}
          userId={userSummary?.id}
        />
      </div>
    );
  } catch (e) {
    return <div>حدث خطأ أثناء تحميل الصفحة. الرجاء المحاولة لاحقًا.</div>;
  }
}
