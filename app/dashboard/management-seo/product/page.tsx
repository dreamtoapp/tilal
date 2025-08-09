// Product SEO List Page
// Route: /dashboard/seo/product
// Shows all products with their SEO status per locale

import ProductSeoTable from './components/ProductSeoTable';
import { getAllProductsWithSeoStatus } from './actions/get-all-products-seo';

export default async function ProductSeoListPage() {
  const products = await getAllProductsWithSeoStatus();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">إدارة SEO للمنتجات</h1>
      <ProductSeoTable products={products} />
    </div>
  );
}
