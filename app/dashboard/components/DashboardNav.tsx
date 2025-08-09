'use client';

import Link from 'next/link';
import { Icon } from '@/components/icons/Icon';
import { Badge } from '@/components/ui/badge';
import NavigationMenu from './NavigationMenu';
import MobileNavigation from './MobileNavigation';
import DashboardClientHeader from '../management-dashboard/components/DashboardClientHeader';

interface DashboardNavProps {
    pendingOrdersCount?: number;
}

export default function DashboardNav({ pendingOrdersCount = 0 }: DashboardNavProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 shadow-sm">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center gap-4 md:gap-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Icon name="Store" className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    <span className="text-base md:text-lg font-bold">متجر</span>
                    <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                        Admin
                    </Badge>
                </Link>

                {/* Desktop Navigation Menu */}
                <NavigationMenu pendingOrdersCount={pendingOrdersCount} />

                {/* Mobile Navigation */}
                <MobileNavigation pendingOrdersCount={pendingOrdersCount} />
            </div>

            {/* Right side - User Menu and Notifications */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* User Menu and Notifications */}
                <DashboardClientHeader />
            </div>
        </header>
    );
} 