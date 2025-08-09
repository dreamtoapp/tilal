"use client";
import Logo from './Logo';
import SearchBar from './SearchBar';
import UserMenuTrigger from './UserMenuTrigger';
import UniversalBurgerMenu from './UniversalBurgerMenu';
import CartIconClient from '../../../(cart-flow)/cart/cart-controller/CartButtonWithBadge';
import { useMediaQuery } from '@/hooks/use-media-query';
import { UserRole } from '@/constant/enums';
import Link from '@/components/link';
import { ReactNode } from 'react';
import { CarFront, Focus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import NotificationBellClient from '@/components/NotificationBellClient';


interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: UserRole;
}

interface HeaderUnifiedProps {
    logo: string;
    logoAlt?: string;
    user: User | null;
    isLoggedIn?: boolean;
    notificationBell?: ReactNode;
    wishlistIcon?: ReactNode;
    unreadCount?: number;
}

function UserMenuOrLogin({ isLoggedIn, user }: { isLoggedIn: boolean; user: User | null }) {
    return isLoggedIn ? (
        <UserMenuTrigger user={user} />
    ) : (
        <Link href="/auth/login" className={buttonVariants({ variant: "default", size: "sm" })}>تسجيل الدخول</Link>
    );
}

function DesktopHeader({ logo, logoAlt, isLoggedIn, user, notificationBell, wishlistIcon, unreadCount }: {
    logo: string;
    logoAlt: string;
    isLoggedIn: boolean;
    user: User | null;
    notificationBell?: ReactNode;
    wishlistIcon?: ReactNode;
    unreadCount?: number;
}) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-md border-b border-border/30 shadow-sm transition-all duration-300">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                {/* Left side: Logo + Burger Menu */}
                <div className="flex items-center gap-4">
                    <Logo logo={logo} logoAlt={logoAlt} />
                    <UniversalBurgerMenu />
                </div>

                {/* Right side: Actions */}
                <div className="flex items-center gap-2 bg-muted/20 rounded-xl px-3 py-2 border border-border/20">
                    {user?.role === UserRole.ADMIN && (
                        <Link href="/dashboard" className="p-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors">
                            <Focus size={16} />
                        </Link>
                    )}
                    {user?.role === UserRole.DRIVER && (
                        <Link href="/driver" className="p-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                            <CarFront size={16} />
                        </Link>
                    )}

                    <SearchBar />
                    {wishlistIcon}
                    <CartIconClient />
                    {/* Use reactive notification bell for logged-in users */}
                    {isLoggedIn ? (
                        <NotificationBellClient
                            initialCount={unreadCount || 0}
                            showWarning={false}
                        />
                    ) : notificationBell}
                    <UserMenuOrLogin isLoggedIn={isLoggedIn} user={user} />
                </div>
            </nav>
        </header>
    );
}

function MobileHeader({ logo, logoAlt, isLoggedIn, user, notificationBell, unreadCount }: {
    logo: string;
    logoAlt: string;
    isLoggedIn: boolean;
    user: User | null;
    notificationBell?: ReactNode;
    unreadCount?: number;
}) {
    return (
        <header className="fixed top-0 left-0 right-0 w-full z-50 bg-background/98 backdrop-blur-md border-b border-border/30 shadow-sm">
            <nav className="flex h-14 items-center justify-between px-4 sm:px-6">
                {/* Left side: Logo + Burger Menu */}
                <div className="flex items-center gap-3">
                    <Logo logo={logo} logoAlt={logoAlt} />
                    <UniversalBurgerMenu />
                </div>

                {/* Right side: Actions */}
                <div className="flex items-center gap-1.5 bg-muted/20 rounded-lg px-2 py-1.5 border border-border/20">
                    {user?.role === UserRole.ADMIN && (
                        <Link href="/dashboard" className="p-1.5 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors">
                            <Focus size={14} />
                        </Link>
                    )}
                    {user?.role === UserRole.DRIVER && (
                        <Link href="/driver" className="p-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                            <CarFront size={14} />
                        </Link>
                    )}
                    <SearchBar />
                    {/* Use reactive notification bell for logged-in users */}
                    {isLoggedIn ? (
                        <NotificationBellClient
                            initialCount={unreadCount || 0}
                            showWarning={false}
                        />
                    ) : notificationBell}
                    <UserMenuOrLogin isLoggedIn={isLoggedIn} user={user} />
                </div>
            </nav>
        </header>
    );
}

export default function HeaderUnified({
    user,
    logo,
    logoAlt = 'Logo',
    isLoggedIn = false,
    notificationBell,
    wishlistIcon,
    unreadCount,
}: HeaderUnifiedProps & { wishlistIcon?: ReactNode }) {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    return isDesktop ? (
        <DesktopHeader
            logo={logo}
            logoAlt={logoAlt}
            isLoggedIn={isLoggedIn}
            user={user}
            notificationBell={notificationBell}
            wishlistIcon={wishlistIcon}
            unreadCount={unreadCount}
        />
    ) : (
        <MobileHeader
            logo={logo}
            logoAlt={logoAlt}
            isLoggedIn={isLoggedIn}
            user={user}
            notificationBell={notificationBell}
            unreadCount={unreadCount}
        />
    );
} 