// utils/fashionData/suppliers.ts
// Realistic fashion suppliers with Arabic/English support

import { Slugify } from '../slug';

export interface FashionSupplier {
  name: string;
  nameEn: string;
  slug: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  addressEn: string;
  type: string;
  description: string;
  descriptionEn: string;
}

export const FASHION_SUPPLIERS: FashionSupplier[] = [
  {
    name: 'دار الأزياء العربية',
    nameEn: 'Arab Fashion House',
    slug: Slugify('دار الأزياء العربية'),
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
    email: 'info@arabfashionhouse.com',
    phone: '+966-11-234-5678',
    address: 'شارع الملك فهد، الرياض، المملكة العربية السعودية',
    addressEn: 'King Fahd Street, Riyadh, Saudi Arabia',
    type: 'company',
    description: 'دار أزياء عربية رائدة في تصميم وإنتاج الملابس العصرية والأنيقة',
    descriptionEn: 'Leading Arab fashion house specializing in modern and elegant clothing design and production'
  },
  {
    name: 'مجموعة الأزياء العالمية',
    nameEn: 'Global Fashion Group',
    slug: Slugify('مجموعة الأزياء العالمية'),
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
    email: 'contact@globalfashiongroup.com',
    phone: '+966-11-345-6789',
    address: 'شارع التحلية، جدة، المملكة العربية السعودية',
    addressEn: 'Tahlia Street, Jeddah, Saudi Arabia',
    type: 'company',
    description: 'مجموعة أزياء عالمية تقدم أحدث صيحات الموضة العالمية',
    descriptionEn: 'Global fashion group offering the latest international fashion trends'
  },
  {
    name: 'مصنع النسيج المتطور',
    nameEn: 'Advanced Textile Factory',
    slug: Slugify('مصنع النسيج المتطور'),
    logo: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
    email: 'sales@advancedtextile.com',
    phone: '+966-11-456-7890',
    address: 'المنطقة الصناعية، الدمام، المملكة العربية السعودية',
    addressEn: 'Industrial Area, Dammam, Saudi Arabia',
    type: 'manufacturer',
    description: 'مصنع متطور لإنتاج الأقمشة والملابس عالية الجودة',
    descriptionEn: 'Advanced factory for producing high-quality fabrics and clothing'
  },
  {
    name: 'دار التصميم الإبداعي',
    nameEn: 'Creative Design House',
    slug: Slugify('دار التصميم الإبداعي'),
    logo: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
    email: 'design@creativedesign.com',
    phone: '+966-11-567-8901',
    address: 'شارع العليا، الرياض، المملكة العربية السعودية',
    addressEn: 'Olaya Street, Riyadh, Saudi Arabia',
    type: 'designer',
    description: 'دار تصميم إبداعية تقدم تصاميم فريدة ومبتكرة',
    descriptionEn: 'Creative design house offering unique and innovative designs'
  },
  {
    name: 'شركة الأزياء الرياضية',
    nameEn: 'Sportswear Company',
    slug: Slugify('شركة الأزياء الرياضية'),
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    email: 'info@sportswearcompany.com',
    phone: '+966-11-678-9012',
    address: 'شارع الملك عبدالله، الرياض، المملكة العربية السعودية',
    addressEn: 'King Abdullah Street, Riyadh, Saudi Arabia',
    type: 'sportswear',
    description: 'شركة متخصصة في إنتاج الملابس والأحذية الرياضية عالية الجودة',
    descriptionEn: 'Company specialized in producing high-quality sportswear and athletic shoes'
  },
  {
    name: 'مصنع الأحذية الفاخرة',
    nameEn: 'Luxury Shoe Factory',
    slug: Slugify('مصنع الأحذية الفاخرة'),
    logo: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    email: 'orders@luxuryshoes.com',
    phone: '+966-11-789-0123',
    address: 'المنطقة الصناعية الثانية، جدة، المملكة العربية السعودية',
    addressEn: 'Second Industrial Area, Jeddah, Saudi Arabia',
    type: 'manufacturer',
    description: 'مصنع متخصص في إنتاج الأحذية الفاخرة والأنيقة',
    descriptionEn: 'Factory specialized in producing luxury and elegant shoes'
  },
  {
    name: 'دار الإكسسوارات الذهبية',
    nameEn: 'Golden Accessories House',
    slug: Slugify('دار الإكسسوارات الذهبية'),
    logo: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop',
    email: 'accessories@goldenhouse.com',
    phone: '+966-11-890-1234',
    address: 'شارع التحلية، الرياض، المملكة العربية السعودية',
    addressEn: 'Tahlia Street, Riyadh, Saudi Arabia',
    type: 'accessories',
    description: 'دار متخصصة في إنتاج الإكسسوارات الذهبية والفضية الفاخرة',
    descriptionEn: 'House specialized in producing luxury gold and silver accessories'
  },
  {
    name: 'مصنع الحقائب الأنيقة',
    nameEn: 'Elegant Bags Factory',
    slug: Slugify('مصنع الحقائب الأنيقة'),
    logo: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
    email: 'bags@elegantfactory.com',
    phone: '+966-11-901-2345',
    address: 'المنطقة الصناعية الثالثة، الدمام، المملكة العربية السعودية',
    addressEn: 'Third Industrial Area, Dammam, Saudi Arabia',
    type: 'manufacturer',
    description: 'مصنع متخصص في إنتاج الحقائب الأنيقة والفاخرة',
    descriptionEn: 'Factory specialized in producing elegant and luxury bags'
  }
]; 