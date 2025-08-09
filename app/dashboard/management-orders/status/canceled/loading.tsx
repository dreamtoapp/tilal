import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export default function CanceledOrdersLoading() {
    return (
        <div className="font-cairo space-y-6 p-6 animate-pulse" dir="rtl">
            {/* Header Skeleton */}
            <Card className="border-feature-commerce shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-24 rounded-lg" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-7 w-48" />
                        </div>
                        <Skeleton className="h-6 w-28 rounded-full" />
                    </div>
                </CardHeader>
            </Card>

            {/* View/Controls Skeleton */}
            <div className="space-y-4">
                {/* Analytics cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-4 w-32 mt-1" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-4 w-32 mt-1" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-4 w-32 mt-1" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-4 w-32 mt-1" />
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
                        <Skeleton className="h-9 w-full md:w-64" />
                        <Skeleton className="h-9 w-full md:w-48" />
                        <Skeleton className="h-9 w-full md:w-48" />
                        <Skeleton className="h-9 w-full md:w-24" />
                    </CardContent>
                </Card>

                {/* Table Skeleton */}
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <div className="overflow-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="p-2"><Skeleton className="h-5 w-20" /></th>
                                        <th className="p-2"><Skeleton className="h-5 w-32" /></th>
                                        <th className="p-2"><Skeleton className="h-5 w-24" /></th>
                                        <th className="p-2"><Skeleton className="h-5 w-24" /></th>
                                        <th className="p-2"><Skeleton className="h-5 w-16" /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(5)].map((_, i) => (
                                        <tr key={i} className="border-b">
                                            <td className="p-4"><Skeleton className="h-5 w-20" /></td>
                                            <td className="p-4"><Skeleton className="h-5 w-32" /></td>
                                            <td className="p-4"><Skeleton className="h-5 w-24" /></td>
                                            <td className="p-4"><Skeleton className="h-5 w-24" /></td>
                                            <td className="p-4 flex justify-end gap-2">
                                                <Skeleton className="h-8 w-8" />
                                                <Skeleton className="h-8 w-8" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-8 w-24" />
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 