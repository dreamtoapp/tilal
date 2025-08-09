'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import Image from 'next/image';
import { Star, Calendar, Package, ExternalLink, Truck, Smartphone, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from '@/components/link';
import RatingDisplay from './RatingDisplay';
import ProductRatingDialog from './ProductRatingDialog';
import DriverRatingDialog from './DriverRatingDialog';
import AppRatingDialog from './AppRatingDialog';

interface RatingsClientProps {
    productReviews: any[];
    driverRatings: any[];
    appRatings: any[];
}

// Enhanced Statistics Component for all rating types
function UnifiedRatingsStatistics({ productReviews, driverRatings, appRatings }: {
    productReviews: any[],
    driverRatings: any[],
    appRatings: any[]
}) {
    const totalRatings = productReviews.length + driverRatings.length + appRatings.length;

    const allRatings = [
        ...productReviews.map(r => r.rating),
        ...driverRatings.map(r => r.rating),
        ...appRatings.map(r => r.rating)
    ];

    const averageRating = totalRatings > 0
        ? (allRatings.reduce((sum, rating) => sum + rating, 0) / totalRatings).toFixed(1)
        : '0.0';

    const stats = [
        {
            label: "تقييمات المنتجات",
            value: productReviews.length,
            icon: <Package className="w-5 h-5" />,
            color: "text-feature-commerce",
            bgColor: "bg-feature-commerce/10",
            borderColor: "border-feature-commerce/20"
        },
        {
            label: "تقييمات السائقين",
            value: driverRatings.length,
            icon: <Truck className="w-5 h-5" />,
            color: "text-feature-suppliers",
            bgColor: "bg-feature-suppliers/10",
            borderColor: "border-feature-suppliers/20"
        },
        {
            label: "تقييمات المتجر",
            value: appRatings.length,
            icon: <Smartphone className="w-5 h-5" />,
            color: "text-feature-analytics",
            bgColor: "bg-feature-analytics/10",
            borderColor: "border-feature-analytics/20"
        },
        {
            label: "المتوسط العام",
            value: averageRating,
            icon: <Star className="w-5 h-5" />,
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
                            <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div className="flex-1">
                                <div className={`text-2xl font-bold ${stat.color}`}>
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// Product Review Card (moved from server component)
function ProductReviewCard({ review, index }: { review: any; index: number }) {
    const isRecent = () => {
        const reviewDate = new Date(review.createdAt);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return reviewDate >= sevenDaysAgo;
    };

    return (
        <Card
            className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-feature-commerce/30 card-hover-effect group"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Product Image */}
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-border shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <Image
                            src={review.product?.imageUrl || '/fallback/product-fallback.avif'}
                            alt={review.product?.name || 'منتج'}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {isRecent() && (
                            <div className="absolute top-2 right-2 bg-feature-products text-white text-xs px-2 py-1 rounded-full shadow-sm">
                                جديد
                            </div>
                        )}
                    </div>

                    {/* Review Content */}
                    <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg hover:text-feature-analytics transition-colors duration-200">
                                    <Link
                                        href={`/product/${review.product?.slug || review.productId}`}
                                        className="flex items-center gap-2 group/link"
                                    >
                                        {review.product?.name || 'منتج غير متوفر'}
                                        <ExternalLink className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200" />
                                    </Link>
                                </h3>
                                {review.product?.price && (
                                    <div className="text-sm text-muted-foreground">
                                        السعر: {review.product.price.toLocaleString('ar-SA')} ر.س
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(review.createdAt), 'd MMMM yyyy', { locale: ar })}
                            </div>
                        </div>

                        {/* Rating and Badges */}
                        <div className="flex flex-wrap items-center gap-3">
                            <RatingDisplay rating={review.rating} showCount={false} size="sm" />
                            <Badge
                                variant='outline'
                                className={
                                    review.isVerified
                                        ? 'border-feature-commerce/30 bg-feature-commerce/10 text-feature-commerce'
                                        : 'border-feature-suppliers/30 bg-feature-suppliers/10 text-feature-suppliers'
                                }
                            >
                                {review.isVerified ? 'مشتري مؤكد' : 'غير مؤكد'}
                            </Badge>
                            {isRecent() && (
                                <Badge variant="secondary" className="bg-feature-products/10 text-feature-products border-feature-products/20">
                                    مراجعة حديثة
                                </Badge>
                            )}
                        </div>

                        {/* Comment */}
                        {review.comment && (
                            <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                                <p className="text-sm leading-relaxed">{review.comment}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            <Button
                                variant='outline'
                                size='sm'
                                className='border-feature-analytics/20 text-feature-analytics hover:bg-feature-analytics/10 btn-view-outline'
                                asChild
                            >
                                <Link href={`/product/${review.product?.slug || review.productId}`}>
                                    <Package className="w-4 h-4 mr-2" />
                                    عرض المنتج
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Driver Rating Card (moved from server component)
function DriverRatingCard({ rating, index }: { rating: any; index: number }) {
    return (
        <Card
            className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-feature-suppliers/30 card-hover-effect group"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Driver Avatar */}
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-border shadow-sm group-hover:shadow-md transition-shadow duration-300 bg-feature-suppliers/10 flex items-center justify-center">
                        <Truck className="w-10 h-10 text-feature-suppliers" />
                    </div>

                    {/* Rating Content */}
                    <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg text-foreground">
                                    السائق: {rating.driverName}
                                </h3>
                                <div className="text-sm text-muted-foreground">
                                    رقم الطلب: {rating.orderId} • زمن التوصيل: {rating.deliveryTime}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    قيمة الطلب: {rating.orderTotal.toLocaleString('ar-SA')} ر.س
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(rating.createdAt), 'd MMMM yyyy', { locale: ar })}
                            </div>
                        </div>

                        {/* Rating and Badges */}
                        <div className="flex flex-wrap items-center gap-3">
                            <RatingDisplay rating={rating.rating} showCount={false} size="sm" />
                            <Badge variant='outline' className='border-feature-suppliers/30 bg-feature-suppliers/10 text-feature-suppliers'>
                                تقييم توصيل
                            </Badge>
                        </div>

                        {/* Comment */}
                        {rating.comment && (
                            <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                                <p className="text-sm leading-relaxed">{rating.comment}</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// App Rating Card (moved from server component)
function AppRatingCard({ rating, index }: { rating: any; index: number }) {
    return (
        <Card
            className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-feature-analytics/30 card-hover-effect group"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* App Icon */}
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-border shadow-sm group-hover:shadow-md transition-shadow duration-300 bg-feature-analytics/10 flex items-center justify-center">
                        <Smartphone className="w-10 h-10 text-feature-analytics" />
                    </div>

                    {/* Rating Content */}
                    <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg text-foreground">
                                    تقييم التطبيق
                                </h3>
                                <div className="text-sm text-muted-foreground">
                                    رقم الطلب: {rating.orderId} • {rating.feature}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(rating.createdAt), 'd MMMM yyyy', { locale: ar })}
                            </div>
                        </div>

                        {/* Rating and Badges */}
                        <div className="flex flex-wrap items-center gap-3">
                            <RatingDisplay rating={rating.rating} showCount={false} size="sm" />
                            <Badge variant='outline' className='border-feature-analytics/30 bg-feature-analytics/10 text-feature-analytics'>
                                تقييم تطبيق
                            </Badge>
                        </div>

                        {/* Comment */}
                        {rating.comment && (
                            <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                                <p className="text-sm leading-relaxed">{rating.comment}</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Empty State Component (moved from server component)
function EmptyState({ type }: { type: string }) {
    const contentMap = {
        products: {
            icon: <Package className="w-12 h-12 text-feature-commerce" />,
            title: "لا توجد تقييمات منتجات",
            description: "لم تقم بتقييم أي منتجات بعد. يمكنك تقييم المنتجات بعد الشراء.",
            actionText: "تصفح المنتجات",
            actionHref: "/",
            bgColor: "bg-feature-commerce/10"
        },
        drivers: {
            icon: <Truck className="w-12 h-12 text-feature-suppliers" />,
            title: "لا توجد تقييمات سائقين",
            description: "لم تقم بتقييم أي سائق بعد. يمكنك تقييم السائقين بعد التوصيل.",
            actionText: "سجل الطلبات",
            actionHref: "/user/purchase-history",
            bgColor: "bg-feature-suppliers/10"
        },
        app: {
            icon: <Smartphone className="w-12 h-12 text-feature-analytics" />,
            title: "لا توجد تقييمات للمتجر",
            description: "لم تقم بتقييم المتجر بعد. شاركنا رأيك في تجربة التسوق.",
            actionText: "أضف تقييم",
            actionHref: "#",
            bgColor: "bg-feature-analytics/10"
        }
    };

    const content = contentMap[type as keyof typeof contentMap] || contentMap.products;

    return (
        <Card className="border-dashed border-2 border-border/50">
            <CardContent className="py-16 text-center">
                <div className={`mx-auto mb-6 p-6 ${content.bgColor} rounded-full w-fit`}>
                    {content.icon}
                </div>
                <h2 className="text-xl font-semibold mb-4">{content.title}</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                    {content.description}
                </p>
                <Button asChild className="btn-add">
                    <Link href={content.actionHref}>
                        <Plus className="w-4 h-4 mr-2" />
                        {content.actionText}
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}

export default function RatingsClient({
    productReviews,
    driverRatings,
    appRatings
}: RatingsClientProps) {
    const [productDialogOpen, setProductDialogOpen] = useState(false);
    const [driverDialogOpen, setDriverDialogOpen] = useState(false);
    const [appDialogOpen, setAppDialogOpen] = useState(false);

    const handleAddRating = (type: 'product' | 'driver' | 'app') => {
        switch (type) {
            case 'product':
                setProductDialogOpen(true);
                break;
            case 'driver':
                setDriverDialogOpen(true);
                break;
            case 'app':
                setAppDialogOpen(true);
                break;
        }
    };

    return (
        <div className='container mx-auto max-w-6xl py-8 px-4'>
            {/* Enhanced Header */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-feature-analytics/10 border border-feature-analytics/20">
                            <Star className="w-8 h-8 text-feature-analytics" />
                        </div>
                        <div>
                            <h1 className='text-3xl lg:text-4xl font-bold text-foreground'>جميع تقييماتي</h1>
                            <p className="text-muted-foreground mt-1">إدارة وعرض تقييماتك للمنتجات والسائقين والمتجر</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-feature-analytics/10 text-feature-analytics border-feature-analytics/20">
                            {productReviews.length + driverRatings.length + appRatings.length} تقييم إجمالي
                        </Badge>
                    </div>
                </div>

                {/* Unified Statistics */}
                <UnifiedRatingsStatistics
                    productReviews={productReviews}
                    driverRatings={driverRatings}
                    appRatings={appRatings}
                />
            </div>
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">الكل</TabsTrigger>
                    <TabsTrigger value="products">المنتجات</TabsTrigger>
                    <TabsTrigger value="drivers">السائقين</TabsTrigger>
                    <TabsTrigger value="app">المتجر</TabsTrigger>
                </TabsList>

                {/* All Ratings Tab */}
                <TabsContent value="all" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">جميع التقييمات ({productReviews.length + driverRatings.length + appRatings.length})</h2>
                        <div className="text-sm text-muted-foreground">
                            استخدم التبويبات المحددة لإضافة تقييمات جديدة
                        </div>
                    </div>

                    <UnifiedRatingsStatistics
                        productReviews={productReviews}
                        driverRatings={driverRatings}
                        appRatings={appRatings}
                    />

                    <div className="space-y-4">
                        {/* Product Reviews */}
                        {productReviews.map((review: any, index: number) => (
                            <ProductReviewCard key={`product-${review.id}`} review={review} index={index} />
                        ))}

                        {/* Driver Ratings */}
                        {driverRatings.map((rating: any, index: number) => (
                            <DriverRatingCard key={`driver-${rating.id}`} rating={rating} index={index + productReviews.length} />
                        ))}

                        {/* App Ratings */}
                        {appRatings.map((rating: any, index: number) => (
                            <AppRatingCard key={`app-${rating.id}`} rating={rating} index={index + productReviews.length + driverRatings.length} />
                        ))}

                        {/* Empty state if no ratings */}
                        {productReviews.length === 0 && driverRatings.length === 0 && appRatings.length === 0 && (
                            <EmptyState type="products" />
                        )}
                    </div>
                </TabsContent>

                {/* Product Ratings Tab */}
                <TabsContent value="products" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">تقييمات المنتجات ({productReviews.length})</h2>
                        <Button onClick={() => handleAddRating('product')} className="btn-add">
                            <Plus className="w-4 h-4 mr-2" />
                            قيم منتج
                        </Button>
                    </div>



                    <div className="space-y-4">
                        {productReviews.length === 0 ? (
                            <EmptyState type="products" />
                        ) : (
                            productReviews.map((review: any, index: number) => (
                                <ProductReviewCard key={review.id} review={review} index={index} />
                            ))
                        )}
                    </div>
                </TabsContent>

                {/* Driver Ratings Tab */}
                <TabsContent value="drivers" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">تقييمات السائقين ({driverRatings.length})</h2>
                        <Button onClick={() => handleAddRating('driver')} className="btn-add">
                            <Plus className="w-4 h-4 mr-2" />
                            قيم سائق
                        </Button>
                    </div>



                    <div className="space-y-4">
                        {driverRatings.length === 0 ? (
                            <EmptyState type="drivers" />
                        ) : (
                            driverRatings.map((rating: any, index: number) => (
                                <DriverRatingCard key={rating.id} rating={rating} index={index} />
                            ))
                        )}
                    </div>
                </TabsContent>

                {/* App Ratings Tab */}
                <TabsContent value="app" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">تقييمات المتجر ({appRatings.length})</h2>
                        <Button onClick={() => handleAddRating('app')} className="btn-add">
                            <Plus className="w-4 h-4 mr-2" />
                            قيم المتجر
                        </Button>
                    </div>



                    <div className="space-y-4">
                        {appRatings.length === 0 ? (
                            <EmptyState type="app" />
                        ) : (
                            appRatings.map((rating: any, index: number) => (
                                <AppRatingCard key={rating.id} rating={rating} index={index} />
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Rating Dialogs */}
            <ProductRatingDialog
                isOpen={productDialogOpen}
                onClose={() => setProductDialogOpen(false)}
            />
            <DriverRatingDialog
                isOpen={driverDialogOpen}
                onClose={() => setDriverDialogOpen(false)}
            />
            <AppRatingDialog
                isOpen={appDialogOpen}
                onClose={() => setAppDialogOpen(false)}
            />
        </div>
    );
} 