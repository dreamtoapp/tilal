import { Metadata } from 'next';
import Image from 'next/image';
import Link from '@/components/link';
import { notFound } from 'next/navigation';
import { getCategoryPageData } from '../action/actions';
import { Separator } from '@/components/ui/separator';

import { PageProps } from '@/types/commonTypes';
import ProductCardAdapter from '@/app/(e-comm)/(home-page-sections)/product/cards/ProductCardAdapter';

export async function generateMetadata({ params }: PageProps<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const categoryResult = await getCategoryPageData(slug, 1, 1); // Assuming 1 page, 1 product for metadata

  if (!categoryResult.success || !categoryResult.category) {
    return {
      title: 'Category Not Found',
    };
  }
  const category = categoryResult.category;
  return {
    title: category.name,
    description: category.description || `Browse products in the ${category.name} category.`,
    openGraph: {
      title: category.name,
      description: category.description || `Browse products in the ${category.name} category.`,
      images: category.imageUrl ? [{ url: category.imageUrl, alt: category.name }] : [],
    },
  };
}

const PRODUCTS_PER_PAGE = 12;

export default async function CategoryPage({ params, searchParams }: PageProps<{ slug: string }, { page?: string }>) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { slug } = resolvedParams;
  const pageParam = resolvedSearchParams?.page;
  const decodedSlug = decodeURIComponent(slug);
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = PRODUCTS_PER_PAGE;

  // Use the new aggregated action
  const data = await getCategoryPageData(decodedSlug, currentPage, pageSize);

  if (!data.success || !data.category) {
    notFound();
  }
  const category = data.category;
  const productsResult = {
    success: true,
    products: data.products,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
    totalProducts: data.totalProducts,
  };
  const allCategories = data.allCategories;

  // Get related categories (excluding current one) - FIXED
  const relatedCategories = allCategories
    .filter((c: any) => c.slug !== decodedSlug)  // Use decoded slug for comparison
    .slice(0, 4); // Limit to 4 related categories

  return (
    <div className="container mx-auto bg-background px-4 py-8 text-foreground">
      {/* Breadcrumb navigation */}
      <nav className="mb-6 flex items-center text-sm">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          الرئيسية
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <Link href="/categories" className="text-muted-foreground hover:text-foreground">
          الفئات
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="font-medium">{category.name}</span>
      </nav>

      {/* Hero header with category image */}
      <header className="mb-8 overflow-hidden rounded-xl bg-accent">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-1 p-6 md:p-10">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                {category.description}
              </p>
            )}
            <div className="mt-6 rounded-lg bg-muted/50 px-4 py-2">
              <span className="font-medium">{productsResult.success ? productsResult.totalProducts : 0}</span> منتج في هذه الفئة
            </div>
          </div>

          {category.imageUrl && (
            <div className="h-60 w-full md:h-80 md:w-1/2 lg:h-96">
              <div className="relative h-full w-full">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Products grid */}
      <h2 className="mb-6 text-2xl font-bold">منتجات {category.name}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.products.map((product, idx) => (
          <div key={product.id} className="product-card">
            <ProductCardAdapter product={product} className="h-full w-full" index={idx} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {/* Pagination logic can be handled inside ProductsSection if needed */}

      {/* Related Categories Section */}
      {relatedCategories.length > 0 && (
        <div className="mt-20">
          <Separator className="mb-8" />
          <h2 className="mb-6 text-2xl font-bold">فئات ذات صلة</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {relatedCategories.map((relatedCategory: any) => (
              <Link
                key={relatedCategory.id}
                href={`/categories/${relatedCategory.slug}`}
                className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div className="relative h-40 overflow-hidden">
                  {relatedCategory.imageUrl ? (
                    <Image
                      src={relatedCategory.imageUrl}
                      alt={relatedCategory.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{relatedCategory.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {relatedCategory.productCount} منتج
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
