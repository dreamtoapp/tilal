const fakeReviews = [
  {
    id: 1,
    reviewer: 'أحمد محمد',
    rating: 5,
    comment: 'خدمة ممتازة والتوصيل سريع جدًا!',
    date: '2025-04-28 15:30',
    orderNumber: 'ORD-1001',
  },
  {
    id: 2,
    reviewer: 'سارة علي',
    rating: 4,
    comment: 'جودة المنتجات رائعة، لكن التأخير بسيط في التوصيل.',
    date: '2025-04-27 12:10',
    orderNumber: 'ORD-1000',
  },
  {
    id: 3,
    reviewer: 'خالد العتيبي',
    rating: 3,
    comment: 'تجربة متوسطة، خدمة العملاء تحتاج تحسين.',
    date: '2025-04-25 18:45',
    orderNumber: 'ORD-0999',
  },
  {
    id: 4,
    reviewer: 'منى الزهراني',
    rating: 5,
    comment: 'كل شيء كان مثالي! أشكركم.',
    date: '2025-04-24 09:20',
    orderNumber: 'ORD-0998',
  },
  {
    id: 5,
    reviewer: 'عبدالله السبيعي',
    rating: 2,
    comment: 'المنتج غير مطابق للوصف.',
    date: '2025-04-23 20:10',
    orderNumber: 'ORD-0997',
  },
];

export default function ReviewsReportTable() {
  return (
    <div className='overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm'>
      <table className='min-w-full text-right text-sm'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='px-4 py-2'>رقم الطلب</th>
            <th className='px-4 py-2'>المُقيّم</th>
            <th className='px-4 py-2'>التقييم</th>
            <th className='px-4 py-2'>التعليق</th>
            <th className='px-4 py-2'>التاريخ</th>
          </tr>
        </thead>
        <tbody>
          {fakeReviews.map((review) => (
            <tr key={review.id} className='border-t'>
              <td className='px-4 py-2 font-mono'>{review.orderNumber}</td>
              <td className='px-4 py-2'>{review.reviewer}</td>
              <td className='px-4 py-2'>
                <span className='font-bold text-yellow-500'>{'★'.repeat(review.rating)}</span>
                <span className='text-gray-300'>{'★'.repeat(5 - review.rating)}</span>
              </td>
              <td className='max-w-xs truncate px-4 py-2' title={review.comment}>
                {review.comment}
              </td>
              <td className='whitespace-nowrap px-4 py-2'>{review.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
