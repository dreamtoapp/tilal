'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface InventoryTableProps {
  products: Array<{
    id: string;
    name: string;
    price: number;
    outOfStock: boolean;
    createdAt: string;
    updatedAt: string;
    supplier?: { name?: string } | null;
    imageUrl?: string | null; // Optional image URL
  }>;
}

export function InventoryTable({ products }: InventoryTableProps) {
  // KPI calculations
  const totalProducts = products.length;
  const outOfStockCount = products.filter(p => p.outOfStock).length;
  const inStockCount = totalProducts - outOfStockCount;
  const lastUpdate = products.length > 0 ? new Date(Math.max(...products.map(p => new Date(p.updatedAt).getTime()))).toLocaleDateString('ar-EG') : '-';

  // Search/filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Unique suppliers for filter dropdown
  const suppliers = useMemo(() => Array.from(new Set(products.map(p => p.supplier?.name).filter(Boolean))), [products]);

  // Filtered products
  const filtered = useMemo(() => products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'in' && !p.outOfStock) || (statusFilter === 'out' && p.outOfStock);
    const matchesSupplier = supplierFilter === 'all' || p.supplier?.name === supplierFilter;
    return matchesSearch && matchesStatus && matchesSupplier;
  }), [products, search, statusFilter, supplierFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset page on filter/search change
  useEffect(() => { setCurrentPage(1); }, [search, statusFilter, supplierFilter, pageSize]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Card><CardContent className="py-4 text-center"><div className="text-lg font-semibold">إجمالي المنتجات</div><div className="text-2xl font-bold text-primary">{totalProducts}</div></CardContent></Card>
        <Card><CardContent className="py-4 text-center"><div className="text-lg font-semibold">متوفر</div><div className="text-2xl font-bold text-success-foreground">{inStockCount}</div></CardContent></Card>
        <Card><CardContent className="py-4 text-center"><div className="text-lg font-semibold">غير متوفر</div><div className="text-2xl font-bold text-destructive-foreground">{outOfStockCount}</div></CardContent></Card>
        <Card><CardContent className="py-4 text-center"><div className="text-lg font-semibold">آخر تحديث</div><div className="text-2xl font-bold">{lastUpdate}</div></CardContent></Card>
      </div>
      {/* Enhanced Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4 bg-muted/40 rounded-lg p-4 border border-border shadow-sm">
        <div className="flex flex-col w-full md:w-1/3">
          <label className="mb-1 text-sm font-medium text-muted-foreground">بحث المنتج</label>
          <input className="border border-border rounded px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-primary/30 transition" value={search} onChange={e => setSearch(e.target.value)} placeholder="اسم المنتج..." />
        </div>
        <div className="flex flex-col w-full md:w-1/4">
          <label className="mb-1 text-sm font-medium text-muted-foreground">الحالة</label>
          <select className="border border-border rounded px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-primary/30 transition" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">الكل</option>
            <option value="in">متوفر</option>
            <option value="out">غير متوفر</option>
          </select>
        </div>
        <div className="flex flex-col w-full md:w-1/3">
          <label className="mb-1 text-sm font-medium text-muted-foreground">المورد</label>
          <select className="border border-border rounded px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-primary/30 transition" value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)}>
            <option value="all">الكل</option>
            {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      {/* Table */}
      <Card>
        <CardContent className='overflow-x-auto p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المنتج</TableHead>
                <TableHead className="text-right">الشركة</TableHead>
                <TableHead className="text-right">السعر</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">تاريخ الإضافة</TableHead>
                <TableHead className="text-right">آخر تحديث</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='py-10 text-center text-muted-foreground'>
                    لا توجد بيانات مخزون لعرضها.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((p) => (
                  <TableRow key={p.id} className={p.outOfStock ? 'bg-destructive-soft-bg/50 hover:bg-destructive-soft-bg' : 'hover:bg-muted/50'}>
                    <TableCell className='font-medium flex items-center gap-2'>
                      {/* Product image if available (optional, needs backend support) */}
                      {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={32} height={32} className="rounded border object-cover" />}
                      <span>{p.name}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.supplier?.name || '-'}</TableCell>
                    <TableCell>{p.price?.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ر.س</TableCell>
                    <TableCell>
                      {p.outOfStock ? (
                        <span className='font-semibold text-destructive-foreground'>غير متوفر</span>
                      ) : (
                        <span className='font-semibold text-success-foreground'>متوفر</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString('ar-EG') : '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('ar-EG') : '-'}
                    </TableCell>
                  </TableRow>
                ))
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
                -{Math.min(currentPage * pageSize, filtered.length)} من {filtered.length} منتج
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
