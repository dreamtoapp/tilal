"use client"
import { Button, ButtonProps } from '../../../../../components/ui/button';
import * as React from 'react';
import CustomSvgIcon from '../Fotter/CustomSvgIcon';

interface WhatsappMetaButtonProps extends Omit<ButtonProps, 'onClick'> {
    phone?: string; // Optional: allow custom phone number
    defaultMessage?: string;
}

const WhatsappMetaButton: React.FC<WhatsappMetaButtonProps> = ({ phone = '', defaultMessage = '' }) => {
    // Compose WhatsApp URL
    const handleClick = () => {
        const base = phone ? `https://wa.me/${phone}` : 'https://wa.me/';
        const url = `${base}?text=${encodeURIComponent(defaultMessage)}`;
        window.open(url, '_blank');
    };

    return (
        <Button
            className=" flex items-center justify-center  border"
            size="icon"
            variant="ghost"
            aria-label="تواصل عبر واتساب"
            onClick={handleClick}
        >
            <CustomSvgIcon name="whatsapp" size="md" />
        </Button>
    );
};

export default WhatsappMetaButton; 