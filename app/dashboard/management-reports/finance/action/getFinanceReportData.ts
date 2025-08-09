"use server"
import { ORDER_STATUS } from '@/constant/order-status';
import db from '@/lib/prisma';
import { Prisma } from '@prisma/client'; // Import Prisma
import { ActionError } from '@/types/commonType';

// Define a specific type for the date filter structure
interface DateFilter {
  createdAt: Prisma.DateTimeFilter;
}

/**
 * احصائيات وتقارير مالية: الإيرادات، المصروفات، الربح، الخصومات، الاتجاهات، المعاملات.
 */
export async function getFinanceReportData({ from, to }: { from?: string; to?: string }) {
  try {
    let dateFilter: DateFilter | undefined = undefined;
    if (from || to) {
      dateFilter = {
        createdAt: {
          ...(from ? { gte: new Date(from) } : {}),
          ...(to ? { lte: new Date(to) } : {}),
        },
      };
    }

    const [completedOrders, expenses] = await Promise.all([
      db.order.findMany({
        where: { status: ORDER_STATUS.DELIVERED, ...(dateFilter || {}) },
      }),
      db.expense.findMany({ where: dateFilter || {} }),
    ]);

    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.amount ?? 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount ?? 0), 0);
    const totalDiscounts = 0;
    const netProfit = totalRevenue - totalExpenses;

    const trends: Record<string, { date: string; revenue: number; expenses: number }> = {};
    completedOrders.forEach((o) => {
      const date = o.createdAt.toISOString().slice(0, 10);
      if (!trends[date]) trends[date] = { date, revenue: 0, expenses: 0 };
      trends[date].revenue += o.amount ?? 0;
    });
    expenses.forEach((e) => {
      const date = e.createdAt.toISOString().slice(0, 10);
      if (!trends[date]) trends[date] = { date, revenue: 0, expenses: 0 };
      trends[date].expenses += e.amount ?? 0;
    });
    const trendData = Object.values(trends).sort((a, b) => a.date.localeCompare(b.date));

    const transactions = [
      ...completedOrders.map((o) => ({
        type: 'إيراد',
        amount: o.amount ?? 0,
        note: `طلب رقم ${o.orderNumber ?? o.id}`,
        createdAt: o.createdAt,
      })),
      ...expenses.map((e) => ({
        type: 'مصروف',
        amount: e.amount ?? 0,
        note: e.note ?? '-',
        createdAt: e.createdAt,
      })),
    ]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 100);

    const kpis = [
      { label: 'إجمالي الإيرادات', value: totalRevenue.toFixed(2) },
      { label: 'إجمالي المصروفات', value: totalExpenses.toFixed(2) },
      { label: 'إجمالي الخصومات', value: totalDiscounts.toFixed(2) },
      { label: 'الربح الصافي', value: netProfit.toFixed(2) },
    ];

    return {
      kpis,
      trendData,
      transactions,
    };
  } catch (error) {
    const err: ActionError =
      typeof error === 'object' && error && 'message' in error
        ? { message: (error as ActionError).message, code: (error as ActionError).code }
        : { message: 'فشل في جلب تقرير البيانات المالية.' };
    throw err;
  }
}
