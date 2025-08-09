'use client';

import { Search, Filter, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Link from '@/components/link';
import { useState } from 'react';

interface ProductFilterFormProps {
    name: string;
    status: string;
    type: string;
    stock: string;
}

export default function ProductFilterForm({ name, status, type, stock }: ProductFilterFormProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Check if any filters are active
    const hasActiveFilters = name || status !== 'all' || type !== 'all' || stock !== 'all';

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
            {/* Collapsible Header */}
            <CollapsibleTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors duration-200 rounded-lg border border-border/50"
                >
                    <div className="flex items-center gap-3">
                        <Filter className="h-5 w-5 text-feature-products icon-enhanced" />
                        <h3 className="text-lg font-semibold text-foreground">تصفية وبحث المنتجات</h3>
                        {hasActiveFilters && (
                            <span className="bg-feature-products text-white text-xs px-2 py-1 rounded-full">
                                مفعل
                            </span>
                        )}
                    </div>
                    {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                    )}
                </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-6 animate-in slide-in-from-top-2 duration-200">
                <form method="GET" className="space-y-6">
                    {/* Search Input */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                            <Search className="h-4 w-4 text-feature-products" />
                            البحث باسم المنتج
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="ادخل اسم المنتج للبحث..."
                            defaultValue={name}
                            className="h-11 transition-all duration-200 focus:border-feature-products focus:ring-feature-products/20"
                        />
                    </div>

                    {/* Filter Dropdowns Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Status Filter */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                                حالة النشر
                            </Label>
                            <select
                                name="status"
                                defaultValue={status}
                                className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm transition-all duration-200 focus:border-feature-products focus:ring-2 focus:ring-feature-products/20 focus:outline-none"
                            >
                                <option value="all">كل الحالات</option>
                                <option value="published">منشور</option>
                                <option value="unpublished">غير منشور</option>
                            </select>
                        </div>

                        {/* Type Filter */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                                نوع المورد
                            </Label>
                            <select
                                name="type"
                                defaultValue={type}
                                className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm transition-all duration-200 focus:border-feature-products focus:ring-2 focus:ring-feature-products/20 focus:outline-none"
                            >
                                <option value="all">كل الأنواع</option>
                                <option value="company">مورد</option>
                                <option value="offer">عرض</option>
                            </select>
                        </div>

                        {/* Stock Filter */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                                حالة المخزون
                            </Label>
                            <select
                                name="stock"
                                defaultValue={stock}
                                className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm transition-all duration-200 focus:border-feature-products focus:ring-2 focus:ring-feature-products/20 focus:outline-none"
                            >
                                <option value="all">كل المخزون</option>
                                <option value="in">متوفر</option>
                                <option value="out">غير متوفر</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/50">
                        <Button
                            type="submit"
                            className="btn-save gap-2 flex-1 sm:flex-initial"
                        >
                            <Filter className="h-4 w-4" />
                            تطبيق التصفية
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            className="btn-cancel-outline gap-2 flex-1 sm:flex-initial"
                        >
                            <Link href="/dashboard/management-products">
                                <RotateCcw className="h-4 w-4" />
                                إعادة تعيين
                            </Link>
                        </Button>
                    </div>
                </form>

                {/* Filter Status Indicator */}
                {hasActiveFilters && (
                    <div className="flex items-center gap-2 text-sm text-feature-products bg-feature-products-soft/10 px-3 py-2 rounded-lg border border-feature-products/20">
                        <Filter className="h-4 w-4" />
                        <span className="font-medium">المرشحات النشطة:</span>
                        <div className="flex gap-1 flex-wrap">
                            {name && <span className="bg-feature-products/10 text-feature-products px-2 py-1 rounded text-xs">البحث: {name}</span>}
                            {status !== 'all' && <span className="bg-feature-products/10 text-feature-products px-2 py-1 rounded text-xs">النشر: {status === 'published' ? 'منشور' : 'غير منشور'}</span>}
                            {type !== 'all' && <span className="bg-feature-products/10 text-feature-products px-2 py-1 rounded text-xs">النوع: {type === 'company' ? 'مورد' : 'عرض'}</span>}
                            {stock !== 'all' && <span className="bg-feature-products/10 text-feature-products px-2 py-1 rounded text-xs">المخزون: {stock === 'in' ? 'متوفر' : 'غير متوفر'}</span>}
                        </div>
                    </div>
                )}
            </CollapsibleContent>
        </Collapsible>
    );
} 