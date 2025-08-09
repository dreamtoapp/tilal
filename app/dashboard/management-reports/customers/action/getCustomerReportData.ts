import db from '@/lib/prisma';
import { Prisma, UserRole } from '@prisma/client'; // Import Prisma and UserRole

// Define type for User including nested orders and items
type UserWithOrders = Prisma.UserGetPayload<{
  include: {
    customerOrders: {
      include: {
        items: true;
      };
    };
  };
}>;
type OrderWithItems = UserWithOrders['customerOrders'][number]; // Helper type for an order within UserWithOrders

// Define type for the processed customer data
interface CustomerReportData {
  id: string;
  name: string;
  phone: string;
  email: string;
  orderCount: number;
  totalSpend: number;
  createdAt: Date;
}

/**
 * احصائيات العملاء: العدد الإجمالي، العملاء الجدد، العملاء الدائمين، الأعلى طلباً، الأعلى إنفاقاً، بيانات للرسم البياني.
 */
export async function getCustomerReportData() {
  try {
    const users: UserWithOrders[] = await db.user.findMany({
      where: {
        role: UserRole.CUSTOMER,
      },
      include: {
        customerOrders: {
          include: {
            items: true,
          },
        },
      },
    });

    // معالجة بيانات العملاء
    const customers: CustomerReportData[] = users.map((user) => {
      const orderCount = user.customerOrders.length;
      const totalSpend = user.customerOrders.reduce((sum: number, o: OrderWithItems) => sum + (o.amount ?? 0), 0);
      return {
        id: user.id,
        name: user.name ?? '-',
        phone: user.phone ?? '-',
        email: user.email ?? '-',
        orderCount,
        totalSpend,
        createdAt: user.createdAt,
      };
    });

    // KPIs
    const totalCustomers = customers.length;
    const totalOrders = customers.reduce((sum: number, c: CustomerReportData) => sum + c.orderCount, 0);
    const totalSpendAll = customers.reduce((sum: number, c: CustomerReportData) => sum + c.totalSpend, 0);
    // الأعلى طلباً
    const topCustomer = customers.reduce(
      (best: CustomerReportData | undefined, c: CustomerReportData) => (c.orderCount > (best?.orderCount ?? 0) ? c : best),
      undefined,
    );
    // الأعلى إنفاقاً
    const topSpender = customers.reduce(
      (best: CustomerReportData | undefined, c: CustomerReportData) => (c.totalSpend > (best?.totalSpend ?? 0) ? c : best),
      undefined,
    );

    // رسم بياني: اسم العميل وعدد الطلبات
    // Define type for chart data items
    type ChartDataItem = { name: string; orderCount: number; totalSpend: number };

    const chartData = customers
      .map((c: CustomerReportData): ChartDataItem => ({
        name: c.name,
        orderCount: c.orderCount,
        totalSpend: c.totalSpend,
      }))
      .sort((a: ChartDataItem, b: ChartDataItem) => b.orderCount - a.orderCount)
      .slice(0, 10); // أعلى 10 فقط

    const kpis = [
      { label: 'إجمالي العملاء', value: totalCustomers },
      { label: 'إجمالي الطلبات', value: totalOrders },
      { label: 'إجمالي الإنفاق', value: totalSpendAll.toFixed(2) },
      { label: 'الأكثر طلباً', value: topCustomer ? topCustomer.name : '-' },
      { label: 'الأعلى إنفاقاً', value: topSpender ? topSpender.name : '-' },
    ];

    return {
      customers,
      kpis,
      chartData,
    };
  } catch (error) {
    console.error('Error fetching customer report data:', error);
    throw new Error('Failed to fetch customer report data');
  }
}
