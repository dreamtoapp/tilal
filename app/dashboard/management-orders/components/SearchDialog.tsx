'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

import { useSearch } from './SearchContext';
import { Order } from '@/types/databaseTypes';

interface SearchDialogProps {
    totalOrders: number;
    orders: Order[];
}

export default function SearchDialog({
    totalOrders,
    orders
}: SearchDialogProps) {
    const { searchTerm, setSearchTerm, clearSearch } = useSearch();
    const [isOpen, setIsOpen] = useState(false);
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    // Calculate filtered orders count
    const filteredOrdersCount = useMemo(() => {
        if (!searchTerm.trim()) return totalOrders;

        return orders.filter(order =>
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.phone?.includes(searchTerm) ||
            order.amount.toString().includes(searchTerm)
        ).length;
    }, [searchTerm, orders, totalOrders]);

    // Sync local search term with context
    useEffect(() => {
        setLocalSearchTerm(searchTerm);
    }, [searchTerm]);

    const handleSearch = () => {
        setSearchTerm(localSearchTerm);
        setIsOpen(false);
    };

    const handleClear = () => {
        setLocalSearchTerm('');
        clearSearch();
        setIsOpen(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Search className="h-4 w-4" />
                    البحث في الطلبات
                    {searchTerm && (
                        <Badge variant="secondary" className="ml-1">
                            {filteredOrdersCount}
                        </Badge>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5 text-feature-commerce" />
                        البحث في الطلبات
                    </DialogTitle>
                    <DialogDescription>
                        ابحث في الطلبات برقم الطلب، اسم العميل، رقم الهاتف، أو المبلغ
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="أدخل كلمة البحث..."
                            value={localSearchTerm}
                            onChange={(e) => setLocalSearchTerm(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="pr-10"
                            autoFocus
                        />
                    </div>

                    {/* Search Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                            {searchTerm
                                ? `${filteredOrdersCount} من ${totalOrders} طلب يطابق البحث`
                                : `${totalOrders} طلب متاح`
                            }
                        </span>
                        {searchTerm && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClear}
                                className="h-auto p-1 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Search Examples */}
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">أمثلة على البحث:</p>
                        <div className="flex flex-wrap gap-2">
                            {['ORD-000014', 'امواج', '253', 'PENDING'].map((example) => (
                                <Button
                                    key={example}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setLocalSearchTerm(example)}
                                    className="text-xs h-7"
                                >
                                    {example}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            onClick={handleSearch}
                            className="flex-1"
                            disabled={!localSearchTerm.trim()}
                        >
                            <Search className="h-4 w-4 mr-2" />
                            بحث
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                        >
                            إلغاء
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 