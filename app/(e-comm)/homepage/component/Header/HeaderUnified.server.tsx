import NotificationBell from './NotificationBell.server';
import HeaderUnifiedClient from './HeaderUnified';
import WishlistIconServer from './WishlistIconServer';

interface HeaderUnifiedServerProps {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: any;
    } | null;
    logo: string;
    logoAlt?: string;
    unreadCount?: number;
    defaultAlerts?: any[];
    isLoggedIn?: boolean;
}

export default async function HeaderUnifiedServer(props: HeaderUnifiedServerProps) {
    const { user, unreadCount } = props;
    const notificationBell = user ? <NotificationBell userId={user.id} /> : null;
    const wishlistIcon = await WishlistIconServer();
    return (
        <HeaderUnifiedClient
            {...props}
            notificationBell={notificationBell}
            wishlistIcon={wishlistIcon}
            unreadCount={unreadCount}
        />
    );
} 