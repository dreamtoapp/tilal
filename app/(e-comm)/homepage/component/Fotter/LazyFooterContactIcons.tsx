'use client';

import { useEffect, useRef, useState } from 'react';
import Link from '@/components/link';
import CustomSvgIcon from './CustomSvgIcon';

interface LazyFooterContactIconsProps {
    email?: string;
    phone?: string;
    address?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
}

export default function LazyFooterContactIcons({
    email,
    phone,
    address,
    facebook,
    instagram,
    twitter,
    linkedin
}: LazyFooterContactIconsProps) {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '50px',
                threshold: 0.1
            }
        );
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        return () => observer.disconnect();
    }, []);

    if (!isVisible) {
        // Show placeholders for all icons
        return (
            <div ref={containerRef} className="space-y-4 md:space-y-6">
                {email && <div className="h-8 w-8 rounded-full bg-primary/10 animate-pulse" />}
                {phone && <div className="h-8 w-8 rounded-full bg-primary/10 animate-pulse" />}
                {address && <div className="h-8 w-8 rounded-full bg-primary/10 animate-pulse" />}
                {(facebook || instagram || twitter || linkedin) && (
                    <div className="pt-4 border-t border-border flex gap-3 flex-wrap">
                        {facebook && <div className="h-10 w-10 rounded-full bg-primary/10 animate-pulse" />}
                        {instagram && <div className="h-10 w-10 rounded-full bg-primary/10 animate-pulse" />}
                        {twitter && <div className="h-10 w-10 rounded-full bg-primary/10 animate-pulse" />}
                        {linkedin && <div className="h-10 w-10 rounded-full bg-primary/10 animate-pulse" />}
                    </div>
                )}
            </div>
        );
    }

    // Render actual icons and links
    return (
        <address ref={containerRef} className="not-italic space-y-4">
            {email && (
                <div className="group flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200 shrink-0">
                        <CustomSvgIcon name="mail" className="h-4 w-4 text-primary" />
                    </div>
                    <a
                        href={`mailto:${email}`}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md truncate"
                        aria-label={`إرسال بريد إلكتروني إلى ${email}`}
                    >
                        {email}
                    </a>
                </div>
            )}
            {phone && (
                <div className="group flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200 shrink-0">
                        <CustomSvgIcon name="phone" className="h-4 w-4 text-primary" />
                    </div>
                    <a
                        href={`tel:${phone}`}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                        aria-label={`الاتصال بالرقم ${phone}`}
                    >
                        {phone}
                    </a>
                </div>
            )}
            {address && (
                <div className="group flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CustomSvgIcon name="map-pin" className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground leading-relaxed">
                        {address}
                    </span>
                </div>
            )}
            {(facebook || instagram || twitter || linkedin) && (
                <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-medium text-foreground mb-3">تابعنا على</h4>
                    <div className="flex gap-3 flex-wrap">
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
                </div>
            )}
        </address>
    );
} 