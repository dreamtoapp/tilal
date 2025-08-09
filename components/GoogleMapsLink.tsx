'use client';

import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoogleMapsLinkProps {
    latitude: string | number;
    longitude: string | number;
    label?: string;
    className?: string;
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'sm' | 'default' | 'lg';
    showIcon?: boolean;
    showExternalIcon?: boolean;
}

export default function GoogleMapsLink({
    latitude,
    longitude,
    label = 'عرض على الخريطة',
    className = '',
    variant = 'outline',
    size = 'default',
    showIcon = false,
    showExternalIcon = false,
}: GoogleMapsLinkProps) {
    const handleOpenMaps = () => {
        const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
        const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;

        if (isNaN(lat) || isNaN(lng)) {
            console.error('Invalid coordinates:', { latitude, longitude });
            return;
        }

        // Open Google Maps with coordinates
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <Button
            type="button"
            variant={variant}
            size={size}
            onClick={handleOpenMaps}
            className={`flex items-center gap-2 ${className}`}
        >
            {showIcon && <MapPin className="h-4 w-4" />}
            {label}
            {showExternalIcon && <ExternalLink className="h-3 w-3" />}
        </Button>
    );
} 