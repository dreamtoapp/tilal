// utils/fashionData/products.ts
// Realistic fashion product templates with Arabic/English support

import { Slugify } from '../slug';

export interface FashionProductTemplate {
  categorySlug: string;
  names: string[];
  namesEn: string[];
  priceRange: { min: number; max: number };
  compareAtPriceRange?: { min: number; max: number };
  features: string[];
  featuresEn: string[];
  materials: string[];
  colors: string[];
  sizes: string[];
  brands: string[];
  stockChance: number; // 0-1, chance of being in stock
  imageUrls: string[];
  productCount: number; // Number of products to generate for this template
}

export const FASHION_PRODUCT_TEMPLATES: FashionProductTemplate[] = [
  // Women's Dresses
  {
    categorySlug: Slugify('فساتين نسائية'),
    names: [
      'فستان أنيق للمناسبات',
      'فستان مسائي كلاسيك',
      'فستان صيفي خفيف',
      'فستان كوكتيل أنيق',
      'فستان عرائس بسيط',
      'فستان عمل رسمي',
      'فستان حفلة ملون',
      'فستان شاطئي مريح'
    ],
    namesEn: [
      'Elegant Occasion Dress',
      'Classic Evening Dress',
      'Light Summer Dress',
      'Elegant Cocktail Dress',
      'Simple Bridal Dress',
      'Formal Work Dress',
      'Colorful Party Dress',
      'Comfortable Beach Dress'
    ],
    priceRange: { min: 200, max: 1200 },
    compareAtPriceRange: { min: 250, max: 1500 },
    features: [
      'تصميم أنيق وعصري',
      'مريح للارتداء',
      'سهل العناية والغسيل',
      'مناسب للمناسبات المختلفة',
      'جودة عالية في الخياطة',
      'ألوان ثابتة لا تبهت'
    ],
    featuresEn: [
      'Elegant and modern design',
      'Comfortable to wear',
      'Easy care and washing',
      'Suitable for various occasions',
      'High quality stitching',
      'Colorfast and fade-resistant'
    ],
    materials: ['حرير طبيعي', 'قطن 100%', 'دنة عالية الجودة', 'ساتان فاخر'],
    colors: ['أسود', 'أزرق داكن', 'أحمر', 'أخضر داكن', 'بنفسجي', 'وردي'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    brands: ['Zara', 'H&M', 'Mango', 'Massimo Dutti'],
    stockChance: 0.8,
    imageUrls: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&h=1000&fit=crop&fm=webp&q=60',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1000&fit=crop&fm=webp&q=60',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop&fm=webp&q=60'
    ],
    productCount: 25
  },

  // Women's Clothing
  {
    categorySlug: Slugify('ملابس نسائية'),
    names: [
      'بلوزة أنيقة للعمل',
      'جينز كلاسيك مريح',
      'جاكيت رياضي أنيق',
      'تنورة قصيرة عصرية',
      'بنطلون كاجوال مريح',
      'قميص رسمي أنيق',
      'سويتر شتوي دافئ',
      'جاكيت جلد أنيق'
    ],
    namesEn: [
      'Elegant Work Blouse',
      'Comfortable Classic Jeans',
      'Elegant Sport Jacket',
      'Modern Short Skirt',
      'Comfortable Casual Pants',
      'Elegant Formal Shirt',
      'Warm Winter Sweater',
      'Elegant Leather Jacket'
    ],
    priceRange: { min: 80, max: 600 },
    compareAtPriceRange: { min: 100, max: 750 },
    features: [
      'مريح للارتداء اليومي',
      'جودة عالية في الخياطة',
      'سهل الغسيل والعناية',
      'تصميم عصري وأنيق',
      'ألوان ثابتة ومقاومة للبهتان',
      'مناسب لجميع المناسبات'
    ],
    featuresEn: [
      'Comfortable for daily wear',
      'High quality stitching',
      'Easy washing and care',
      'Modern and elegant design',
      'Colorfast and fade-resistant',
      'Suitable for all occasions'
    ],
    materials: ['قطن 100%', 'دنة عالية الجودة', 'ليكرا مريح', 'جلد طبيعي'],
    colors: ['أبيض', 'أسود', 'أزرق', 'أحمر', 'أخضر', 'أصفر', 'برتقالي'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
    brands: ['H&M', 'Zara', 'Uniqlo', 'Gap', 'Levi\'s'],
    stockChance: 0.85,
    imageUrls: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop&fm=webp&q=60',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1000&fit=crop&fm=webp&q=60',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=1000&fit=crop&fm=webp&q=60'
    ],
    productCount: 40
  },

  // Men's Clothing
  {
    categorySlug: Slugify('ملابس رجالية'),
    names: [
      'قميص رسمي أنيق',
      'جينز كلاسيك مريح',
      'جاكيت رياضي أنيق',
      'بنطلون كاجوال مريح',
      'سويتر شتوي دافئ',
      'جاكيت جلد أنيق',
      'قميص بولو كلاسيك',
      'بنطلون رسمي أنيق'
    ],
    namesEn: [
      'Elegant Formal Shirt',
      'Comfortable Classic Jeans',
      'Elegant Sport Jacket',
      'Comfortable Casual Pants',
      'Warm Winter Sweater',
      'Elegant Leather Jacket',
      'Classic Polo Shirt',
      'Elegant Formal Pants'
    ],
    priceRange: { min: 100, max: 800 },
    compareAtPriceRange: { min: 120, max: 1000 },
    features: [
      'مريح للارتداء اليومي',
      'جودة عالية في الخياطة',
      'سهل الغسيل والعناية',
      'تصميم عصري وأنيق',
      'ألوان ثابتة ومقاومة للبهتان',
      'مناسب لجميع المناسبات'
    ],
    featuresEn: [
      'Comfortable for daily wear',
      'High quality stitching',
      'Easy washing and care',
      'Modern and elegant design',
      'Colorfast and fade-resistant',
      'Suitable for all occasions'
    ],
    materials: ['قطن 100%', 'دنة عالية الجودة', 'ليكرا مريح', 'جلد طبيعي'],
    colors: ['أبيض', 'أسود', 'أزرق', 'أحمر', 'أخضر', 'أصفر', 'برتقالي'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'],
    brands: ['H&M', 'Zara', 'Uniqlo', 'Gap', 'Levi\'s', 'Nike', 'Adidas'],
    stockChance: 0.9,
    imageUrls: [
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=1000&fit=crop&fm=webp&q=60',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1000&fit=crop&fm=webp&q=60',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=1000&fit=crop&fm=webp&q=60'
    ],
    productCount: 35
  },

  // Women's Shoes
  {
    categorySlug: Slugify('أحذية نسائية'),
    names: [
      'حذاء كعب عالي أنيق',
      'حذاء مسطح مريح',
      'حذاء رياضي مريح',
      'حذاء رسمي أنيق',
      'حذاء شاطئي مريح',
      'حذاء كاجوال أنيق',
      'حذاء حفلة فاخر',
      'حذاء عمل مريح'
    ],
    namesEn: [
      'Elegant High Heel',
      'Comfortable Flat Shoe',
      'Comfortable Sport Shoe',
      'Elegant Formal Shoe',
      'Comfortable Beach Shoe',
      'Elegant Casual Shoe',
      'Luxurious Party Shoe',
      'Comfortable Work Shoe'
    ],
    priceRange: { min: 120, max: 800 },
    compareAtPriceRange: { min: 150, max: 1000 },
    features: [
      'مريح للارتداء طويلاً',
      'جودة عالية في الصناعة',
      'نعل مريح ومقاوم للانزلاق',
      'تصميم أنيق وعصري',
      'مناسب لجميع المناسبات',
      'سهل العناية والتنظيف'
    ],
    featuresEn: [
      'Comfortable for long wear',
      'High quality craftsmanship',
      'Comfortable and slip-resistant sole',
      'Elegant and modern design',
      'Suitable for all occasions',
      'Easy care and cleaning'
    ],
    materials: ['جلد طبيعي', 'جلد صناعي عالي الجودة', 'قماش مريح'],
    colors: ['أسود', 'أبيض', 'أزرق', 'أحمر', 'بني', 'رمادي', 'ذهبي'],
    sizes: ['35', '36', '37', '38', '39', '40', '41', '42'],
    brands: ['Nike', 'Adidas', 'Zara', 'H&M', 'Steve Madden'],
    stockChance: 0.75,
    imageUrls: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop&fm=webp&q=60',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop&fm=webp&q=60',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop&fm=webp&q=60'
    ],
    productCount: 30
  },

  // Men's Shoes
  {
    categorySlug: Slugify('أحذية رجالية'),
    names: [
      'حذاء رسمي أنيق',
      'حذاء رياضي مريح',
      'حذاء كاجوال أنيق',
      'حذاء عمل مريح',
      'حذاء شاطئي مريح',
      'حذاء حفلة فاخر',
      'حذاء مسطح مريح',
      'حذاء جلد كلاسيك'
    ],
    namesEn: [
      'Elegant Formal Shoe',
      'Comfortable Sport Shoe',
      'Elegant Casual Shoe',
      'Comfortable Work Shoe',
      'Comfortable Beach Shoe',
      'Luxurious Party Shoe',
      'Comfortable Flat Shoe',
      'Classic Leather Shoe'
    ],
    priceRange: { min: 150, max: 1000 },
    compareAtPriceRange: { min: 180, max: 1200 },
    features: [
      'مريح للارتداء طويلاً',
      'جودة عالية في الصناعة',
      'نعل مريح ومقاوم للانزلاق',
      'تصميم أنيق وعصري',
      'مناسب لجميع المناسبات',
      'سهل العناية والتنظيف'
    ],
    featuresEn: [
      'Comfortable for long wear',
      'High quality craftsmanship',
      'Comfortable and slip-resistant sole',
      'Elegant and modern design',
      'Suitable for all occasions',
      'Easy care and cleaning'
    ],
    materials: ['جلد طبيعي', 'جلد صناعي عالي الجودة', 'قماش مريح'],
    colors: ['أسود', 'أبيض', 'أزرق', 'أحمر', 'بني', 'رمادي', 'ذهبي'],
    sizes: ['39', '40', '41', '42', '43', '44', '45', '46'],
    brands: ['Nike', 'Adidas', 'Zara', 'H&M', 'Steve Madden'],
    stockChance: 0.8,
    imageUrls: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop&fm=webp&q=60',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop&fm=webp&q=60',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop&fm=webp&q=60'
    ],
    productCount: 25
  },

  // Sportswear
  {
    categorySlug: Slugify('ملابس رياضية'),
    names: [
      'ملابس رياضية مريحة',
      'حذاء رياضي مريح',
      'جاكيت رياضي أنيق',
      'بنطلون رياضي مريح',
      'قميص رياضي مريح',
      'حذاء جري مريح',
      'ملابس يوغا مريحة',
      'حذاء كرة قدم مريح'
    ],
    namesEn: [
      'Comfortable Sportswear',
      'Comfortable Sport Shoe',
      'Elegant Sport Jacket',
      'Comfortable Sport Pants',
      'Comfortable Sport Shirt',
      'Comfortable Running Shoe',
      'Comfortable Yoga Clothes',
      'Comfortable Football Shoe'
    ],
    priceRange: { min: 80, max: 500 },
    compareAtPriceRange: { min: 100, max: 600 },
    features: [
      'مريح للتمارين الرياضية',
      'مقاوم للعرق والرطوبة',
      'سهل الغسيل والعناية',
      'تصميم عصري وأنيق',
      'مناسب لجميع أنواع الرياضة',
      'جودة عالية ومتينة'
    ],
    featuresEn: [
      'Comfortable for exercise',
      'Sweat and moisture resistant',
      'Easy washing and care',
      'Modern and elegant design',
      'Suitable for all sports',
      'High quality and durable'
    ],
    materials: ['قطن رياضي', 'ليكرا رياضي', 'بوليستر رياضي'],
    colors: ['أبيض', 'أسود', 'أزرق', 'أحمر', 'أخضر', 'أصفر', 'برتقالي'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    brands: ['Nike', 'Adidas', 'Puma', 'Under Armour', 'Reebok'],
    stockChance: 0.95,
    imageUrls: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1000&fit=crop&fm=webp&q=60',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1000&fit=crop&fm=webp&q=60',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=1000&fit=crop&fm=webp&q=60'
    ],
    productCount: 25
  }
]; 