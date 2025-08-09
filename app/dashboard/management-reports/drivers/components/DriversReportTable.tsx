'use client';
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DriversReportTableProps {
  drivers: Array<{
    id: string;
    name: string;
    phone?: string;
    orders?: Array<{
      id: string;
      status: string;
      amount: number;
    }>;
  }>;
}

interface DriversReportTablePropsWithPage extends DriversReportTableProps {
  page: number;
}

export function DriversReportTable({ drivers }: DriversReportTablePropsWithPage) {
  // KPI calculations
  const totalDrivers = drivers.length;
  const totalOrders = drivers.reduce((sum, d) => sum + (d.orders?.length || 0), 0);
  const totalCompleted = drivers.reduce((sum, d) => sum + (d.orders?.filter(o => o.status === 'DELIVERED').length || 0), 0);
  const totalCancelled = drivers.reduce((sum, d) => sum + (d.orders?.filter(o => o.status === 'CANCELED').length || 0), 0);
  const totalEarnings = drivers.reduce((sum, d) => sum + (d.orders?.reduce((s, o) => s + (o.status === 'DELIVERED' ? o.amount : 0), 0) || 0), 0);

  // Search/filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filtered drivers
  const filtered = useMemo(() => drivers.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || (d.phone || '').includes(search);
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' && (d.orders?.some(o => o.status === 'DELIVERED'))) || (statusFilter === 'inactive' && !(d.orders?.some(o => o.status === 'DELIVERED')));
    return matchesSearch && matchesStatus;
  }), [drivers, search, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset page on filter/search change
  useEffect(() => { setCurrentPage(1); }, [search, statusFilter, pageSize]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Card><CardContent className="py-4 text-center"><div className="text-lg font-semibold">إجمالي السائقين</div><div className="text-2xl font-bold text-primary">{totalDrivers}</div></CardContent></Card>
        <Card><CardContent className="py-4 text-center"><div className="text-lg font-semibold">إجمالي الطلبات</div><div className="text-2xl font-bold">{totalOrders}</div></CardContent></Card>
        <Card><CardContent className="py-4 text-center"><div className="text-lg font-semibold">الطلبات المكتملة</div><div className="text-2xl font-bold text-success-foreground">{totalCompleted}</div></CardContent></Card>
        <Card><CardContent className="py-4 text-center"><div className="text-lg font-semibold">الطلبات الملغاة</div><div className="text-2xl font-bold text-destructive-foreground">{totalCancelled}</div></CardContent></Card>
        <Card className="md:col-span-2"><CardContent className="py-4 text-center"><div className="text-lg font-semibold">إجمالي الأرباح</div><div className="text-2xl font-bold text-primary">{totalEarnings.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ر.س</div></CardContent></Card>
      </div>
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4 bg-muted/40 rounded-lg p-4 border border-border shadow-sm">
        <div className="flex flex-col w-full md:w-1/2">
          <label className="mb-1 text-sm font-medium text-muted-foreground">بحث السائق أو الجوال</label>
          <input className="border border-border rounded px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-primary/30 transition" value={search} onChange={e => setSearch(e.target.value)} placeholder="اسم السائق أو رقم الجوال..." />
        </div>
        <div className="flex flex-col w-full md:w-1/4">
          <label className="mb-1 text-sm font-medium text-muted-foreground">الحالة</label>
          <select className="border border-border rounded px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-primary/30 transition" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">الكل</option>
            <option value="active">نشط (لديه طلبات مكتملة)</option>
            <option value="inactive">غير نشط</option>
          </select>
        </div>
      </div>
      {/* Table */}
      <Card>
        <CardContent className='overflow-x-auto p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-right'>اسم السائق</TableHead>
                <TableHead className='text-right'>رقم الجوال</TableHead>
                <TableHead className='text-right'>إجمالي الطلبات</TableHead>
                <TableHead className='text-right'>الطلبات المكتملة</TableHead>
                <TableHead className='text-right'>الطلبات الملغاة</TableHead>
                <TableHead className='text-right'>إجمالي الأرباح</TableHead>
                <TableHead className='text-right'>المزيد</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='text-center text-gray-400'>
                    لا توجد بيانات سائقين
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((driver) => {
                  const totalOrders = driver.orders?.length || 0;
                  const completedOrders = driver.orders?.filter((o) => o.status === 'DELIVERED').length || 0;
                  const cancelledOrders = driver.orders?.filter((o) => o.status === 'CANCELED').length || 0;
                  const totalEarnings = driver.orders?.reduce((sum, o) => sum + (o.status === 'DELIVERED' ? o.amount : 0), 0) || 0;
                  return (
                    <TableRow key={driver.id}>
                      <TableCell className='font-bold'>{driver.name}</TableCell>
                      <TableCell>{driver.phone || '-'}</TableCell>
                      <TableCell>{totalOrders}</TableCell>
                      <TableCell>{completedOrders}</TableCell>
                      <TableCell>{cancelledOrders}</TableCell>
                      <TableCell>{totalEarnings.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ر.س</TableCell>
                      <TableCell>
                        <a href={`/dashboard/reports/drivers/${driver.id}`} className='text-blue-600 underline hover:text-blue-800'>مزيد من المعلومات</a>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          {/* Pagination Controls */}
          {filtered.length > pageSize && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-4">
              <div className="flex items-center gap-2">
                <label className="text-sm">عدد العناصر في الصفحة:</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={pageSize}
                  onChange={e => setPageSize(Number(e.target.value))}
                >
                  {[10, 20, 50, 100].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1 justify-center">
                <button
                  className="p-1 disabled:opacity-50"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="الصفحة السابقة"
                >
                  {'<'}
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`px-2 py-1 rounded text-sm font-bold ${page === currentPage ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="p-1 disabled:opacity-50"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="الصفحة التالية"
                >
                  {'>'}
                </button>
              </div>
              <div className="text-xs text-muted-foreground text-center md:text-right">
                عرض {Math.min((currentPage - 1) * pageSize + 1, filtered.length)}
                -{Math.min(currentPage * pageSize, filtered.length)} من {filtered.length} سائق
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
