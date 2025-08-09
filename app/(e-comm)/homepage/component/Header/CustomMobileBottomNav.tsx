import Link from '@/components/link';
import WishlistIconServer from './WishlistIconServer';
import CartButtonWithBadge from '../../../(cart-flow)/cart/cart-controller/CartButtonWithBadge';
import WhatsappMetaButton from './WhatsappMetaButton';
import { Icon } from '@/components/icons/Icon';

export default function CustomMobileBottomNav() {
    return (
        <nav
            className="fixed bottom-3 left-1/2 z-50 flex h-16 w-[95vw] max-w-md -translate-x-1/2 items-center justify-around border bg-background/80 backdrop-blur-md px-2 shadow-xl rounded-2xl md:hidden"
            style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)' }}
            aria-label="Bottom navigation"
        >
            <Link
                href="/bestsellers"
                className="flex flex-col items-center justify-center text-xs group"
                aria-label="Best Sellers"
            >
                <Icon name="Flame" className="w-7 h-7 mb-1 text-orange-400 group-hover:text-orange-500" />
                <span className="sr-only">Best Sellers</span>
            </Link>
            <Link
                href="/categories"
                className="flex flex-col items-center justify-center text-xs group"
                aria-label="Categories"
            >
                <Icon name="Tags" className="w-7 h-7 mb-1 text-muted-foreground group-hover:text-primary" />
                <span className="sr-only">Categories</span>
            </Link>
            <CartButtonWithBadge />
            <WishlistIconServer />
            <WhatsappMetaButton />
        </nav>
    );
} 