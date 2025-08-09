import React from 'react';
import { cn } from '@/lib/utils';

// Dynamic imports for better code splitting and performance
import dynamic from 'next/dynamic';

// Create a map of dynamic imports for better performance
const iconComponents = {
    'map-pin': dynamic(() => import('./MapPinIcon'), { ssr: true }),
    'facebook': dynamic(() => import('./FacebookIcon'), { ssr: true }),
    'twitter': dynamic(() => import('./TwitterIcon'), { ssr: true }),
    'linkedin': dynamic(() => import('./LinkedinIcon'), { ssr: true }),
    'instagram': dynamic(() => import('./InstagramIcon'), { ssr: true }),
    'mail': dynamic(() => import('./MailIcon'), { ssr: true }),
    'phone': dynamic(() => import('./PhoneIcon'), { ssr: true }),
    'whatsapp': dynamic(() => import('./WhatsappIcon'), { ssr: true }),
} as const;

// Type-safe icon names
type IconName = keyof typeof iconComponents;

interface CustomSvgIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
    name: IconName;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

// Size mappings for consistent icon sizing
const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
} as const;

const CustomSvgIcon: React.FC<CustomSvgIconProps> = ({
    name,
    size = 'md',
    className,
    ...props
}) => {
    const IconComponent = iconComponents[name];

    if (!IconComponent) {
        // Fallback for unknown icons with proper accessibility
        return (
            <div
                className={cn(sizeClasses[size], 'bg-muted rounded flex items-center justify-center', className)}
                role="img"
                aria-label={`أيقونة ${name}`}
            >
                <span className="sr-only">أيقونة غير متوفرة</span>
            </div>
        );
    }

    return (
        <IconComponent
            className={cn(sizeClasses[size], className)}
            role="img"
            aria-hidden="true"
            focusable="false"
            {...props}
        />
    );
};

// Memoize the component for better performance
export default React.memo(CustomSvgIcon); 