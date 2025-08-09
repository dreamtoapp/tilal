'use client';
import PurchaseHistoryList from './PurchaseHistoryList';

export default function PurchaseHistoryListClient({ purchases }: { purchases: any[] }) {
    return <PurchaseHistoryList purchases={purchases} />;
} 