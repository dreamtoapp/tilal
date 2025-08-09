import { Badge } from '@/components/ui/badge';

import { getCategories } from './actions/get-category';
import CategoryCard from './components/CategoryCard';
import CategoryUpsert from './components/CategoryUpsert';

export default async function CategoriesPage() {
  const categories = await getCategories();


  return (
    <div className="flex min-h-screen flex-col p-4 md:p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">إدارة التصنيفات</h1>
          <Badge variant="outline">{categories.length}</Badge>
        </div>

        <CategoryUpsert
          mode="new"
          title="إضافة تصنيف"
          description="يرجى إدخال بيانات التصنيف"
          defaultValues={{
            name: '',
            description: '',
          }}
        />
      </header>

      {/* Category list */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
