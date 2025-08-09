'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    Search,
    ExternalLink,
    Calendar,
    User,
    Globe,
    Smartphone,
    AlertOctagon,
    Info,
    XCircle
} from 'lucide-react';

interface ErrorLog {
    id: string;
    errorId: string;
    message: string;
    stack?: string;
    digest?: string;
    url?: string;
    userAgent?: string;
    userId?: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    status: 'NEW' | 'INVESTIGATING' | 'IN_PROGRESS' | 'RESOLVED' | 'IGNORED';
    resolved: boolean;
    createdAt: string;
}

const severityConfig = {
    LOW: {
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: Info
    },
    MEDIUM: {
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: AlertTriangle
    },
    HIGH: {
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: AlertOctagon
    },
    CRITICAL: {
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: XCircle
    }
};

const statusConfig = {
    NEW: {
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        label: 'جديد'
    },
    INVESTIGATING: {
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        label: 'قيد التحقيق'
    },
    IN_PROGRESS: {
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        label: 'قيد المعالجة'
    },
    RESOLVED: {
        color: 'text-green-600',
        bg: 'bg-green-50',
        label: 'تم الحل'
    },
    IGNORED: {
        color: 'text-gray-600',
        bg: 'bg-gray-50',
        label: 'مُتجاهَل'
    }
};

export default function ErrorManagementPage() {
    const [errors, setErrors] = useState<ErrorLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState<string>('ALL');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    useEffect(() => {
        fetchErrors();
    }, []);

    const fetchErrors = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/errors');
            const data = await response.json();

            if (data.success) {
                setErrors(data.errors);
            }
        } catch (error) {
            console.error('Failed to fetch errors:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateErrorStatus = async (errorId: string, status: string) => {
        try {
            const response = await fetch('/api/admin/errors', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ errorId, status })
            });

            if (response.ok) {
                await fetchErrors(); // Refresh the list
            }
        } catch (error) {
            console.error('Failed to update error status:', error);
        }
    };

    const filteredErrors = errors.filter(error => {
        const matchesSearch = error.errorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            error.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSeverity = severityFilter === 'ALL' || error.severity === severityFilter;
        const matchesStatus = statusFilter === 'ALL' || error.status === statusFilter;

        return matchesSearch && matchesSeverity && matchesStatus;
    });

    const stats = {
        total: errors.length,
        critical: errors.filter(e => e.severity === 'CRITICAL').length,
        unresolved: errors.filter(e => !e.resolved).length,
        today: errors.filter(e =>
            new Date(e.createdAt).toDateString() === new Date().toDateString()
        ).length
    };

    if (loading) {
        return (
            <div className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-24" />
                    ))}
                </div>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">إدارة الأخطاء</h1>
                <Button onClick={fetchErrors} variant="outline">
                    تحديث
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">إجمالي الأخطاء</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-gray-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">أخطاء حرجة</p>
                                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                            </div>
                            <XCircle className="h-8 w-8 text-red-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">غير محلولة</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.unresolved}</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">اليوم</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="البحث بمعرف الخطأ أو الرسالة..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <select
                                value={severityFilter}
                                onChange={(e) => setSeverityFilter(e.target.value)}
                                className="px-3 py-2 border rounded-md text-sm"
                            >
                                <option value="ALL">كل المستويات</option>
                                <option value="CRITICAL">حرج</option>
                                <option value="HIGH">عالي</option>
                                <option value="MEDIUM">متوسط</option>
                                <option value="LOW">منخفض</option>
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border rounded-md text-sm"
                            >
                                <option value="ALL">كل الحالات</option>
                                <option value="NEW">جديد</option>
                                <option value="INVESTIGATING">قيد التحقيق</option>
                                <option value="IN_PROGRESS">قيد المعالجة</option>
                                <option value="RESOLVED">تم الحل</option>
                                <option value="IGNORED">مُتجاهَل</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Error List */}
            <div className="space-y-4">
                {filteredErrors.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                لا توجد أخطاء مطابقة للمرشحات
                            </h3>
                            <p className="text-gray-500">
                                جرب تغيير المرشحات أو مصطلح البحث
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredErrors.map((error) => {
                        const SeverityIcon = severityConfig[error.severity].icon;

                        return (
                            <Card key={error.id} className={`border-l-4 ${severityConfig[error.severity].border}`}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${severityConfig[error.severity].bg}`}>
                                                <SeverityIcon className={`h-5 w-5 ${severityConfig[error.severity].color}`} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-semibold">
                                                    {error.errorId}
                                                </CardTitle>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge
                                                        variant="outline"
                                                        className={`${severityConfig[error.severity].color} ${severityConfig[error.severity].bg}`}
                                                    >
                                                        {error.severity}
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className={`${statusConfig[error.status].color} ${statusConfig[error.status].bg}`}
                                                    >
                                                        {statusConfig[error.status].label}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <select
                                                value={error.status}
                                                onChange={(e) => updateErrorStatus(error.id, e.target.value)}
                                                className="px-2 py-1 text-xs border rounded"
                                            >
                                                <option value="NEW">جديد</option>
                                                <option value="INVESTIGATING">قيد التحقيق</option>
                                                <option value="IN_PROGRESS">قيد المعالجة</option>
                                                <option value="RESOLVED">تم الحل</option>
                                                <option value="IGNORED">مُتجاهَل</option>
                                            </select>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <div className="space-y-4">
                                        <Alert>
                                            <AlertTriangle className="h-4 w-4" />
                                            <AlertDescription className="font-medium">
                                                {error.message}
                                            </AlertDescription>
                                        </Alert>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span>{new Date(error.createdAt).toLocaleDateString('ar-SA')}</span>
                                            </div>

                                            {error.userId && (
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-gray-400" />
                                                    <span>{error.userId.slice(0, 8)}...</span>
                                                </div>
                                            )}

                                            {error.url && (
                                                <div className="flex items-center gap-2">
                                                    <Globe className="h-4 w-4 text-gray-400" />
                                                    <a
                                                        href={error.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline truncate"
                                                    >
                                                        {error.url.split('/').pop()}
                                                        <ExternalLink className="h-3 w-3 inline ml-1" />
                                                    </a>
                                                </div>
                                            )}

                                            {error.userAgent && (
                                                <div className="flex items-center gap-2">
                                                    <Smartphone className="h-4 w-4 text-gray-400" />
                                                    <span className="truncate" title={error.userAgent}>
                                                        {error.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {error.stack && (
                                            <details className="mt-4">
                                                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                                                    عرض Stack Trace
                                                </summary>
                                                <pre className="mt-2 text-xs bg-gray-50 p-3 rounded overflow-x-auto border">
                                                    {error.stack}
                                                </pre>
                                            </details>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
} 