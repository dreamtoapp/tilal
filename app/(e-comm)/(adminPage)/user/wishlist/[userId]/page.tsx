import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getWishlistByUserId } from '../actions/wishlistActions';
import ClientWishlistPage from '../components/ClientWishlistPage';

export const metadata = {
    title: 'قائمة المفضلة | المتجر الإلكتروني',
    description: 'عرض وإدارة منتجاتك المفضلة',
};

export default async function WishlistPage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) {
        redirect('/auth/login?redirect=/user/wishlist');
    }
    // TODO: Add permission/auth check to ensure only the owner or authorized users can view
    const wishlistProducts = await getWishlistByUserId(userId);
    return <ClientWishlistPage initialProducts={wishlistProducts} />;
} 