// NOTE: All icon values are string names. Use the global <Icon name={item.icon} /> component to render.

// Function to get pending orders count - this will be called from the server component
export async function getPendingOrdersCount(): Promise<number> {
  try {
    // Use the existing getOrderCounts function that we know works
    const { getOrderCounts } = await import('../management-orders/actions/get-order-counts');
    const orderCounts = await getOrderCounts();
    return orderCounts.pending;
  } catch (error) {
    console.error('Error fetching pending orders count:', error);
    return 0;
  }
}

export const navigationItems = [
  {
    label: 'لوحة التحكم',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    badge: 'live'
  },
  {
    label: 'الطلبات',
    href: '/dashboard/management-orders',
    icon: 'ClipboardList',
    badge: 'pending', // This will be replaced with actual count
    children: [
      { label: 'جميع الطلبات', href: '/dashboard/management-orders', icon: 'ClipboardList' },
      { label: 'قيد المراجعة', href: '/dashboard/management-orders/status/pending', icon: 'Clock' },
      { label: 'مخصصة للسائقين', href: '/dashboard/management-orders/status/assigned', icon: 'UserCheck' },
      { label: 'قيد التوصيل', href: '/dashboard/management-orders/status/in-way', icon: 'Truck' },
      { label: 'مكتملة', href: '/dashboard/management-orders/status/delivered', icon: 'CheckCircle' },
      { label: 'ملغاة', href: '/dashboard/management-orders/status/canceled', icon: 'XCircle' },
      { label: 'تحليلات الطلبات', href: '/dashboard/management-orders/analytics', icon: 'Activity' }
    ]
  },
  {
    label: 'المنتجات',
    href: '/dashboard/management-products',
    icon: 'Package',
    children: [
      { label: 'المنتجات', href: '/dashboard/management-products', icon: 'Package' },
      { label: 'التصنيفات', href: '/dashboard/management-categories', icon: 'Tags' },
      { label: 'الموردين', href: '/dashboard/management-suppliers', icon: 'Warehouse' }
    ]
  },
  {
    label: 'العملاء',
    href: '/dashboard/management-users/customer',
    icon: 'Users',
    children: [
      { label: 'العملاء', href: '/dashboard/management-users/customer', icon: 'Users' },
      { label: 'الدعم', href: '/dashboard/management/client-submission', icon: 'Headset' }
    ]
  },
  {
    label: 'الفريق',
    href: '/dashboard/management-users/drivers',
    icon: 'Truck',
    children: [
      { label: 'المشرفون', href: '/dashboard/management-users/admin', icon: 'Shield' },
      // { label: 'التسويق', href: '/dashboard/management-users/marketer', icon: 'Megaphone' },
      { label: 'السائقون', href: '/dashboard/management-users/drivers', icon: 'Truck' },

    ]
  },
  {
    label: 'الإعدادات',
    href: '/dashboard/management/settings',
    icon: 'Settings',
    children: [
      { label: 'معلومات الشركة', href: '/dashboard/management/settings/company-profile', icon: 'Building2' },
      { label: 'الموقع والعنوان', href: '/dashboard/management/settings/location', icon: 'MapPin' },
      // { label: 'المعلومات الضريبية', href: '/dashboard/management/settings/tax-info', icon: 'Receipt' },
      { label: 'الروابط الاجتماعية', href: '/dashboard/management/settings/social-media', icon: 'Share2' },
      { label: 'الشعار والهوية', href: '/dashboard/management/settings/branding', icon: 'Palette' },
      { label: 'إعدادات المنصة', href: '/dashboard/management/settings/platform', icon: 'Settings' },
      { label: '---', href: '#', icon: 'Minus', key: 'divider-1' },
      { label: 'سياسة الموقع', href: '/dashboard/management/policies/website', icon: 'Globe' },
      { label: 'سياسة الإرجاع', href: '/dashboard/management/policies/return', icon: 'Undo' },
      { label: 'سياسة الخصوصية', href: '/dashboard/management/policies/privacy', icon: 'Shield' },
      { label: 'سياسة الشحن', href: '/dashboard/management/policies/shipping', icon: 'Truck' },
      { label: '---', href: '#', icon: 'Minus', key: 'divider-2' },
      { label: 'التنبيهات', href: '/dashboard/management-notification', icon: 'Bell' },
      { label: 'المناوبات', href: '/dashboard/shifts', icon: 'Clock' },
      { label: 'من نحن', href: '/dashboard/management/about', icon: 'Info' },
      { label: 'الدليل', href: '/dashboard/guidelines', icon: 'BookOpen' }
    ]
  },
  {
    label: 'المزيد',
    href: '#',
    icon: 'MoreHorizontal',
    children: [
      { label: 'التسويق', href: '/dashboard/management-offer', icon: 'Megaphone' },
      { label: 'تحسين المحركات', href: '/dashboard/management-seo', icon: 'Search' },
      { label: 'المالية', href: '/dashboard/management-expenses', icon: 'DollarSign' },
      { label: 'التقارير', href: '/dashboard/management-reports', icon: 'BarChart3' },
      { label: 'الصيانة', href: '/dashboard/management-maintinance', icon: 'Wrench' },
      { label: 'البيانات', href: '/dashboard/dataSeed', icon: 'Database' }
    ]
  }
];

export type NavigationItem = {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  key?: string;
  children?: {
    label: string;
    href: string;
    icon: string;
    key?: string;
  }[];
}; 