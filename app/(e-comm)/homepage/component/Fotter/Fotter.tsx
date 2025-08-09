import { Icon } from '@/components/icons/Icon';
// Server Component - Following Next.js 15+ best practices
import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import db from '@/lib/prisma';

import AppVersion from '../AppVersion';
import LazyFooterContactIcons from './LazyFooterContactIcons';
import NewsletterClientWrapper from './NewsletterClientWrapper';

interface FooterProps {
  aboutus?: string;
  email?: string;
  phone?: string;
  address?: string;
  companyName?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  productCount?: number | string;
  clientCount?: number | string;
  userId?: string;
}

// Company Information Component with enhanced mobile layout
function CompanyInfo({
  aboutus,
  companyName,
  productCount,
  clientCount
}: {
  aboutus?: string;
  companyName?: string;
  productCount?: number | string;
  clientCount?: number | string;
}) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Logo and Company Name - Enhanced mobile layout */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
          <Icon name="Building2" className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground leading-tight truncate">
            {companyName || 'Dream To App'}
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground font-medium leading-tight">
            فرعنا الالكتروني لتوفير المنتجات المميزة لعملائنا الكرام
          </p>
        </div>
      </div>

      {/* Company Description - Better mobile typography */}
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
        {aboutus || 'نحن شركة متخصصة في تقديم أفضل المنتجات والخدمات لعملائنا الكرام، مع التزامنا بأعلى معايير الجودة والتميز في خدمة العملاء.'}
      </p>

      {/* Trust Badges - Responsive layout */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant="secondary"
          className="bg-success-soft-background text-success-foreground border-success-foreground/20 hover:bg-success-soft-background/80 transition-colors duration-200 text-xs"
        >
          <Icon name="Award" className="h-3 w-3 ml-1 shrink-0" />
          <span className="whitespace-nowrap">جودة مضمونة</span>
        </Badge>
        <Badge
          variant="secondary"
          className="bg-info-soft-background text-info-foreground border-info-foreground/20 hover:bg-info-soft-background/80 transition-colors duration-200 text-xs"
        >
          <Icon name="Truck" className="h-3 w-3 ml-1 shrink-0" />
          <span className="whitespace-nowrap">توصيل سريع</span>
        </Badge>
      </div>

      {/* Stats - Enhanced mobile grid */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-xl md:text-2xl font-bold text-foreground tabular-nums">
            {productCount ?? '...'}
          </div>
          <div className="text-xs text-muted-foreground">منتج</div>
        </div>
        <div className="text-center">
          <div className="text-xl md:text-2xl font-bold text-feature-users tabular-nums">
            {clientCount ?? '...'}
          </div>
          <div className="text-xs text-muted-foreground">عميل راضي</div>
        </div>
        <div className="text-center">
          <div className="text-xl md:text-2xl font-bold text-foreground tabular-nums">24/7</div>
          <div className="text-xs text-muted-foreground">دعم فني</div>
        </div>
      </div>
    </div>
  );
}

