'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, MapPinOff, ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const alertVariants = cva('shadow-lg border-l-8 card-hover-effect', {
    variants: {
        variant: {
            default:
                'border-primary/70 [&>div>div>svg]:text-primary/70',
            destructive:
                'border-destructive [&>div>div>svg]:text-destructive',
            warning:
                'border-yellow-500 [&>div>div>svg]:text-yellow-500',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

const iconMap = {
    default: AlertTriangle,
    destructive: ShieldAlert,
    warning: MapPinOff,
};

interface ActionAlertProps extends VariantProps<typeof alertVariants> {
    title: string;
    description: string;
    buttonText: string;
    onAction: () => void;
    className?: string;
}

export function ActionAlert({
    variant,
    title,
    description,
    buttonText,
    onAction,
    className,
}: ActionAlertProps) {
    const Icon = iconMap[variant || 'default'];

    return (
        <Card className={cn(alertVariants({ variant }), className)}>
            <CardHeader>
                <CardTitle className='flex items-center gap-3 text-xl'>
                    <Icon className='h-6 w-6 icon-enhanced' />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <p className='text-muted-foreground'>{description}</p>
                <Button
                    onClick={onAction}
                    className='btn-action-primary w-full sm:w-auto'
                >
                    {buttonText}
                </Button>
            </CardContent>
        </Card>
    );
} 