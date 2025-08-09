// utils/fashionData/categories.ts
// Realistic fashion categories with Arabic/English support

import { Slugify } from '../slug';

export interface FashionCategory {
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  imageUrl: string;
  productCount: number;
}

export const FASHION_CATEGORIES: FashionCategory[] = [
  // Women's Fashion
  {
    name: 'فساتين نسائية',
    nameEn: "Women's Dresses",
    slug: Slugify('فساتين نسائية'),
    description: 'مجموعة متنوعة من الفساتين الأنيقة للمناسبات المختلفة',
    descriptionEn: 'Elegant dresses for various occasions',
    imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=1000&fit=crop',
    productCount: 25
  },
  {
    name: 'ملابس نسائية',
    nameEn: "Women's Clothing",
    slug: Slugify('ملابس نسائية'),
    description: 'ملابس نسائية عصرية ومريحة للاستخدام اليومي',
    descriptionEn: 'Modern and comfortable women\'s clothing for daily wear',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop',
    productCount: 40
  },
  {
    name: 'أحذية نسائية',
    nameEn: "Women's Shoes",
    slug: Slugify('أحذية نسائية'),
    description: 'أحذية أنيقة ومريحة لجميع المناسبات',
    descriptionEn: 'Elegant and comfortable shoes for all occasions',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop',
    productCount: 30
  },
  {
    name: 'حقائب نسائية',
    nameEn: "Women's Bags",
    slug: Slugify('حقائب نسائية'),
    description: 'حقائب عصرية وأنيقة لاستكمال إطلالتك',
    descriptionEn: 'Modern and elegant bags to complete your look',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=1000&fit=crop',
    productCount: 20
  },
  {
    name: 'إكسسوارات نسائية',
    nameEn: "Women's Accessories",
    slug: Slugify('إكسسوارات نسائية'),
    description: 'إكسسوارات أنيقة لإضافة لمسة جمالية لإطلالتك',
    descriptionEn: 'Elegant accessories to add beauty to your look',
    imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=1000&fit=crop',
    productCount: 35
  },

  // Men's Fashion
  {
    name: 'ملابس رجالية',
    nameEn: "Men's Clothing",
    slug: Slugify('ملابس رجالية'),
    description: 'ملابس رجالية عصرية وأنيقة للاستخدام اليومي والمناسبات',
    descriptionEn: 'Modern and elegant men\'s clothing for daily wear and occasions',
    imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=1000&fit=crop',
    productCount: 35
  },
  {
    name: 'أحذية رجالية',
    nameEn: "Men's Shoes",
    slug: Slugify('أحذية رجالية'),
    description: 'أحذية رجالية مريحة وأنيقة لجميع المناسبات',
    descriptionEn: 'Comfortable and elegant men\'s shoes for all occasions',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop',
    productCount: 25
  },
  {
    name: 'إكسسوارات رجالية',
    nameEn: "Men's Accessories",
    slug: Slugify('إكسسوارات رجالية'),
    description: 'إكسسوارات رجالية أنيقة لإكمال إطلالتك',
    descriptionEn: 'Elegant men\'s accessories to complete your look',
    imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=1000&fit=crop',
    productCount: 20
  },

  // Kids & Family
  {
    name: 'ملابس أطفال',
    nameEn: "Kids' Clothing",
    slug: Slugify('ملابس أطفال'),
    description: 'ملابس أطفال مريحة وملونة تناسب جميع الأعمار',
    descriptionEn: 'Comfortable and colorful kids\' clothing for all ages',
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1000&fit=crop',
    productCount: 30
  },
  {
    name: 'أحذية أطفال',
    nameEn: "Kids' Shoes",
    slug: Slugify('أحذية أطفال'),
    description: 'أحذية أطفال مريحة وآمنة لجميع الأعمار',
    descriptionEn: 'Comfortable and safe kids\' shoes for all ages',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop',
    productCount: 20
  },

  // Special Categories
  {
    name: 'ملابس رياضية',
    nameEn: "Sportswear",
    slug: Slugify('ملابس رياضية'),
    description: 'ملابس رياضية مريحة ومناسبة للتمارين الرياضية',
    descriptionEn: 'Comfortable sportswear suitable for exercise',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1000&fit=crop',
    productCount: 25
  },
  {
    name: 'ملابس رسمية',
    nameEn: "Formal Wear",
    slug: Slugify('ملابس رسمية'),
    description: 'ملابس رسمية أنيقة للمناسبات الرسمية والاجتماعات',
    descriptionEn: 'Elegant formal wear for formal occasions and meetings',
    imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=1000&fit=crop',
    productCount: 20
  },
  {
    name: 'ملابس عرائس',
    nameEn: "Bridal Wear",
    slug: Slugify('ملابس عرائس'),
    description: 'فساتين عرائس فاخرة وأنيقة لليوم الأهم',
    descriptionEn: 'Luxurious and elegant bridal dresses for the most important day',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1000&fit=crop',
    productCount: 15
  },
  {
    name: 'أزياء إسلامية',
    nameEn: "Islamic Fashion",
    slug: Slugify('أزياء إسلامية'),
    description: 'أزياء إسلامية محتشمة وأنيقة تناسب جميع المناسبات',
    descriptionEn: 'Modest and elegant Islamic fashion suitable for all occasions',
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=1000&fit=crop',
    productCount: 30
  }
]; 