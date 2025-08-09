// Product SEO Edit Page
// Route: /dashboard/seo/product/[id]
import { notFound } from 'next/navigation';

import { getProductById } from '../actions/get-product-by-id';
import { getProductSeoByLocale } from '../actions/get-product-seo-by-locale';
import ProductSeoForm from '../components/ProductSeoForm';

export default async function ProductSeoEditPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const product = await getProductById(id);
  if (!product) return notFound();
  // console.log('Product:', product);

  // Fetch SEO for both locales
  const arSeo = await getProductSeoByLocale(id, 'ar-SA');
  const enSeo = await getProductSeoByLocale(id, 'en-US');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">تعديل SEO للمنتج: {product.name}</h1>
      <ProductSeoForm
        productId={product.id}
        productData={product}
        arSeo={arSeo}
        enSeo={enSeo}
      />
    </div>
  );
}
