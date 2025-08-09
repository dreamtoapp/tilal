

import CategorySeoTable from './components/CategorySeoTable';
import { getAllCategoriesWithSeoStatus } from './actions/get-all-categories-seo';

export default async function CategorySeoListPage() {
  const categories = await getAllCategoriesWithSeoStatus();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">إدارة SEO للأصناف</h1>
      <CategorySeoTable categories={categories} />
    </div>
  );
}
