'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@/components/icons/Icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ImageCarouselProps {
    images: string[];
    alt: string;
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
    const [index, setIndex] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);

    const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

    const current = images[index] ?? '/fallback/product-fallback.avif';

    const renderImage = (className?: string) => (
        <Image
            src={current}
            alt={alt}
            fill
            priority
            loading="eager"
            className={`object-contain rounded-lg ${className ?? ''}`}
        />
    );

    return (
        <div className="relative w-full aspect-[4/5]">
            {/* Main image */}
            {renderImage()}

            {/* Arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label="الصورة السابقة"
                    >
                        <Icon name="ChevronLeft" size="sm" />
                        <span className="sr-only">الصورة السابقة</span>
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label="الصورة التالية"
                    >
                        <Icon name="ChevronRight" size="sm" />
                        <span className="sr-only">الصورة التالية</span>
                    </button>
                </>
            )}

            {/* Fullscreen */}
            <button
                onClick={() => setFullscreen(true)}
                className="absolute bottom-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="تكبير الصورة"
            >
                <Icon name="Maximize2" size="sm" />
                <span className="sr-only">تكبير</span>
            </button>

            {/* Fullscreen Dialog */}
            <Dialog open={fullscreen} onOpenChange={setFullscreen}>
                <DialogContent className="p-0 bg-transparent shadow-none w-auto max-w-[90vw] max-h-[90vh] flex items-center justify-center">
                    <DialogHeader className="sr-only">
                        <DialogTitle>{alt}</DialogTitle>
                    </DialogHeader>
                    <div className="relative w-auto h-auto max-h-[90vh] max-w-[90vw]">
                        <Image src={current} alt={alt} width={800} height={800} className="object-contain max-h-[90vh] max-w-[90vw]" />
                        <button
                            onClick={() => setFullscreen(false)}
                            className="absolute top-2 right-2 rounded-full bg-white/80 p-1 text-black hover:bg-white"
                            aria-label="إغلاق"
                        >
                            <Icon name="X" size="sm" />
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
} 