import { ArrowDownFromLine } from 'lucide-react';
import { PageProps } from '@/types/commonTypes';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getOrderData } from '../actions/getOrderData';

// Order Type Definition

export default async function ClientInvoicePage({ params }: PageProps<{ invoiceid: string }, { status?: string }>) {
  const resolvedParams = await params;
  const { invoiceid } = resolvedParams;

  const order = await getOrderData(invoiceid as string);

  return (
    <div className='mx-auto my-10 max-w-3xl'>
      <Button>
        {' '}
        تحميل الفاتورة
        <ArrowDownFromLine />
      </Button>
      <div className='rounded-md bg-white p-6 text-right shadow-md'>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl font-bold'>الفاتورة #{order?.invoiceNo}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p>
              <strong>العميل:</strong> {order?.customerName}
            </p>
            <p>
              <strong>البريد الإلكتروني:</strong> {order?.customerEmail}
            </p>
            <p>
              <strong>رقم الطلب:</strong> {order?.orderNumber}
            </p>
            <p>
              <strong>الوردية:</strong> {order?.shift}
            </p>
            <p>
              <strong>الحالة:</strong> <span className='text-green-600'>{order?.status}</span>
            </p>
            <h3 className='mt-4 text-xl font-semibold'>عناصر الطلب</h3>
            <table className='w-full border-collapse border border-gray-300 text-sm'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border p-2'>المنتج</th>
                  <th className='border p-2'>الكمية</th>
                  <th className='border p-2'>السعر</th>
                  <th className='border p-2'>الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {order?.items.map((item, index) => (
                  <tr key={index} className='border'>
                    <td className='border p-2'>{item.productName}</td>
                    <td className='border p-2'>{item.quantity}</td>
                    <td className='border p-2'>{item.price.toFixed(2)} ريال</td>
                    <td className='border p-2'>{(item.quantity * item.price).toFixed(2)} ريال</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className='mt-4 text-xl font-semibold'>الملخص</h3>
            <p>
              <strong>الإجمالي الفرعي:</strong> {order?.amount.toFixed(2)} ريال
            </p>
            <p>
              <strong>الضريبة (15%):</strong> {((order?.amount || 0) * 0.15).toFixed(2)} ريال
            </p>
            <p className='text-lg font-bold'>
              <strong>الإجمالي:</strong> {((order?.amount || 0) * 1.15).toFixed(2)} ريال
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
