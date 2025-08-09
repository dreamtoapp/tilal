import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { fetchFilteredProducts } from './actions/fetchFilteredProducts';
import PaginationControls from './components/PaginationControls';
import ProductCard from './components/ProductCard';
import ProductFilterForm from './components/ProductFilterForm';
import Link from '@/components/link';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function getStringParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] || '';
  return param || '';
}

export default async function ProductsControlPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;

  // Parse filters and pagination from searchParams
  const name = getStringParam(searchParams.name);
  const supplierId = getStringParam(searchParams.supplierId);
  const status = getStringParam(searchParams.status) || 'all';
  const type = getStringParam(searchParams.type) || 'all';
  const stock = getStringParam(searchParams.stock) || 'all';
  const page = parseInt(getStringParam(searchParams.page) || '1', 10);
  const pageSize = parseInt(getStringParam(searchParams.pageSize) || '12', 10);

  const filters = {
    name,
    supplierId: supplierId || null,
    status,
    type,
    stock,
    page,
    pageSize,
  };

  const { products, total } = await fetchFilteredProducts(filters);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6" dir="rtl">
      {/* Enhanced Header with Icon and Improved Layout */}
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-3">
            <Icon name="Package" className="h-8 w-8 text-feature-products icon-enhanced" />
            <div>
              <h1 className="text-3xl font-bold text-primary">إدارة المنتجات</h1>
              <p className="text-sm text-muted-foreground mt-1">
                عرض جميع المنتجات، التصفية، والبحث، مع إمكانية إضافة منتج جديد.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Add Product Button */}
        <Button asChild className="btn-add gap-2 shadow-lg card-hover-effect">
          <Link href="/dashboard/management-products/new">
            <Icon name="Plus" className="h-5 w-5 icon-enhanced" />
            إضافة منتج جديد
          </Link>
        </Button>
      </div>

      {/* Enhanced Filters Card */}
      <Card className="shadow-lg border-l-4 border-l-feature-products card-hover-effect mb-8">
        <CardContent className="p-6">
          <ProductFilterForm
            name={name}
            status={status}
            type={type}
            stock={stock}
          />
        </CardContent>
      </Card>

      {/* Smart Responsive Grid */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center mb-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Enhanced Pagination */}
          <div className="flex justify-center">
            <PaginationControls
              page={page}
              pageSize={pageSize}
              total={total}
            />
          </div>
        </>
      ) : (
        /* Enhanced Empty State */
        <Card className="shadow-lg border-l-4 border-l-feature-products card-hover-effect">
          <CardContent className="p-12 text-center">
            <Icon name="Package" className="h-16 w-16 text-feature-products/50 mx-auto mb-4 icon-enhanced" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              لا توجد منتجات متاحة
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {name || status !== 'all' || type !== 'all' || stock !== 'all'
                ? 'لم يتم العثور على منتجات تطابق معايير البحث المحددة. جرب تعديل المرشحات أو البحث عن شيء آخر.'
                : 'لم يتم إضافة أي منتجات بعد. ابدأ ببناء متجرك من خلال إضافة منتجك الأول.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="btn-add gap-2">
                <Link href="/dashboard/management-products/new">
                  <Icon name="Plus" className="h-4 w-4" />
                  إضافة منتج جديد
                </Link>
              </Button>
              {(name || status !== 'all' || type !== 'all' || stock !== 'all') && (
                <Button asChild variant="outline" className="btn-cancel-outline">
                  <Link href="/dashboard/management-products">
                    مسح المرشحات
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