// Services Section with enhanced accessibility and mobile UX
async function ServicesSection({ userId }: { userId?: string }) {
  // Fetch published policies
  const [websitePolicy, privacyPolicy, returnPolicy, shippingPolicy] = await Promise.all([
    db.term.findFirst({
      where: { type: 'WEBSITE_POLICY', isActive: true, isPublished: true },
      orderBy: { version: 'desc' }
    }),
    db.term.findFirst({
      where: { type: 'PRIVACY_POLICY', isActive: true, isPublished: true },
      orderBy: { version: 'desc' }
    }),
    db.term.findFirst({
      where: { type: 'RETURN_POLICY', isActive: true, isPublished: true },
      orderBy: { version: 'desc' }
    }),
    db.term.findFirst({
      where: { type: 'SHIPPING_POLICY', isActive: true, isPublished: true },
      orderBy: { version: 'desc' }
    })
  ]);

  const services = [
    { name: 'المتجر الإلكتروني', href: '/', iconName: 'ShoppingBag', description: 'تصفح منتجاتنا المميزة' },
    { name: 'من نحن', href: '/about', iconName: 'Users', description: 'تعرف على قصتنا' },
    { name: 'تواصل معنا', href: '/contact', iconName: 'Phone', description: 'نحن هنا لمساعدتك' },
    {
      name: 'المفضلة',
      href: userId ? `/user/wishlist/${userId}` : '/auth/login?redirect=/user/wishlist',
      iconName: 'Heart',
      description: 'قائمة منتجاتك المفضلة'
    },
    { name: 'التقييمات', href: '/user/ratings', iconName: 'Star', description: 'شاركنا رأيك' },
    { name: 'الطلبات', href: '/user/purchase-history', iconName: 'Package', description: 'تتبع طلباتك' },
  ];

  const customerService = [
    {
      name: 'الدعم الفني',
      href: '/contact',
      iconName: 'Headset',
      description: 'مساعدة فورية على مدار الساعة'
    },
  ];

  // Add policy links if they exist
  if (websitePolicy) {
    customerService.push({
      name: 'سياسة الموقع',
      href: '/policies/terms',
      iconName: 'Globe',
      description: 'شروط وأحكام استخدام الموقع'
    });
  }

  if (privacyPolicy) {
    customerService.push({
      name: 'سياسة الخصوصية',
      href: '/policies/privacy',
      iconName: 'Shield',
      description: 'حماية البيانات الشخصية'
    });
  }

  if (returnPolicy) {
    customerService.push({
      name: 'سياسة الإرجاع',
      href: '/policies/refund',
      iconName: 'RotateCcw',
      description: 'شروط الإرجاع والاستبدال'
    });
  }

  if (shippingPolicy) {
    customerService.push({
      name: 'سياسة الشحن',
      href: '/policies/shipping',
      iconName: 'Truck',
      description: 'سياسة التوصيل والشحن'
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {/* Main Services */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Globe" className="h-4 w-4 md:h-5 md:w-5 text-feature-commerce shrink-0" />
          <span>خدماتنا</span>
        </h3>
        <nav aria-label="خدمات الموقع" role="navigation">
          <ul className="space-y-3" role="list">
            {services.map((service) => (
              <li key={service.name}>
                <Link
                  href={service.href}
                  className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md p-1 -m-1"
                  aria-label={`${service.name} - ${service.description}`}
                >
                  <Icon
                    name={service.iconName}
                    className="h-4 w-4 text-primary group-hover:text-primary/80 group-hover:scale-110 transition-all duration-200 shrink-0"
                  />
                  <span className="group-hover:font-medium transition-all duration-200">
                    {service.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Customer Service */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Headphones" className="h-4 w-4 md:h-5 md:w-5 text-feature-users shrink-0" />
          <span>خدمة العملاء</span>
        </h3>
        <nav aria-label="خدمة العملاء" role="navigation">
          <ul className="space-y-3" role="list">
            {customerService.map((service) => (
              <li key={service.name}>
                <Link
                  href={service.href}
                  className="group flex items-start gap-3 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md p-1 -m-1"
                  aria-label={`${service.name} - ${service.description}`}
                >
                  <Icon
                    name={service.iconName}
                    className="h-4 w-4 text-feature-users group-hover:text-feature-users/80 group-hover:scale-110 transition-all duration-200 shrink-0 mt-0.5"
                  />
                  <span className="group-hover:font-medium transition-all duration-200 leading-relaxed">
                    {service.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

// Enhanced Contact Component with better mobile UX
function EnhancedContact({
  email,
  phone,
  address,
  facebook,
  instagram,
  twitter,
  linkedin
}: {
  email?: string;
  phone?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}) {
  return (
    <div className="space-y-4 md:space-y-6">
      <h3 className="text-base md:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="MapPin" className="h-4 w-4 md:h-5 md:w-5 text-feature-suppliers shrink-0" />
        <span>تواصل معنا</span>
      </h3>
      <LazyFooterContactIcons
        email={email}
        phone={phone}
        address={address}
        facebook={facebook}
        instagram={instagram}
        twitter={twitter}
        linkedin={linkedin}
      />
    </div>
  );
}

// Main Footer Component - Server Component following Next.js 15+ best practices
const Footer = async ({
  aboutus,
  email,
  phone,
  address,
  facebook,
  instagram,
  twitter,
  linkedin,
  companyName,
  productCount,
  clientCount,
  userId
}: FooterProps) => {
  return (
    <footer
      className="bg-background border-t border-border text-foreground pb-20 md:pb-6"
      role="contentinfo"
      aria-label="معلومات الموقع والتواصل"
    >
      {/* Skip link for accessibility */}
      <a
        href="#footer-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-primary-foreground"
      >
        الانتقال إلى معلومات الموقع
      </a>

      {/* Main Footer Content */}
      <div id="footer-main" className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Company Info - Enhanced responsive layout */}
          <div className="md:col-span-2 lg:col-span-4">
            <CompanyInfo
              aboutus={aboutus}
              companyName={companyName}
              productCount={productCount}
              clientCount={clientCount}
            />
          </div>

          {/* Services - Better mobile stacking */}
          <div className="md:col-span-2 lg:col-span-5">
            <ServicesSection userId={userId} />
          </div>

          {/* Contact & Newsletter - Improved mobile layout */}
          <div className="md:col-span-2 lg:col-span-3 space-y-8">
            <EnhancedContact
              email={email}
              phone={phone}
              address={address}
              facebook={facebook}
              instagram={instagram}
              twitter={twitter}
              linkedin={linkedin}
            />
            <NewsletterClientWrapper />
          </div>
        </div>
      </div>

      <Separator className="mx-4 sm:mx-6 lg:mx-8 border-border" />

      {/* Bottom Footer - Enhanced design */}
      <div className="bg-muted/30 py-4 md:py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <AppVersion />
              <div className="text-xs md:text-sm text-muted-foreground">
                © 2024{' '}
                <Link
                  href="https://dreamto.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 rounded-sm"
                  aria-label="زيارة موقع Dream To App (يفتح في نافذة جديدة)"
                >
                  Dream To App
                </Link>
                . جميع الحقوق محفوظة.
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-center sm:text-right">
              صُنع بـ ❤️ في المملكة العربية السعودية
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
