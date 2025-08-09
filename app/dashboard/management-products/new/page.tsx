import { Icon } from '@/components/icons/Icon';
import { getProductFormData, type DataFetchResult } from './actions/getProductData';
import ProductUpsert from './components/ProductUpsert';
import ProductFormFallback from './components/ProductFormFallback';

// Utility functions moved inline to resolve import issues
function canCreateProduct(data: DataFetchResult): boolean {
  return data.success && data.categories.length > 0;
}

function getFormErrorMessage(data: DataFetchResult): string | null {
  if (data.success) return null;

  if (data.categories.length === 0 && data.suppliers.length === 0) {
    return 'لا يمكن إضافة منتج جديد. يرجى إضافة فئات وموردين أولاً.';
  }

  if (data.categories.length === 0) {
    return 'لا يمكن إضافة منتج بدون فئة. يرجى إضافة فئة واحدة على الأقل.';
  }

  return data.error;
}

/**
 * New Product Page Component
 * 
 * Uses route-level loading.tsx instead of Suspense for better UX
 * loading.tsx shows during navigation, this component handles data fetching
 */
export default async function NewProductPage() {
  // Fetch product form data using the proper data access layer
  const productData = await getProductFormData();

  // Handle error cases with proper fallback UI
  if (!canCreateProduct(productData)) {
    const errorMessage = getFormErrorMessage(productData);

    return (
      <div className="container mx-auto py-8 px-4 md:px-6 animate-in fade-in-50 duration-500" dir="rtl">
        {/* Header with BackButton and Title in same row */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Icon name="Plus" className="h-6 w-6 text-feature-products icon-enhanced" />
              <h1 className="text-2xl font-bold text-foreground">إضافة منتج جديد</h1>
            </div>
          </div>
        </div>

        <ProductFormFallback
          errorMessage={errorMessage || 'حدث خطأ غير متوقع'}
          hasCategories={productData.categories.length > 0}
          hasSuppliers={productData.suppliers.length > 0}
        />
      </div>
    );
  }

  // Successful case - render the product form
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 animate-in fade-in-50 duration-500" dir="rtl">
      {/* Header with BackButton and Title in same row */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Icon name="Plus" className="h-6 w-6 text-feature-products icon-enhanced" />
            <h1 className="text-2xl font-bold text-foreground">إضافة منتج جديد</h1>
          </div>
        </div>
      </div>

      {/* Enhanced Product Form Container */}
      <ProductUpsert
        mode="new"
        defaultValues={{
          name: '',
          supplierId: '',
          categoryIds: []
        }}
        categories={productData.categories}
        suppliers={productData.suppliers}
      />
    </div>
  );
}

/**
 * Metadata for the page
 */
export const metadata = {
  title: 'إضافة منتج جديد | لوحة التحكم',
  description: 'إضافة منتج جديد إلى متجر التجارة الإلكترونية',
};
