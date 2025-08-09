'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/icons/Icon';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { navigationItems, type NavigationItem } from '../helpers/navigationMenu';

type NavigationChild = NonNullable<NavigationItem['children']>[0];

interface NavigationMenuProps {
    pendingOrdersCount?: number;
}

export default function NavigationMenu({ pendingOrdersCount = 0 }: NavigationMenuProps) {
    const pathname = usePathname();
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Helper to find the best (deepest) match for the current pathname
    function getBestMatch(items: NavigationItem[], pathname: string): { item: NavigationItem; child?: NavigationChild } | null {
        let best: { item: NavigationItem; child?: NavigationChild } | null = null;
        let bestLength = 0;
        for (const item of items) {
            if (pathname === item.href || pathname.startsWith(item.href)) {
                if (item.href.length > bestLength) {
                    best = { item };
                    bestLength = item.href.length;
                }
            }
            if (item.children) {
                for (const child of item.children) {
                    if (pathname === child.href || pathname.startsWith(child.href)) {
                        if (child.href.length > bestLength) {
                            best = { item, child };
                            bestLength = child.href.length;
                        }
                    }
                }
            }
        }
        return best;
    }

    const bestMatch = getBestMatch(navigationItems, pathname);

    const handleDropdownOpen = (label: string) => {
        setActiveDropdown(label);
    };

    const handleDropdownClose = () => {
        setActiveDropdown(null);
    };

    return (
        <nav className="hidden md:flex items-center space-x-1 space-x-reverse">
            {navigationItems.map((item) => {
                const isItemActive = bestMatch && bestMatch.item === item && !bestMatch.child;
                const hasChildren = item.children && item.children.length > 0;

                if (hasChildren) {
                    return (
                        <DropdownMenu
                            key={item.label}
                            open={activeDropdown === item.label}
                            onOpenChange={(open) => {
                                if (open) {
                                    handleDropdownOpen(item.label);
                                } else {
                                    handleDropdownClose();
                                }
                            }}
                        >
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant={isItemActive ? 'default' : 'ghost'}
                                    className={cn(
                                        'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors',
                                        isItemActive && 'bg-primary text-primary-foreground'
                                    )}
                                >
                                    <Icon name={item.icon} className="h-4 w-4" />
                                    <span>{item.label}</span>
                                    {item.badge && (
                                        <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                                            {item.badge === 'pending'
                                                ? (pendingOrdersCount > 0 ? pendingOrdersCount : '😔')
                                                : item.badge}
                                        </span>
                                    )}
                                    <Icon name="ChevronDown" className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="start"
                                className="w-56 bg-background border shadow-lg"
                                sideOffset={8}
                            >
                                {item.children?.map((child: NavigationChild, index) => {
                                    const isChildActive = bestMatch && bestMatch.item === item && bestMatch.child === child;

                                    // Handle divider
                                    if (child.label === '---') {
                                        return (
                                            <div key={child.key || `divider-${index}`} className="border-t border-border my-1" />
                                        );
                                    }

                                    // Handle section header
                                    if (child.label.startsWith('//')) {
                                        return (
                                            <div key={`header-${child.label}`} className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                {child.label.replace('//', '')}
                                            </div>
                                        );
                                    }

                                    return (
                                        <DropdownMenuItem key={child.href} asChild>
                                            <Link
                                                href={child.href}
                                                className={cn(
                                                    'flex items-center gap-3 px-3 py-2 text-sm transition-colors',
                                                    isChildActive
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'hover:bg-accent hover:text-accent-foreground'
                                                )}
                                            >
                                                <Icon name={child.icon} className="h-4 w-4" />
                                                <span>{child.label}</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                }

                return (
                    <Button
                        key={item.label}
                        variant={isItemActive ? 'default' : 'ghost'}
                        asChild
                        className={cn(
                            'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors',
                            isItemActive && 'bg-primary text-primary-foreground'
                        )}
                    >
                        <Link href={item.href}>
                            <Icon name={item.icon} className="h-4 w-4" />
                            <span>{item.label}</span>
                            {item.badge && (
                                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                                    {item.badge === 'pending' ? pendingOrdersCount : item.badge}
                                </span>
                            )}
                        </Link>
                    </Button>
                );
            })}
        </nav>
    );
} 