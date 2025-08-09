import ProductImageGallery from './ProductImageGallery';

interface ProductImageSectionProps {
  mainImage: string;
  additionalImages: string[];
}

export default function ProductImageSection({ mainImage, additionalImages }: ProductImageSectionProps) {
  return (
    <div className='relative'>
      <ProductImageGallery mainImage={mainImage} additionalImages={additionalImages} />
    </div>
  );
} 