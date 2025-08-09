// utils/fashionData/offers.ts
// Realistic fashion offers and promotions with Arabic/English support

import { Slugify } from '../slug';

export interface FashionOffer {
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  bannerImage: string;
  isActive: boolean;
  displayOrder: number;
  hasDiscount: boolean;
  discountPercentage?: number;
  header: string;
  headerEn: string;
  subheader: string;
  subheaderEn: string;
  productCount: number;
}

export const FASHION_OFFERS: FashionOffer[] = [
  {
    name: 'تخفيضات الصيف الكبرى',
    nameEn: 'Summer Mega Sale',
    slug: Slugify('تخفيضات الصيف الكبرى'),
    description: 'تخفيضات كبيرة على جميع ملابس الصيف والأحذية',
    descriptionEn: 'Big discounts on all summer clothing and shoes',
    bannerImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
    isActive: true,
    displayOrder: 1,
    hasDiscount: true,
    discountPercentage: 40,
    header: 'تخفيضات الصيف الكبرى',
    headerEn: 'Summer Mega Sale',
    subheader: 'خصم يصل إلى 40% على جميع المنتجات',
    subheaderEn: 'Up to 40% off on all products',
    productCount: 50
  },
  {
    name: 'عرض الأزياء الجديدة',
    nameEn: 'New Fashion Collection',
    slug: Slugify('عرض الأزياء الجديدة'),
    description: 'أحدث صيحات الموضة والأزياء الجديدة',
    descriptionEn: 'Latest fashion trends and new collections',
    bannerImage: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&h=400&fit=crop',
    isActive: true,
    displayOrder: 2,
    hasDiscount: false,
    header: 'أزياء جديدة',
    headerEn: 'New Fashion',
    subheader: 'اكتشف أحدث صيحات الموضة',
    subheaderEn: 'Discover the latest fashion trends',
    productCount: 30
  },
  {
    name: 'عرض الأحذية الرياضية',
    nameEn: 'Athletic Shoes Sale',
    slug: Slugify('عرض الأحذية الرياضية'),
    description: 'تخفيضات على الأحذية الرياضية والملابس الرياضية',
    descriptionEn: 'Discounts on athletic shoes and sportswear',
    bannerImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=400&fit=crop',
    isActive: true,
    displayOrder: 3,
    hasDiscount: true,
    discountPercentage: 25,
    header: 'أحذية رياضية',
    headerEn: 'Athletic Shoes',
    subheader: 'خصم 25% على الأحذية الرياضية',
    subheaderEn: '25% off on athletic shoes',
    productCount: 25
  },
  {
    name: 'عرض الإكسسوارات',
    nameEn: 'Accessories Sale',
    slug: Slugify('عرض الإكسسوارات'),
    description: 'إكسسوارات أنيقة بأسعار منافسة',
    descriptionEn: 'Elegant accessories at competitive prices',
    bannerImage: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&h=400&fit=crop',
    isActive: true,
    displayOrder: 4,
    hasDiscount: true,
    discountPercentage: 30,
    header: 'إكسسوارات أنيقة',
    headerEn: 'Elegant Accessories',
    subheader: 'خصم 30% على جميع الإكسسوارات',
    subheaderEn: '30% off on all accessories',
    productCount: 40
  },
  {
    name: 'عرض الحقائب الفاخرة',
    nameEn: 'Luxury Bags Sale',
    slug: Slugify('عرض الحقائب الفاخرة'),
    description: 'حقائب فاخرة وأنيقة بأسعار خاصة',
    descriptionEn: 'Luxury and elegant bags at special prices',
    bannerImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&h=400&fit=crop',
    isActive: true,
    displayOrder: 5,
    hasDiscount: true,
    discountPercentage: 35,
    header: 'حقائب فاخرة',
    headerEn: 'Luxury Bags',
    subheader: 'خصم 35% على الحقائب الفاخرة',
    subheaderEn: '35% off on luxury bags',
    productCount: 20
  },
  {
    name: 'عرض الأزياء الرسمية',
    nameEn: 'Formal Wear Sale',
    slug: Slugify('عرض الأزياء الرسمية'),
    description: 'ملابس رسمية أنيقة للمناسبات الخاصة',
    descriptionEn: 'Elegant formal wear for special occasions',
    bannerImage: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200&h=400&fit=crop',
    isActive: true,
    displayOrder: 6,
    hasDiscount: true,
    discountPercentage: 20,
    header: 'أزياء رسمية',
    headerEn: 'Formal Wear',
    subheader: 'خصم 20% على الملابس الرسمية',
    subheaderEn: '20% off on formal wear',
    productCount: 15
  },
  {
    name: 'عرض ملابس الأطفال',
    nameEn: 'Kids Clothing Sale',
    slug: Slugify('عرض ملابس الأطفال'),
    description: 'ملابس أطفال مريحة وملونة بأسعار مناسبة',
    descriptionEn: 'Comfortable and colorful kids clothing at affordable prices',
    bannerImage: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=400&fit=crop',
    isActive: true,
    displayOrder: 7,
    hasDiscount: true,
    discountPercentage: 15,
    header: 'ملابس أطفال',
    headerEn: 'Kids Clothing',
    subheader: 'خصم 15% على ملابس الأطفال',
    subheaderEn: '15% off on kids clothing',
    productCount: 35
  },
  {
    name: 'عرض الأزياء الإسلامية',
    nameEn: 'Islamic Fashion Sale',
    slug: Slugify('عرض الأزياء الإسلامية'),
    description: 'أزياء إسلامية محتشمة وأنيقة بأسعار مناسبة',
    descriptionEn: 'Modest and elegant Islamic fashion at affordable prices',
    bannerImage: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&h=400&fit=crop',
    isActive: true,
    displayOrder: 8,
    hasDiscount: true,
    discountPercentage: 25,
    header: 'أزياء إسلامية',
    headerEn: 'Islamic Fashion',
    subheader: 'خصم 25% على الأزياء الإسلامية',
    subheaderEn: '25% off on Islamic fashion',
    productCount: 30
  }
]; 