import {
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import ReviewsTabsWrapper from './ReviewsTabsWrapper';
import ProductDetailsTab from './ProductDetailsTab';
import ReviewsTab from './ReviewsTab';

interface ProductTabsProps {
  product: any;
  reviews: any[];
  session: any;
  mainImage: string;
}

export default function ProductTabs({ product, reviews, session, mainImage }: ProductTabsProps) {
  return (
    <div className='mt-12'>
      <ReviewsTabsWrapper>
        <TabsList className='w-full justify-start'>
          <TabsTrigger value='details'>التفاصيل</TabsTrigger>
          <TabsTrigger value='reviews'>التقييمات ({reviews.length})</TabsTrigger>
        </TabsList>
        <ProductDetailsTab product={product} />
        <ReviewsTab reviews={reviews} session={session} product={product} mainImage={mainImage} />
      </ReviewsTabsWrapper>
    </div>
  );
} 