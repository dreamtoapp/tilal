import { NextRequest } from 'next/server';
import { getCachedProductsPage } from '@/app/(e-comm)/homepage/actions/fetchProductsPage';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '8', 10);
    const search = searchParams.get('search') || '';
    const priceMinRaw = searchParams.get('priceMin');
    const priceMaxRaw = searchParams.get('priceMax');
    const priceMin = priceMinRaw && !isNaN(Number(priceMinRaw)) ? Number(priceMinRaw) : undefined;
    const priceMax = priceMaxRaw && !isNaN(Number(priceMaxRaw)) ? Number(priceMaxRaw) : undefined;
    const slug = searchParams.get('category') || searchParams.get('slug') || '';

    const { products, total, totalPages, currentPage } = await getCachedProductsPage({
      search,
      priceMin,
      priceMax,
      page,
      pageSize,
      slug,
    }) as {
      products: any[];
      total: number;
      totalPages: number;
      currentPage: number;
    };
    return Response.json({ products, total, totalPages, currentPage });
  } catch (error) {
    console.error('DB error:', error);
    return Response.json({ products: [], error: 'Database error' }, { status: 500 });
  }
} 