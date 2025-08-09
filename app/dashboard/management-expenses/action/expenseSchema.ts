import { z } from 'zod';

export const expenseSchema = z.object({
  amount: z.number().min(0.01, 'المبلغ مطلوب'),
  note: z.string().max(255).optional(),
  category: z.string().max(100).optional(),
  createdBy: z.string().optional(),
});
