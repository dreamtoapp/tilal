'use server';
import db from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export interface MilestoneItem {
  title: string;
  description: string;
  date: Date | null;
  icon?: string;
}



export async function getMilestonesReportData(): Promise<{ milestones: MilestoneItem[]; error?: string }> {
  const milestones: MilestoneItem[] = [];

  try {
    // 1. First Order Date
    const firstOrder = await db.order.findFirst({
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    });
    if (firstOrder && firstOrder.createdAt) {
      milestones.push({
        title: 'أول طلب تم استلامه',
        description: `تم استلام أول طلب على المنصة.`,
        date: firstOrder.createdAt,
        icon: '🎉',
      });
    }

    // 2. Nth Order Date (e.g., 100th order)
    const orderCountTarget = 100;
    const nthOrderResult = await db.order.findMany({ // findMany to use skip
      orderBy: { createdAt: 'asc' },
      skip: orderCountTarget - 1,
      take: 1,
      select: { createdAt: true, orderNumber: true },
    });
    const nthOrder = nthOrderResult.length > 0 ? nthOrderResult[0] : null;
    if (nthOrder && nthOrder.createdAt) {
      milestones.push({
        title: `الطلب رقم ${orderCountTarget}`,
        description: `تم الوصول إلى الطلب رقم ${orderCountTarget} (رقم الطلب: ${nthOrder.orderNumber}).`,
        date: nthOrder.createdAt,
        icon: '🚀',
      });
    }

    // 3. Nth Customer Registration Date (e.g., 100th customer)
    const customerCountTarget = 100;
    const nthCustomerResult = await db.user.findMany({ // findMany to use skip
      where: {
        role: { notIn: [UserRole.ADMIN, UserRole.DRIVER] },
      },
      orderBy: { createdAt: 'asc' },
      skip: customerCountTarget - 1,
      take: 1,
      select: { createdAt: true, name: true, email: true },
    });
    const nthCustomer = nthCustomerResult.length > 0 ? nthCustomerResult[0] : null;
    if (nthCustomer && nthCustomer.createdAt) {
      milestones.push({
        title: `العميل رقم ${customerCountTarget}`,
        description: `تم تسجيل العميل رقم ${customerCountTarget} (الاسم: ${nthCustomer.name || nthCustomer.email || 'غير معروف'}).`,
        date: nthCustomer.createdAt,
        icon: '👥',
      });
    }

    // 4. Total Sales Milestones
    const allOrdersForSales = await db.order.findMany({
      orderBy: { createdAt: 'asc' },
      select: { amount: true, createdAt: true },
    });

    let cumulativeSales = 0;
    const salesTargets = [1000, 5000, 10000, 25000, 50000, 100000];
    const achievedSalesTargets = new Set<number>();

    for (const order of allOrdersForSales) {
      if (typeof order.amount === 'number') { // Ensure amount is a number
        cumulativeSales += order.amount;
        for (const target of salesTargets) {
          if (cumulativeSales >= target && !achievedSalesTargets.has(target)) {
            if (order.createdAt) {
              milestones.push({
                title: `تجاوز المبيعات ${target.toLocaleString('ar-EG')} ر.س`,
                description: `تم تحقيق إجمالي مبيعات يتجاوز ${target.toLocaleString('ar-EG')} ر.س.`,
                date: order.createdAt,
                icon: '💰',
              });
              achievedSalesTargets.add(target);
            }
          }
        }
      }
    }

    milestones.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));

    return {
      milestones,
    };

  } catch (error) {
    console.error("Error fetching milestones report data:", error);
    return {
      milestones: [],
      error: "Failed to fetch milestones report data.",
    };
  }
}
