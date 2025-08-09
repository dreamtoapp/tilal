'use client';

import { Separator } from '@/components/ui/separator';
import EnhancedBreadcrumb from '../management-dashboard/components/EnhancedBreadcrumb';

interface PageHeaderProps {
    title?: string;
    description?: string;
    actions?: React.ReactNode;
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {

    return (
        <div className="flex flex-col gap-4 pb-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <EnhancedBreadcrumb />
            </div>

            {/* Page Title and Actions */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    {title && (
                        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    )}
                    {description && (
                        <p className="text-muted-foreground">{description}</p>
                    )}
                </div>

                {actions && (
                    <div className="flex items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>

            <Separator />
        </div>
    );
} 