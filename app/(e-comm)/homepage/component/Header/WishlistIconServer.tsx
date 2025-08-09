import { auth } from '@/auth';
import { Icon } from '@/components/icons/Icon';
import Link from '@/components/link';
import db from '@/lib/prisma';

export default async function WishlistIconServer() {
    const session = await auth();
    const isLoggedIn = !!session?.user?.id;
    let count = 0;
    if (isLoggedIn) {
        count = await db.wishlistItem.count({ where: { userId: session.user.id } });
    }

    if (!isLoggedIn) {
        return (
            <Link href={`/auth/login?redirect=/user/wishlist`} className="w-12 h-12 flex items-center justify-center p-2 relative">
                <Icon name="Heart" className="h-7 w-7 text-foreground" />
            </Link>
        );
    }

    return (
        <Link href={`/user/wishlist/${session.user.id}`} className="w-12 h-12 flex items-center justify-center p-2 relative">
            <Icon name="Heart" className="h-7 w-7 text-foreground" />
            {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-feature-users text-xs font-semibold text-white shadow-md">
                    {count > 99 ? "99+" : count}
                </span>
            )}
        </Link>
    );
} 