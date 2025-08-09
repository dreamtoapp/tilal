
import {
  Metadata
} from 'next';
import { notFound } from 'next/navigation';

import { auth } from '@/auth';
import IncrementPreviewOnView from '../compnents/IncrementPreviewOnView';
import { Separator } from '@/components/ui/separator';

// Import all separated components
import ProductImageSection from '../compnents/ProductImageSection';
import ProductInfoSection from '../compnents/ProductInfoSection';
import ProductPriceSection from '../compnents/ProductPriceSection';
import ProductDescription from '../compnents/ProductDescription';
import ProductActionsSection from '../compnents/ProductActionsSection';
import ProductTabs from '../compnents/ProductTabs';
import RelatedProductsSection from '../compnents/RelatedProductsSection';

import {
  getProductBySlug,
  getProductReviews,
} from '../actions/actions';
import { PageProps } from '@/types/commonTypes';

// --- Metadata ---
export async function generateMetadata({ params }: PageProps<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return {
      title: 'المنتج غير موجود | المتجر الإلكتروني',
      description: 'عذراً، المنتج الذي تبحث عنه غير موجود',
    };
  }
  return {
    title: `${product.name} | المتجر الإلكتروني`,
    description: product.details || 'تفاصيل المنتج في المتجر الإلكتروني',
    openGraph: {
      title: product.name,
      description: product.details || 'تفاصيل المنتج في المتجر الإلكتروني',
      images: [
        {
          url: product.imageUrl || '/fallback/product-fallback.avif',
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: 'website',
      siteName: 'المتجر الإلكتروني',
      locale: 'ar_SA',
    },
  };
}

// --- Main Page ---
export default async function ProductPage({ params }: PageProps<{ slug: string }>) {
  const { slug } = await params;
  const session = await auth();
  const product = await getProductBySlug(slug);
  if (!product) return notFound();
  const reviews = await getProductReviews(product.id);
  const formattedPrice = new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(product.price);
  const discountPercentage = 0;
  const formattedSalePrice = null;
  const mainImage = product.imageUrl || '/fallback/product-fallback.avif';
  const additionalImages = product.images?.filter((img: string) => img !== mainImage) || [];

  return (
    <>
      <IncrementPreviewOnView productId={product.id} />
      <div className='container mx-auto px-4 py-8 max-w-7xl'>
        {/* Main Product Section */}
        <div className='grid grid-cols-1 mx-auto lg:grid-cols-2 gap-8 lg:gap-12 items-start justify-items-center lg:justify-items-start'>
          {/* Product Image */}
          <div className='sticky top-4 w-full max-w-md lg:max-w-none'>
            <ProductImageSection mainImage={mainImage} additionalImages={additionalImages} />
          </div>

          {/* Product Details */}
          <div className='space-y-8 w-full max-w-md lg:max-w-none text-center lg:text-start'>
            <ProductInfoSection product={product} />
            <ProductPriceSection formattedPrice={formattedPrice} formattedSalePrice={formattedSalePrice} discountPercentage={discountPercentage} />
            <Separator className='my-6' />
            <ProductDescription product={product} />
            <ProductActionsSection product={product} />
          </div>
        </div>

        {/* Product Tabs */}
        <div className='mt-16'>
          <ProductTabs product={product} reviews={reviews} session={session} mainImage={mainImage} />
        </div>

        {/* Related Products */}
        <div className='mt-20'>
          <RelatedProductsSection product={product} />
        </div>
      </div>
    </>
  );
}
