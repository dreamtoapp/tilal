import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function LoadingEditProduct() {
    return (
        <div className="container mx-auto py-8" dir="rtl">
            <div className="mb-8">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>

            <div className="space-y-6">
                {/* Basic Info Card */}
                <Card className="shadow-lg border-l-4 border-l-feature-products">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Package className="h-5 w-5 text-feature-products" />
                            معلومات المنتج الأساسية
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>

                {/* Categories Card */}
                <Card className="shadow-lg border-l-4 border-l-feature-products">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Package className="h-5 w-5 text-feature-products" />
                            التصنيفات
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[...Array(8)].map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Settings Card */}
                <Card className="shadow-lg border-l-4 border-l-feature-settings">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Package className="h-5 w-5 text-feature-settings" />
                            الإعدادات
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-6 w-32" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 