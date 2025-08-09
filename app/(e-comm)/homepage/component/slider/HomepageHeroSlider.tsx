'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Star,
    ShoppingCart,
    Users,
    ChevronLeft,
    ChevronRight,
    Shield,
    Truck,
    Phone,
    Clock,
    Sparkles,
    TrendingUp
} from 'lucide-react';

interface HeroSlide {
    id: string;
    header?: string;
    subheader?: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    discountPercentage?: number;
    isActive: boolean;
}

interface HomepageHeroSliderProps {
    slides: HeroSlide[];
}

const FALLBACK_SLIDES: HeroSlide[] = [
    {
        id: 'hero-1',
        header: 'اكتشف مجموعتنا الحصرية',
        subheader: 'منتجات عالية الجودة بأفضل الأسعار',
        imageUrl: '/fallback/fallback.avif',
        ctaText: 'تسوق الآن',
        ctaLink: '/categories',
        discountPercentage: 50,
        isActive: true,
    },
];

export default function HomepageHeroSlider({ slides }: HomepageHeroSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const displaySlides = slides && slides.length > 0 ? slides : FALLBACK_SLIDES;

    useEffect(() => {
        if (!isAutoPlaying || displaySlides.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, displaySlides.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
    };

    const currentSlideData = displaySlides[currentSlide];

    return (
        <section className="relative overflow-hidden rounded-2xl shadow-2xl will-change-transform" aria-label="Hero banner">
            {/* Mobile-First Performance-optimized hero container */}
            <div className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
                {/* Optimized background image with preload */}
                <div className="absolute inset-0">
                    <Image
                        src={currentSlideData.imageUrl}
                        alt={currentSlideData.header || 'Hero Slide'}
                        fill
                        className={`object-cover transition-all duration-700 ease-in-out ${isImageLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
                            }`}
                        priority
                        quality={85}
                        sizes="100vw"
                        fetchPriority="high"
                        onLoad={() => setIsImageLoaded(true)}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                    {/* Enhanced gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Enhanced hero content - Mobile First */}
                <div className="relative z-10 flex h-full items-center">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl">
                            {/* Premium badge with animation - Mobile Optimized */}
                            {currentSlideData.discountPercentage && (
                                <Badge className="mb-4 sm:mb-6 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm sm:text-lg px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg animate-pulse">
                                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                    {currentSlideData.discountPercentage}% Discount
                                </Badge>
                            )}

                            {/* Main header from API */}
                            {currentSlideData.header && (
                                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                                    <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                                        {currentSlideData.header}
                                    </span>
                                </h1>
                            )}

                            {/* Subheader from API */}
                            {currentSlideData.subheader && (
                                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-100 mb-4 sm:mb-6 font-medium leading-relaxed">
                                    {currentSlideData.subheader}
                                </h2>
                            )}

                            {/* Enhanced social proof section - Mobile First Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                                    <CardContent className="p-3 sm:p-4 text-center">
                                        <Users className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-blue-400" />
                                        <div className="text-lg sm:text-2xl font-bold">+15K</div>
                                        <div className="text-xs sm:text-sm opacity-90">عميل راضٍ</div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                                    <CardContent className="p-3 sm:p-4 text-center">
                                        <Star className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-yellow-400 fill-current" />
                                        <div className="text-lg sm:text-2xl font-bold">4.9</div>
                                        <div className="text-xs sm:text-sm opacity-90">تقييم العملاء</div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                                    <CardContent className="p-3 sm:p-4 text-center">
                                        <Shield className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-green-400" />
                                        <div className="text-lg sm:text-2xl font-bold">100%</div>
                                        <div className="text-xs sm:text-sm opacity-90">ضمان الجودة</div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                                    <CardContent className="p-3 sm:p-4 text-center">
                                        <Truck className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-purple-400" />
                                        <div className="text-lg sm:text-2xl font-bold">24H</div>
                                        <div className="text-xs sm:text-sm opacity-90">توصيل سريع</div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Enhanced call-to-action buttons - Mobile First */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 sm:px-8 text-base sm:text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl min-h-[48px] w-full sm:w-auto"
                                >
                                    <Link href={currentSlideData.ctaLink} className="flex items-center justify-center gap-2 sm:gap-3">
                                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                                        {currentSlideData.ctaText}
                                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm px-6 py-4 sm:px-8 text-base sm:text-lg font-semibold rounded-full transition-all duration-300 min-h-[48px] w-full sm:w-auto"
                                >
                                    <Link href="/contact" className="flex items-center justify-center gap-2">
                                        <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                                        تواصل معنا
                                    </Link>
                                </Button>
                            </div>

                            {/* Trust indicators - Mobile First */}
                            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 sm:gap-6 text-white/80 text-sm">
                                <div className="flex items-center gap-2 min-h-[32px]">
                                    <Clock className="w-4 h-4" />
                                    <span>دعم 24/7</span>
                                </div>
                                <div className="flex items-center gap-2 min-h-[32px]">
                                    <Shield className="w-4 h-4" />
                                    <span>دفع آمن</span>
                                </div>
                                <div className="flex items-center gap-2 min-h-[32px]">
                                    <Truck className="w-4 h-4" />
                                    <span>شحن مجاني +200 ريال</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced slide navigation - Touch Optimized */}
                {displaySlides.length > 1 && (
                    <>
                        <button
                            onClick={() => goToSlide((currentSlide - 1 + displaySlides.length) % displaySlides.length)}
                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label="الشريحة السابقة"
                        >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </button>

                        <button
                            onClick={() => goToSlide((currentSlide + 1) % displaySlides.length)}
                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label="الشريحة التالية"
                        >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </button>

                        {/* Slide indicators - Touch Optimized */}
                        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                            {displaySlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 min-h-[32px] min-w-[32px] flex items-center justify-center ${index === currentSlide
                                        ? 'bg-white scale-125'
                                        : 'bg-white/50 hover:bg-white/80'
                                        }`}
                                    aria-label={`الانتقال إلى الشريحة ${index + 1}`}
                                >
                                    <span className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-transparent'}`} />
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
} 