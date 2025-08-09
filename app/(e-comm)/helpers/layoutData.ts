import getSession from '@/lib/getSession';
import db from '@/lib/prisma';
import { companyInfo } from '../actions/companyDetail';
import { userProfile } from '../(adminPage)/user/profile/action/action';
import { getUnreadNotificationCount } from '../(adminPage)/user/notifications/actions/getUserNotifications';

// Fetch and prepare all layout data in parallel
export async function fetchEcommLayoutData() {
  // Parallel fetches for global data
  const [companyData, session] = await Promise.all([
    companyInfo(),
    getSession(),
  ]);
  const user = session?.user;

  // Prepare user-related data in parallel if logged in
  let fullUser = null;
  let notificationCount = 0;
  let wishlistIds: string[] = [];
  let hasAddresses = false;

  if (user?.id) {
    const [userRes, notifRes, wishlistRes, addressRes] = await Promise.all([
      userProfile(user.id),
      getUnreadNotificationCount(user.id),
      db.wishlistItem.findMany({ where: { userId: user.id }, select: { productId: true } }),
      db.address.count({ where: { userId: user.id } }),
    ]);
    fullUser = userRes;
    notificationCount = notifRes;
    wishlistIds = wishlistRes.map((i) => i.productId);
    hasAddresses = addressRes > 0;
  }

  // Fetch product and client counts in parallel
  const [productCount, clientCount] = await Promise.all([
    db.product.count({ where: { published: true } }),
    db.user.count({ where: { role: 'CUSTOMER' } }),
  ]);

  // Build alerts array based on user state
  const alerts = [];
  if (fullUser) {
    if (!hasAddresses) {
      alerts.push({
        id: 'address-alert',
        type: 'warning' as const,
        title: 'أضف عنوانك الأول',
        description: 'الرجاء إضافة عنوان لتسهيل عملية التوصيل.',
        href: '/user/addresses',
      });
    }
    if (!fullUser.emailVerified) {
      alerts.push({
        id: 'activation-alert',
        type: 'destructive' as const,
        title: 'تفعيل الحساب',
        description: 'الرجاء تفعيل حسابك للاستفادة من جميع الميزات.',
        href: '/auth/verify',
      });
    }
  }

  // Only pass minimal user info to components
  const userSummary = fullUser
    ? {
        id: fullUser.id,
        name: fullUser.name,
        email: fullUser.email,
        image: fullUser.image,
        role: fullUser.role as any,
        emailVerified: fullUser.emailVerified,
      }
    : null;

  return {
    companyData,
    session,
    user,
    userSummary,
    notificationCount,
    wishlistIds,
    alerts,
    fullUser,
    productCount,
    clientCount,
  };
} 