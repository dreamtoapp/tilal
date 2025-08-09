import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart } from "lucide-react";

export default function CartPageLoading() {
    return (
        <Card className="shadow-lg border-l-4 border-feature-commerce">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <ShoppingCart className="h-5 w-5 text-feature-commerce" />
                    سلة التسوق
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-md" />
                ))}
                <div className="flex justify-between items-center pt-4 border-t mt-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
        </Card>
    );
} 