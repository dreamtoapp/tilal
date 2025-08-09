'use client';

import { useState } from 'react';

import Image from 'next/image';
import { iconVariants } from '@/lib/utils';
import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface ProductImageGalleryProps {
  mainImage: string;
  additionalImages?: string[];
}

export default function ProductImageGallery({
  mainImage,
  additionalImages = [],
}: ProductImageGalleryProps) {
  const allImages = [mainImage, ...additionalImages].filter(Boolean);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePrevious = () => {
    setCurrentImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className='space-y-4 h-full w-full max-h-[400px] max-w-[400px]'>
      <div className='relative aspect-square overflow-hidden rounded-lg bg-muted'>
        <div className='h-full w-full cursor-pointer' onClick={() => setIsFullscreen(true)}>
          <div className='relative h-full w-full max-h-[400px] max-w-[400px]'>
            <Image
              src={allImages[currentImage]}
              alt='صورة المنتج'
              fill
              priority
              className='object-cover object-center'
            />
          </div>
        </div>

        {allImages.length > 1 && (
          <>
            <Button
              variant='ghost'
              size='icon'
              className='absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 shadow-sm'
              onClick={handlePrevious}
            >
              <Icon name="ChevronLeft" size="xs" className={iconVariants({ size: 'xs' })} />
              <span className='sr-only'>السابق</span>
            </Button>

            <Button
              variant='ghost'
              size='icon'
              className='absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 shadow-sm'
              onClick={handleNext}
            >
              <Icon name="ChevronRight" size="xs" className={iconVariants({ size: 'xs' })} />
              <span className='sr-only'>التالي</span>
            </Button>
          </>
        )}

        <Button
          variant='ghost'
          size='icon'
          className='absolute bottom-2 right-2 h-8 w-8 rounded-full bg-background/80 shadow-sm'
          onClick={() => setIsFullscreen(true)}
        >
          <Icon name="Expand" size="xs" />
          {/* <span className='sr-only'>تكبير</span> */}
        </Button>
      </div>

      {allImages.length > 1 && (
        <div className='flex items-center gap-2 overflow-x-auto pb-2'>
          {allImages.map((image, index) => (
            <button
              key={index}
              className={cn(
                'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted',
                currentImage === index && 'ring-2 ring-primary ring-offset-2',
              )}
              onClick={() => setCurrentImage(index)}
            >
              <Image
                src={image}
                alt={`صورة المنتج ${index + 1}`}
                fill
                className='object-cover object-center'
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Image Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className='max-w-screen-lg border-none bg-black/95 p-0'>
          <DialogTitle className='hidden'>صورة المنتج</DialogTitle>
          <div className='relative h-[90vh] w-full'>
            <Image
              src={allImages[currentImage]}
              alt='صورة المنتج'
              fill
              className='object-contain'
            />

            {allImages.length > 1 && (
              <>
                <Button
                  variant='ghost'
                  size='icon'
                  className='absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/20 text-white hover:bg-white/30'
                  onClick={handlePrevious}
                >
                  <Icon name="ChevronLeft" size="md" className={iconVariants({ size: 'md' })} />
                  <span className='sr-only'>السابق</span>
                </Button>

                <Button
                  variant='ghost'
                  size='icon'
                  className='absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/20 text-white hover:bg-white/30'
                  onClick={handleNext}
                >
                  <Icon name="ChevronRight" size="md" className={iconVariants({ size: 'md' })} />
                  <span className='sr-only'>التالي</span>
                </Button>
              </>
            )}

            <DialogClose className='absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30'>
              <Icon name="X" size="xs" className={iconVariants({ size: 'xs' })} />
              <span className='sr-only'>إغلاق</span>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
