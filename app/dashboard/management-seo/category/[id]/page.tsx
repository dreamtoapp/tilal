// Category SEO Edit Page
// Route: /dashboard/seo/category/[id]

import { getCategoryById } from '../actions/get-category-by-id';
import { getCategorySeoByLocale } from '../actions/get-category-seo-by-locale';
import CategorySeoForm from '../components/CategorySeoForm';

export default async function CategorySeoEditPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;

  const category = await getCategoryById(id);
  const seoByLocale = await getCategorySeoByLocale(id);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">تعديل SEO للصنف: {category?.name}</h1>
      <CategorySeoForm category={category} seoByLocale={seoByLocale} />
    </div>
  );
}
