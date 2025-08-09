'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ProductImage({ src, alt, className = '' }: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src || '/fallback/product-fallback.avif');

  return (
    <div className={`relative h-full w-full ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className='object-cover'
        onError={() => {
          setImgSrc('/fallback/product-fallback.avif');
        }}
      />
    </div>
  );
}
