import {
  TabsContent,
} from '@/components/ui/tabs';

interface ProductDetailsTabProps {
  product: any;
}

export default function ProductDetailsTab({ product }: ProductDetailsTabProps) {
  return (
    <TabsContent value='details' className='py-4'>
      <div className='prose prose-sm max-w-none'>
        <h3>معلومات المنتج</h3>
        <p>{product.details || product.name}</p>
        <div className='mt-6 grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div>
            <h4>المواصفات</h4>
            <ul>
              <li>المورد: {product.supplier?.name || 'غير محدد'}</li>
              <li>رمز المنتج: {product.productCode || product.id.substring(0, 8)}</li>
              {product.size && <li>المقاس: {product.size}</li>}
              {product.material && <li>الخامة: {product.material}</li>}
              {product.brand && <li>الماركة: {product.brand}</li>}
              {product.features && product.features.length > 0 && (
                <li>
                  المميزات:
                  <ul className='ml-4 mt-1 list-inside list-disc'>
                    {product.features.map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </li>
              )}
              {product.careInstructions && (
                <li>تعليمات العناية: {product.careInstructions}</li>
              )}
            </ul>
          </div>
          <div>
            <h4>الشحن والإرجاع</h4>
            <ul>
              <li>الشحن خلال {product.shippingDays || '3-5'} أيام عمل</li>
              <li>إمكانية الإرجاع خلال {product.returnPeriodDays || 14} يوم</li>
              {product.hasQualityGuarantee !== false && <li>ضمان الجودة</li>}
            </ul>
          </div>
        </div>
      </div>
    </TabsContent>
  );
} 