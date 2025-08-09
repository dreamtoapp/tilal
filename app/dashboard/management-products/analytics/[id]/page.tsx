
import ClientAnalyticsDashboard from './components/ClientAnalyticsDashboard';
import { getProductAnalytics } from './actions/getAnalytics';
import ProductNotFound from './components/ProductNotFound';

// Removed Icon import: import { Icon } from '@/components/icons';

function isValidObjectId(id: string) {
  return /^[a-f\d]{24}$/i.test(id);
}

export default async function ProductAnalyticsPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ id: string }>; // Type remains Promise
  searchParams?: Promise<{ from?: string; to?: string; chartType?: string }>; // Type remains Promise
}) {
  const params = await paramsPromise; // Await params
  const { id } = params;

  if (!isValidObjectId(id)) {
    return <ProductNotFound />;
  }

  const resolvedSearchParams = searchParamsPromise ? await searchParamsPromise : {}; // Await searchParams
  const { from, to, chartType } = resolvedSearchParams;

  const analytics = await getProductAnalytics(id, from, to);
  if (!analytics?.product) {
    return <ProductNotFound />;
  }

  return (
    <div className='container mx-auto py-8' dir='rtl'>
      <ClientAnalyticsDashboard
        analytics={{ ...analytics, product: { ...analytics.product, size: analytics.product.size ?? null, details: analytics.product.details ?? null, productCode: analytics.product.productCode ?? null, gtin: analytics.product.gtin ?? null, material: analytics.product.material ?? null, brand: analytics.product.brand ?? null, color: analytics.product.color ?? null } }}
        id={id}
        initialChartType={chartType || 'bar'}
        initialFrom={from || ''}
        initialTo={to || ''}
      />
    </div>
  );
}
