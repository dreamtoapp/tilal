'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const AdminGuidelinesPage = () => (
  <div
    className='max-h-screen overflow-y-auto rounded-xl border border-border bg-background p-6 text-right shadow-lg'
    style={{ maxHeight: '90vh' }}
    dir='rtl'
  >
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold text-primary'>دليل استخدام لوحة التحكم</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4 text-lg'>
        <p>
          مرحباً بك في لوحة تحكم المتجر. هذا الدليل يوضح لك كيفية إدارة المنتجات، العروض، الموردين،
          والمستخدمين، بالإضافة إلى تعليمات رفع الصور.
        </p>
      </CardContent>
    </Card>
    <Separator className='my-4' />
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle className='text-xl font-semibold text-primary'>إدارة المنتجات والعروض</CardTitle>
      </CardHeader>
      <CardContent className='space-y-2'>
        <ul className='list-disc space-y-2 pr-6'>
          <li>لإضافة منتج جديد، اضغط على زر  إضافة منتج جديد  واملأ جميع الحقول المطلوبة.</li>
          <li>لتحرير منتج، اضغط على زر التعديل بجانب المنتج المطلوب.</li>
          <li>لحذف منتج، اضغط على زر الحذف بجانب المنتج.</li>
          <li>يمكنك إدارة العروض بنفس الطريقة من صفحة العروض الترويجية.</li>
        </ul>
      </CardContent>
    </Card>
    <Separator className='my-4' />
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle className='text-xl font-semibold text-primary'>دليل رفع الصور</CardTitle>
      </CardHeader>
      <CardContent className='space-y-2'>
        <ul className='list-decimal space-y-2 pr-6'>
          <li>
            يفضل رفع الصور بصيغة <b>WebP</b> لجودة عالية وحجم صغير. إذا لم تتوفر، استخدم <b>JPEG</b>{' '}
            أو <b>PNG</b> للصور التي تحتاج خلفية شفافة.
          </li>
          <li>
            حجم الصورة الأقصى المسموح به: <b>2 ميجابايت</b>.
          </li>
          <li>
            أبعاد الصور الموصى بها:
            <ul className='mt-2 list-disc space-y-1 pr-6 text-base'>
              <li>
                <b>صور المنتجات:</b> 800×800 بكسل (نسبة 1:1)
              </li>
              <li>
                <b>شعار الشركة:</b> 300×100 بكسل أو SVG
              </li>
              <li>
                <b>صور الموردين:</b> 200×200 بكسل (مربع)
              </li>
              <li>
                <b>صور العروض:</b> 1200×630 بكسل (مستطيل)
              </li>
              <li>
                <b>صور السلايدر (البنر):</b> 1200×600 بكسل (2:1) كحد أدنى، ويفضل 1920×600 أو حتى
                1920×800 بكسل لجودة أعلى على الشاشات الكبيرة.
              </li>
            </ul>
          </li>
          <li>تأكد من وضوح الصورة وخلوها من العلامات المائية أو الشعارات غير المرخصة.</li>
          <li>لا ترفع صوراً تحتوي على محتوى غير لائق أو مخالف للسياسات.</li>
        </ul>
      </CardContent>
    </Card>
    <Separator className='my-4' />
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle className='text-xl font-semibold text-primary'>نصائح عامة</CardTitle>
      </CardHeader>
      <CardContent className='space-y-2'>
        <ul className='list-disc space-y-2 pr-6'>
          <li>احرص على تحديث بيانات المنتجات والموردين باستمرار.</li>
          <li>راجع الطلبات الجديدة بشكل دوري لضمان سرعة التوصيل.</li>
          <li>استخدم خاصية البحث والفلاتر لتسهيل إدارة البيانات.</li>
          <li>في حال وجود مشكلة تقنية، تواصل مع الدعم الفني.</li>
        </ul>
      </CardContent>
    </Card>
    <Separator className='my-4' />
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-semibold text-primary'>الأسئلة الشائعة</CardTitle>
      </CardHeader>
      <CardContent className='space-y-2'>
        <ul className='list-disc space-y-2 pr-6'>
          <li>كيف أغير كلمة المرور؟ من صفحة الإعدادات الشخصية.</li>
          <li>كيف أضيف مورد جديد؟ من صفحة الموردين اضغط إضافة شركة جديدة.</li>
          <li>ما هي أفضل صيغة للصور؟ WebP ثم JPEG أو PNG.</li>
        </ul>
      </CardContent>
    </Card>
  </div>
);

export default AdminGuidelinesPage;
