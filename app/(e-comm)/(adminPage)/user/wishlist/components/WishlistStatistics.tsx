import { Heart, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function WishlistStatistics({ products }: { products: any[] }) {
    const totalProducts = products.length;
    const inStockProducts = products.filter(product => product.inStock).length;
    const outOfStockProducts = totalProducts - inStockProducts;

    // Original order: Out of Stock, Available, Total Products
    const stats = [
        {
            label: "غير متوفر",
            value: outOfStockProducts,
            icon: <XCircle className="w-5 h-5" />,
            color: "text-feature-suppliers",
            bgColor: "bg-feature-suppliers/10",
            borderColor: "border-feature-suppliers/20"
        },
        {
            label: "متوفر",
            value: inStockProducts,
            icon: <CheckCircle className="w-5 h-5" />,
            color: "text-feature-commerce",
            bgColor: "bg-feature-commerce/10",
            borderColor: "border-feature-commerce/20"
        },
        {
            label: "إجمالي المنتجات",
            value: totalProducts,
            icon: <Heart className="w-5 h-5" />,
            color: "text-feature-products",
            bgColor: "bg-feature-products/10",
            borderColor: "border-feature-products/20"
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
                <Card key={index} className={`border-l-4 ${stat.borderColor} hover:shadow-md transition-all duration-300 card-hover-effect`}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>{stat.icon}</div>
                            <div className="flex-1">
                                <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
} 