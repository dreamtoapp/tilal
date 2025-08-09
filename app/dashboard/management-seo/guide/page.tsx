
export default function SeoGuidePage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 text-right">
      <div className="mb-6 flex justify-start">
      </div>
      <h1 className="text-2xl font-bold text-primary mb-4">دليل تحسين محركات البحث (SEO) لمتاجر التجارة الإلكترونية</h1>
      <p className="text-muted-foreground mb-6">هذا الدليل مخصص لمسؤولي المتجر ويوفر خطوات عملية لتحسين ظهور متجرك في نتائج البحث وزيادة الزيارات والمبيعات.</p>
      <ol className="list-decimal pr-6 space-y-4">
        <li>
          <strong>تهيئة البنية التقنية (Technical SEO):</strong>
          <ul className="list-disc pr-6 mt-2 space-y-1 text-sm text-muted-foreground">
            <li>تأكد من سرعة تحميل الموقع (يفضل أقل من 3 ثوانٍ). استخدم أدوات مثل PageSpeed Insights.</li>
            <li>تفعيل التصفح الآمن (HTTPS) لجميع الصفحات.</li>
            <li>تأكد من أن الموقع متوافق مع الجوال (Responsive) ويعمل بكفاءة على جميع الأجهزة.</li>
            <li>استخدم خريطة موقع XML وحدّثها تلقائيًا مع إضافة أو حذف المنتجات.</li>
            <li>تأكد من وجود ملف robots.txt يمنع الزحف إلى الصفحات غير المهمة (مثل صفحة السلة أو الحساب الشخصي).</li>
            <li>عالج الروابط المكسورة (404) وأعد توجيهها بشكل صحيح.</li>
          </ul>
        </li>
        <li>
          <strong>تحسين بنية الصفحات (On-Page SEO):</strong>
          <ul className="list-disc pr-6 mt-2 space-y-1 text-sm text-muted-foreground">
            <li>استخدم عناوين فريدة وواضحة لكل منتج وفئة (title tag) مع تضمين الكلمات المفتاحية.</li>
            <li>اكتب وصفًا مخصصًا (meta description) لكل صفحة لجذب النقرات.</li>
            <li>استخدم رؤوس H1/H2/H3 بشكل منظم، مع تضمين الكلمات المفتاحية الرئيسية والثانوية.</li>
            <li>أضف نصوص بديلة (alt text) للصور، ويفضل أن تتضمن اسم المنتج أو الفئة.</li>
            <li>اجعل روابط المنتجات والفئات قصيرة وواضحة (URL Slug) وتحتوي على كلمات مفتاحية.</li>
          </ul>
        </li>
        <li>
          <strong>تهيئة المخطط (Schema Markup):</strong>
          <ul className="list-disc pr-6 mt-2 space-y-1 text-sm text-muted-foreground">
            <li>استخدم <span className="font-mono bg-muted px-1">Product</span> Schema لكل صفحة منتج (يتضمن: الاسم، السعر، التوفر، التقييمات).</li>
            <li>أضف <span className="font-mono bg-muted px-1">BreadcrumbList</span> Schema لتحسين ظهور المسارات في نتائج البحث.</li>
            <li>استخدم <span className="font-mono bg-muted px-1">Organization</span> أو <span className="font-mono bg-muted px-1">LocalBusiness</span> Schema لصفحة المتجر الرئيسية.</li>
            <li>تحقق من صحة المخطط باستخدام أداة Google Rich Results Test.</li>
          </ul>
        </li>
        <li>
          <strong>استراتيجية المحتوى:</strong>
          <ul className="list-disc pr-6 mt-2 space-y-1 text-sm text-muted-foreground">
            <li>اكتب وصفًا فريدًا ومفصلاً لكل منتج (لا تكرر النصوص).</li>
            <li>أنشئ مدونة أو قسم مقالات للإجابة على أسئلة العملاء وتقديم نصائح حول المنتجات.</li>
            <li>استخدم الكلمات المفتاحية الأكثر بحثًا في عناوين ووصف المنتجات والمقالات (ابحث عنها باستخدام Google Keyword Planner أو SEMrush).</li>
            <li>شجع العملاء على كتابة تقييمات للمنتجات، واظهرها في الصفحة.</li>
          </ul>
        </li>
        <li>
          <strong>تحسين تجربة المستخدم (UX):</strong>
          <ul className="list-disc pr-6 mt-2 space-y-1 text-sm text-muted-foreground">
            <li>اجعل عملية البحث عن المنتجات سهلة وسريعة.</li>
            <li>وفر تصنيفات وفلاتر واضحة للمنتجات.</li>
            <li>قلل عدد الخطوات لإتمام الشراء.</li>
            <li>أضف أسئلة شائعة (FAQ) في صفحات المنتجات المهمة.</li>
          </ul>
        </li>
        <li>
          <strong>روابط خارجية وداخلية (Link Building):</strong>
          <ul className="list-disc pr-6 mt-2 space-y-1 text-sm text-muted-foreground">
            <li>اربط المنتجات ذات الصلة ببعضها البعض داخل الموقع.</li>
            <li>حاول الحصول على روابط من مواقع موثوقة (دليل أعمال، مدونات، شراكات).</li>
          </ul>
        </li>
        <li>
          <strong>مراقبة الأداء والتحسين المستمر:</strong>
          <ul className="list-disc pr-6 mt-2 space-y-1 text-sm text-muted-foreground">
            <li>اربط الموقع بـ Google Search Console وGoogle Analytics لمتابعة الأداء.</li>
            <li>راقب الكلمات المفتاحية الأكثر جلبًا للزيارات وحدث المحتوى باستمرار.</li>
            <li>حلل الصفحات ذات معدل الارتداد العالي وحسنها.</li>
          </ul>
        </li>
      </ol>
      <div className="mt-8 p-4 bg-warning border-r-4 border-warning rounded text-sm text-warning">
        <strong>ملاحظة:</strong> التزم بتحديث بيانات المنتجات والمخططات باستمرار، وتأكد من أن جميع الصفحات المهمة قابلة للفهرسة.
      </div>
      <div className="mt-4 text-xs text-muted">آخر تحديث: مايو 2025</div>
    </div>
  );
}
