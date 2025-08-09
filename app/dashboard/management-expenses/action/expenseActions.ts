'use server';

import { Prisma } from '@prisma/client'; // Import Prisma
import { z } from 'zod'; // Import Zod
import db from '@/lib/prisma';
import { expenseSchema } from './expenseSchema';

// Define type based on Zod schema
type ExpenseInputData = z.infer<typeof expenseSchema>;

// Get all expenses (with optional search/filter)
export async function getExpenses({ search = '', category = '', skip = 0, take = 20 } = {}) {
  const where: Prisma.ExpenseWhereInput = {}; // Use correct type
  if (search) {
    where.OR = [
      { note: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (category) where.category = category;
  const [expensesRaw, total] = await Promise.all([
    db.expense.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take }),
    db.expense.count({ where }),
  ]);
  // Convert nulls to undefined for note and category
  const expenses = expensesRaw.map((e) => ({
    ...e,
    note: e.note ?? undefined,
    category: e.category ?? undefined,
    createdBy: e.createdBy ?? undefined,
    createdAt: e.createdAt instanceof Date ? e.createdAt.toISOString() : e.createdAt,
    updatedAt: e.updatedAt instanceof Date ? e.updatedAt.toISOString() : e.updatedAt,
  }));
  return { expenses, total };
}

import { revalidatePath } from 'next/cache';

// Create expense
export async function createExpense(data: ExpenseInputData) { // Use inferred type
  const parsed = expenseSchema.safeParse(data);
  if (!parsed.success) throw parsed.error;
  const result = await db.expense.create({ data: parsed.data });
  revalidatePath('/dashboard/expenses');
  return result;
}

// Update expense
export async function updateExpense(id: string, data: ExpenseInputData) { // Use inferred type
  const parsed = expenseSchema.safeParse(data);
  if (!parsed.success) throw parsed.error;
  const result = await db.expense.update({ where: { id }, data: parsed.data });
  revalidatePath('/dashboard/expenses');
  return result;
}

// Delete expense
export async function deleteExpense(id: string) {
  const result = await db.expense.delete({ where: { id } });
  revalidatePath('/dashboard/expenses');
  return result;
}
