import dynamic from 'next/dynamic';
import BackToTopButton from '@/components/BackToTopButton';
import { getCachedProductsPage } from './homepage/actions/fetchProductsPage';
import CategoryList from './homepage/component/category/CategoryList';
import FeaturedPromotions from './homepage/component/offer/FeaturedPromotions';
import { SWRConfig } from 'swr';
import ProductInfiniteGrid from './homepage/component/ProductInfiniteGrid';
const PAGE_SIZE = 8;

const CriticalCSS = dynamic(() => import('./homepage/component/CriticalCSS'), { ssr: true });

export default async function HomePage(props: { searchParams: Promise<{ slug?: string; page?: string; search?: string; description?: string; price?: string; category?: string; priceMin?: string; priceMax?: string }> }) {
  const searchParams = await props.searchParams;
  const slug = searchParams?.slug || '';
  const page = parseInt(searchParams?.page || '1', 10);
  const priceMin = searchParams?.priceMin ? Number(searchParams.priceMin) : undefined;
  const priceMax = searchParams?.priceMax ? Number(searchParams.priceMax) : undefined;
  const filters = {
    categorySlug: slug || searchParams?.category || '',
    search: searchParams?.search || '',
    description: searchParams?.description || '',
    priceMin,
    priceMax,
  };
  const { products } = await getCachedProductsPage({ ...filters, page, pageSize: PAGE_SIZE }) as {
    products: any[];
    total: number;
    totalPages: number;
    currentPage: number;
  };
  const firstPageKey = `/api/products-grid?page=1&slug=${encodeURIComponent(slug)}&pageSize=${PAGE_SIZE}`;

  return (
    <>
      <CriticalCSS />
      <div className='container mx-auto flex flex-col gap-8 bg-background text-foreground px-4 sm:px-6 lg:px-8'>
        {/* <PreloadScript /> */}
        {/* <HomepageHeroSection /> */}
        <section className="space-y-6" aria-label="Product categories">
          <CategoryList />
        </section>
        <section className="space-y-6" aria-label="Featured promotions">
          <FeaturedPromotions />
        </section>
        <section className="space-y-6" aria-label="Featured products">
          <SWRConfig value={{ fallback: { [firstPageKey]: { products } } }}>
            <ProductInfiniteGrid initialProducts={products} filters={filters} />
          </SWRConfig>
        </section>
        <BackToTopButton />
      </div>
    </>
  );
}
