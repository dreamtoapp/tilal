import { getExpenses } from './action/expenseActions';
import ExpenseListClient from './component/ExpenseListClient';
import { PageProps } from '@/types/commonTypes';

export default async function ExpensesPage({
  searchParams,
}: PageProps<Record<string, never>, { page?: string; search?: string; category?: string }>) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams?.page;
  const search = resolvedSearchParams?.search;
  const category = resolvedSearchParams?.category;

  const currentPage = parseInt(page || '1', 10);
  const rowsPerPage = 20;
  const searchTerm = search || '';
  const categoryFilter = category || '';

  const { expenses, total } = await getExpenses({
    search: searchTerm,
    category: categoryFilter,
    skip: (currentPage - 1) * rowsPerPage,
    take: rowsPerPage,
  });
  return (
    <ExpenseListClient
      expenses={expenses}
      total={total}
      page={currentPage}
      rowsPerPage={rowsPerPage}
      search={searchTerm}
      category={categoryFilter}
    />
  );
}
