'use client';

import { useEffect, useRef, useState } from 'react';
import Link from '@/components/link';
import CustomSvgIcon from './CustomSvgIcon';

interface LazyFooterIconsProps {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
}

export default function LazyFooterIcons({
    facebook,
    instagram,
    twitter,
    linkedin
}: LazyFooterIconsProps) {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Only load once
                }
            },
            {
                rootMargin: '50px', // Start loading 50px before the footer is visible
                threshold: 0.1
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Show placeholder until visible
    if (!isVisible) {
        return (
            <div ref={containerRef} className="flex gap-3 flex-wrap">
                {facebook && (
                    <div className="h-10 w-10 rounded-full bg-primary/10 animate-pulse" />
                )}
                {instagram && (
                    <div className="h-10 w-10 rounded-full bg-primary/10 animate-pulse" />
                )}
                {twitter && (
                    <div className="h-10 w-10 rounded-full bg-primary/10 animate-pulse" />
                )}
                {linkedin && (
                    <div className="h-10 w-10 rounded-full bg-primary/10 animate-pulse" />
                )}
            </div>
        );
    }

    // Render actual icons when visible
    return (
        <div ref={containerRef} className="flex gap-3 flex-wrap">
            {facebook && (
                <Link
                    href={facebook}
                    aria-label="تابعنا على فيسبوك (يفتح في نافذة جديدة)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                    <CustomSvgIcon name="facebook" className="h-5 w-5 text-primary" />
                </Link>
            )}
            {instagram && (
                <Link
                    href={instagram}
                    aria-label="تابعنا على انستغرام (يفتح في نافذة جديدة)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                    <CustomSvgIcon name="instagram" className="h-5 w-5 text-primary" />
                </Link>
            )}
            {twitter && (
                <Link
                    href={twitter}
                    aria-label="تابعنا على تويتر (يفتح في نافذة جديدة)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                    <CustomSvgIcon name="twitter" className="h-5 w-5 text-primary" />
                </Link>
            )}
            {linkedin && (
                <Link
                    href={linkedin}
                    aria-label="تابعنا على لينكدإن (يفتح في نافذة جديدة)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                    <CustomSvgIcon name="linkedin" className="h-5 w-5 text-primary" />
                </Link>
            )}
        </div>
    );
} 