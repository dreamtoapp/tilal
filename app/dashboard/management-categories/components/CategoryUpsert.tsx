'use client';

import {
  Edit,
  Plus,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import AppDialog from '@/components/app-dialog';
import FormError from '@/components/form-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { iconVariants } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import { upsertCategory } from '../actions/upsertCategory';
// ✅ NEW
import {
  CategoryFormData,
  CategorySchema,
  getCategoryFields,
} from '../helper/categoryZodAndInputs';

interface AddCategoryProps {
  mode: 'new' | 'update';
  defaultValues: CategoryFormData;
  title?: string;
  description?: string;
}

export default function CategoryUpsert({
  mode,
  defaultValues,
  title,
  description,
}: AddCategoryProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(CategorySchema),
    mode: 'onChange',
    defaultValues: {
      id: defaultValues.id,
      name: defaultValues.name,
      description: defaultValues.description ?? undefined,
    },
  });

  const onSubmit = async (formData: CategoryFormData) => {
    try {
      const result = await upsertCategory(formData, mode); // ✅ Call category action

      if (result.ok) {
        toast.success(result.msg || 'تم حفظ بيانات التصنيف بنجاح');
        reset();
        setTimeout(() => window.location.reload(), 1200);
      } else {
        toast.error(result.msg || 'حدث خطأ يرجى المحاولة لاحقاً');
      }
    } catch (err) {
      toast.error('فشل في إرسال البيانات، يرجى المحاولة لاحقاً');
      console.error('فشل في إرسال البيانات:', err);
    }
  };

  return (
    <AppDialog
      trigger={
        <Button
          variant={mode === 'new' ? 'default' : 'outline'}
          size="sm"
          className="flex items-center gap-2"
        >
          {mode === 'new' ? (
            <>
              <Plus className={iconVariants({ size: 'xs' })} />
              <span>إضافة</span>
            </>
          ) : (
            <>
              <Edit className={iconVariants({ size: 'xs' })} />
              <span>تعديل</span>
            </>
          )}
        </Button>
      }
      title={title}
      description={description}
      mode={mode}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {getCategoryFields(register, errors).map((section) => (
          <div key={section.section} className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {section.section}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div key={field.name} className={field.className}>
                  <Input
                    {...field.register}
                    type={field.type}
                    placeholder={field.placeholder}
                    disabled={isSubmitting}
                    maxLength={field.maxLength}
                  />
                  <FormError message={field.error} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ'}
        </Button>
      </form>
    </AppDialog>
  );
}
