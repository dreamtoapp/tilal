'use client';

import { Plus, Users, Package, BarChart3, Zap } from 'lucide-react';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const quickActions = [
    {
        title: 'منتج جديد',
        href: '/dashboard/management-products/new',
        icon: Package,
        color: 'text-green-600',
        bgColor: '',
        shortcut: 'Ctrl+N',
    },
    {
        title: 'عرض جديد',
        href: '/dashboard/management-offer/new',
        icon: Plus,
        color: 'text-blue-600',
        bgColor: '',
        shortcut: 'Ctrl+O',
    },
    {
        title: 'تقرير سريع',
        href: '/dashboard/management-reports',
        icon: BarChart3,
        color: 'text-purple-600',
        bgColor: '',
        shortcut: 'Ctrl+R',
    },
    {
        title: 'إضافة مستخدم',
        href: '/dashboard/management-users/customer',
        icon: Users,
        color: 'text-orange-600',
        bgColor: '',
        shortcut: 'Ctrl+U',
    },
];

const recentPages = [
    { title: 'إدارة المنتجات', href: '/dashboard/management-products', visits: 15 },
    { title: 'الطلبات الجديدة', href: '/dashboard/orders-management', visits: 8 },
    { title: 'تقارير المبيعات', href: '/dashboard/management-reports/sales', visits: 5 },
    { title: 'إعدادات النظام', href: '/dashboard/settings', visits: 3 },
];

export default function QuickActions() {
    return (
        <div className="flex items-center gap-2">
            {/* Quick Actions Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="hover:bg-feature-analytics-soft hover:border-feature-analytics transition-colors duration-200">
                        <Zap className="h-4 w-4 text-blue-600 icon-enhanced" />
                        <span className="hidden md:inline mr-1">إجراءات سريعة</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-2">
                    <DropdownMenuLabel className="text-base font-bold mb-2">
                        الإجراءات السريعة
                    </DropdownMenuLabel>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {quickActions.map((action) => (
                            <Link key={action.href} href={action.href}>
                                <Card className="cursor-pointer card-hover-effect">
                                    <CardContent className="p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <action.icon className={`h-4 w-4 ${action.color} icon-enhanced`} />
                                            <span className="text-sm font-semibold">{action.title}</span>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {action.shortcut}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel className="text-sm font-medium text-muted-foreground mb-2">
                        الصفحات الأخيرة
                    </DropdownMenuLabel>

                    {recentPages.map((page) => (
                        <DropdownMenuItem key={page.href} asChild>
                            <Link href={page.href} className="flex items-center justify-between">
                                <span className="text-sm">{page.title}</span>
                                <Badge variant="secondary" className="text-xs">
                                    {page.visits}
                                </Badge>
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
} 