'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Offer } from '../actions/get-offers';
import { toggleOfferStatus } from '../actions/toggle-status';

interface ToggleOfferStatusProps {
    offer: Offer;
}

export function ToggleOfferStatus({ offer }: ToggleOfferStatusProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        setIsLoading(true);
        try {
            await toggleOfferStatus(offer.id);
        } catch (error) {
            console.error('Error toggling offer status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleToggle}
            disabled={isLoading}
            className={offer.isActive ? 'btn-cancel-outline' : 'btn-add'}
        >
            {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
            ) : offer.isActive ? (
                <EyeOff size={14} />
            ) : (
                <Eye size={14} />
            )}
        </Button>
    );
} 