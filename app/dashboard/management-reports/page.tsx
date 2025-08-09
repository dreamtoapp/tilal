import Link from '@/components/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // CardDescription not used
import { Icon } from '@/components/icons/Icon';

interface ReportLink {
  title: string;
  url: string;
  iconName: string;
  description: string;
}

interface ReportCategory {
  categoryTitle: string;
  reports: ReportLink[];
}

const categorizedReportsList: ReportCategory[] = [
  {
    categoryTitle: 'تقارير المبيعات والربحية',
    reports: [
      {
        title: 'تقرير المبيعات',
        url: '/dashboard/management-reports/sales',
        iconName: 'TrendingUp',
        description: 'تحليل شامل للمبيعات والإيرادات والفترات الزمنية.',
      },
      {
        title: 'التقارير المالية',
        url: '/dashboard/management-reports/finance',
        iconName: 'DollarSign',
        description: 'نظرة عامة على التدفقات النقدية، الأرباح، والمؤشرات المالية.',
      },
      {
        title: 'أداء المنتجات',
        url: '/dashboard/management-reports/product-performance',
        iconName: 'BarChart2',
        description: 'تقييم المنتجات الأكثر مبيعًا، الأقل مبيعًا، وهوامش الربح.',
      },
    ],
  },
  {
    categoryTitle: 'تقارير العمليات والمخزون',
    reports: [
      {
        title: 'تحليلات الطلبات',
        url: '/dashboard/management-reports/orders',
        iconName: 'Activity',
        description: 'تحليل اتجاهات الطلبات، متوسط قيمة الطلب، وحالات الطلب.',
      },
      {
        title: 'تقرير المخزون',
        url: '/dashboard/management-reports/inventory',
        iconName: 'ClipboardList',
        description: 'مراقبة مستويات المخزون، المنتجات بطيئة الحركة، وتنبيهات إعادة الطلب.',
      },
      {
        title: 'تقرير السائقين والتوصيل',
        url: '/dashboard/management-reports/drivers',
        iconName: 'Truck',
        description: 'تحليل كفاءة التوصيل، أداء السائقين، ومناطق الخدمة.',
      },
    ],
  },
  {
    categoryTitle: 'تقارير العملاء والتسويق',
    reports: [
      {
        title: 'تقرير العملاء',
        url: '/dashboard/management-reports/customers',
        iconName: 'UserCheck',
        description: 'فهم سلوك العملاء، التركيبة السكانية، وقيمة العميل.',
      },
      {
        title: 'تقرير العروض والتخفيضات',
        url: '/dashboard/management-reports/promotions',
        iconName: 'Gift',
        description: 'تقييم أداء الحملات الترويجية وتأثيرها على المبيعات.',
      },
      {
        title: 'تقرير التقييمات والمراجعات',
        url: '/dashboard/management-reports/reviews',
        iconName: 'Star',
        description: 'متابعة تقييمات العملاء للمنتجات والخدمة.',
      },
    ],
  },
  {
    categoryTitle: 'تقارير عامة وإنجازات',
    reports: [
      {
        title: 'الإنجازات والأرقام القياسية',
        url: '/dashboard/management-reports/milestones',
        iconName: 'Award',
        description: 'تتبع أهم إنجازات المتجر ومؤشرات النمو الرئيسية.',
      },
    ],
  },
];

export default function ReportsCenterPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6" dir="rtl">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
          مركز التقارير
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          استعرض جميع التقارير المتاحة لتحليل أداء متجرك من مختلف الجوانب.
        </p>
      </div>

      <div className="space-y-10">
        {categorizedReportsList.map((category) => (
          <section key={category.categoryTitle}>
            <h2 className="text-2xl font-semibold tracking-tight mb-6 text-foreground">
              {category.categoryTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.reports.map((report) => (
                <Link href={report.url} key={report.url} className="block hover:no-underline">
                  <Card className="h-full hover:shadow-lg transition-shadow duration-200 ease-in-out">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-semibold text-primary">
                        {report.title}
                      </CardTitle>
                      <Icon name={report.iconName} className="h-6 w-6 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {report.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
