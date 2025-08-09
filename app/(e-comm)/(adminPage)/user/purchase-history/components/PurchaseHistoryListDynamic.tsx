'use client';
import dynamic from 'next/dynamic';

const PurchaseHistoryListClient = dynamic(
    () => import('./PurchaseHistoryListClient'),
    { ssr: false }
);

export default function PurchaseHistoryListDynamic({ purchases }: { purchases: any[] }) {
    return <PurchaseHistoryListClient purchases={purchases} />;
} 