import { Button } from '@/components/ui/button';
import WhatsappIcon from '@/app/(e-comm)/homepage/component/Fotter/WhatsappIcon';
import React from 'react';

interface WhatsappShareButtonProps {
    message: string;
    label?: string;
    size?: 'icon' | 'default';
}

const WhatsappShareButton: React.FC<WhatsappShareButtonProps> = ({ message, label, size = 'icon' }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encoded}`, '_blank', 'noopener,noreferrer');
    };
    return (
        <Button
            type='button'
            variant={size === 'icon' ? 'secondary' : 'default'}
            size={size}
            className='flex items-center justify-center'
            onClick={handleClick}
        >
            <WhatsappIcon width={size === 'icon' ? 20 : 24} height={size === 'icon' ? 20 : 24} />
            {label && <span className='ml-2'>{label}</span>}
        </Button>
    );
};

export default WhatsappShareButton; 