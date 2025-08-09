'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/icons/Icon';
import { menuGroups } from '../helpers/mainMenu';

interface BreadcrumbItem {
    label: string;
    href: string;
    icon?: string | React.ComponentType<{ className?: string }>;
    isActive?: boolean;
}

function normalizePath(path: string): string {
    return path.replace(/\/$/, '');
}

export default function EnhancedBreadcrumb() {
    const pathname = usePathname();

    // Find current menu item and build breadcrumb
    const buildBreadcrumb = (): BreadcrumbItem[] => {
        const breadcrumbs: BreadcrumbItem[] = [
            {
                label: 'الرئيسية',
                href: '/dashboard',
                icon: 'Home',
            },
        ];

        // Find the current item in menu groups
        let currentItem = null;

        for (const group of menuGroups) {
            for (const item of group.items) {
                if (normalizePath(item.url) === normalizePath(pathname)) {
                    currentItem = item;
                    break;
                }
            }
            if (currentItem) break;
        }

        // Add current page if not dashboard
        if (currentItem && normalizePath(pathname) !== '/dashboard') {
            breadcrumbs.push({
                label: currentItem.title,
                href: pathname,
                icon: currentItem.icon,
                isActive: true,
            });
        }

        return breadcrumbs;
    };

    const breadcrumbs = buildBreadcrumb();

    return (
        <div className="flex items-center justify-between w-full">
            {/* Left Side - Breadcrumb Navigation */}
            <nav className="flex items-center space-x-1 space-x-reverse" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2">
                    {breadcrumbs.map((item, index) => (
                        <li key={item.href} className="flex items-center">
                            {index > 0 && (
                                <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground rotate-180" />
                            )}
                            <Link
                                href={item.href}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${item.isActive
                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }`}
                                aria-current={item.isActive ? 'page' : undefined}
                            >
                                {item.icon && (
                                    typeof item.icon === 'string' ? (
                                        <Icon name={item.icon} className="h-4 w-4" />
                                    ) : (
                                        <item.icon className="h-4 w-4" />
                                    )
                                )}
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ol>
            </nav>

            {/* Right Side - Page Actions */}
            <div className="flex items-center gap-2">
                {/* Quick Page Info */}
                <div className="hidden lg:flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <span>آخر زيارة:</span>
                        <Badge variant="outline" className="text-xs">
                            منذ 5 دقائق
                        </Badge>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-1">
                        <span>المستوى:</span>
                        <Badge
                            variant="outline"
                            className={`text-xs ${breadcrumbs.length === 1 ? 'border-feature-analytics text-feature-analytics' :
                                breadcrumbs.length === 2 ? 'border-feature-users text-feature-users' :
                                    'border-feature-products text-feature-products'
                                }`}
                        >
                            {breadcrumbs.length === 1 ? 'رئيسي' :
                                breadcrumbs.length === 2 ? 'قسم' : 'صفحة فرعية'}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
} 