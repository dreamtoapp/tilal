import { StaticImageData } from 'next/image';

export type prevState = {
  success: boolean;
  message: string;
};

export interface OrderCartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}


export interface CarouselImage {
  id: string;
  src: string | StaticImageData; // Use 'src' for consistency with next/image
  alt: string;
  width?: number;
  height?: number;
  title?: string;
  description?: string;
  discountValue?: number | null;
  discountType?: string | null;
  linkUrl?: string;
}

export interface ActionError {
  message: string;
  code?: string;
}
