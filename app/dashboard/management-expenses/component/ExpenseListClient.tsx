'use client';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ExpenseForm from './ExpenseForm';
import { createExpense, updateExpense, deleteExpense } from '../action/expenseActions';

interface Expense {
  id: string;
  amount: number;
  note?: string;
  category?: string;
  createdAt: string;
  createdBy?: string;
}

interface ExpenseListClientProps {
  expenses: Expense[];
  total: number;
  page: number;
  rowsPerPage: number;
  search: string;
  category: string;
}

export default function ExpenseListClient({
  expenses,
  total,
  page,
  rowsPerPage,
  search,
  category,
}: ExpenseListClientProps) {
  const [searchValue, setSearchValue] = useState(search);
  const [catValue, setCatValue] = useState(category);
  const [showAdd, setShowAdd] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);

  // Pagination
  const totalPages = Math.ceil(total / rowsPerPage) || 1;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchValue) params.set('search', searchValue);
    if (catValue) params.set('category', catValue);
    params.set('page', '1');
    window.location.search = params.toString();
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage.toString());
    window.location.search = params.toString();
  };

  // Add Expense (calls server action via form)
  // Edit Expense (calls server action via form)
  // Delete Expense (calls server action via form)

  return (
    <div className='space-y-6'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>إدارة المصروفات</h1>
        <Button onClick={() => setShowAdd(!showAdd)}>{showAdd ? 'إغلاق' : 'إضافة مصروف'}</Button>
      </div>
      {showAdd && (
        <ExpenseForm
          onSubmit={async (data) => {
            await createExpense(data);
            setShowAdd(false);
          }}
          onCancel={() => setShowAdd(false)}
        />
      )}
      {editExpense && (
        <ExpenseForm
          initialData={editExpense}
          onSubmit={async (data) => {
            await updateExpense(editExpense.id, data);
            setEditExpense(null);
          }}
          onCancel={() => setEditExpense(null)}
        />
      )}
      <Card className='mb-2'>
        <CardContent className='flex flex-col gap-2 py-2 md:flex-row md:items-end'>
          <div>
            <label className='mb-1 block text-sm font-medium'>بحث</label>
            <Input
              type='text'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder='بحث بالملاحظة أو التصنيف'
            />
          </div>
          <div>
            <label className='mb-1 block text-sm font-medium'>التصنيف</label>
            <Input
              type='text'
              value={catValue}
              onChange={(e) => setCatValue(e.target.value)}
              placeholder='تصنيف المصروف (اختياري)'
            />
          </div>
          <Button className='mt-4 md:mt-0' onClick={handleSearch}>
            بحث
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className='overflow-x-auto py-4'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المبلغ</TableHead>
                <TableHead>التصنيف</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>تاريخ الإضافة</TableHead>
                <TableHead>بواسطة</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    {Number(e.amount).toLocaleString('ar-EG', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    ر.س
                  </TableCell>
                  <TableCell>{e.category ?? '-'}</TableCell>
                  <TableCell>{e.note ?? '-'}</TableCell>
                  <TableCell>{new Date(e.createdAt).toLocaleDateString('ar-EG')}</TableCell>
                  <TableCell>{e.createdBy ?? '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant='ghost'
                      size='sm'
                      type='button'
                      onClick={() => setEditExpense(e)}
                    >
                      تعديل
                    </Button>
                    <form
                      action={async (formData: FormData) => {
                        const id = formData.get('id');
                        if (typeof id === 'string') {
                          await deleteExpense(id);
                        }
                      }}
                      style={{ display: 'inline' }}
                    >
                      <input type='hidden' name='id' value={e.id} />
                      <Button variant='destructive' size='sm' type='submit'>
                        حذف
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
              {expenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className='text-center text-gray-400'>
                    لا توجد بيانات
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Pagination */}
      <div className='mt-2 flex items-center justify-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          السابق
        </Button>
        <span className='mx-2'>
          صفحة {page} من {totalPages}
        </span>
        <Button
          variant='outline'
          size='sm'
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          التالي
        </Button>
      </div>
    </div>
  );
}
