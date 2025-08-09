'use client';

import {
  BarChart2,
  Eye,
  PackageSearch,
} from 'lucide-react';
import Link from '@/components/link';
import { toast } from 'sonner';

import AddImage from '@/components/AddImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CategoryWithProducts } from '@/types/databaseTypes';

import CategoryUpsert from './CategoryUpsert';
import DeleteCategoryAlert from './DeleteCategoryAlert';

interface CategoryCardProps {
  category: CategoryWithProducts;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { id, name, description, createdAt, imageUrl, productAssignments } = category;


  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
      {/* Image Upload */}
      <div className="relative h-40 w-full overflow-hidden bg-muted/20">
        <AddImage
          url={imageUrl ?? ''}
          alt={`صورة ${name}`}
          recordId={id}
          table="category"
          tableField="imageUrl"
          onUploadComplete={() => toast.success('تم رفع صورة التصنيف بنجاح')}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className='flex items-center justify-between'>
          <h3 className="text-lg font-semibold truncate" title={name}>
            {name}
          </h3>
          <Badge variant={"outline"} className='flex items-center gap-2 text-muted-foreground'><PackageSearch className='h-4 w-4 ' />{productAssignments.length}</Badge>
        </div>
        <p className="text-sm">{description || '—'}</p>
        <p className="text-sm text-muted-foreground">
          تاريخ الإضافة: {formatDate(createdAt)}
        </p>
      </div>

      {/* Footer Actions */}
      <footer className="flex items-center justify-around border-t bg-muted px-4 py-2">
        <Link href={`/dashboard/management-categories/view/${id}`} aria-label="عرض التصنيف">
          <Eye className="h-5 w-5" />
        </Link>

        <CategoryUpsert
          mode="update"
          title="تعديل تصنيف"
          description="يرجى تعديل بيانات التصنيف"
          defaultValues={{
            id,
            name,
            description: description ?? undefined,
          }}
        />
        <Button
          variant="ghost"
          size="sm"
          aria-label="تحليلات"
          onClick={() => alert("comeing soon")}
        >
          <BarChart2 className="h-5 w-5" />
        </Button>


        <DeleteCategoryAlert categoryId={id} />
      </footer>
    </div>
  );
}
