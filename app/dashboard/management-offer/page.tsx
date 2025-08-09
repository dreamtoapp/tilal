import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Plus, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import Link from '@/components/link';
import { buttonVariants } from '@/components/ui/button';
import { getOffers } from './actions/get-offers';
import OfferCard from './components/OfferCard';

export default async function ManagementOfferPage() {
    const offers = await getOffers();
    const activeOffers = offers.filter(offer => offer.isActive);
    const inactiveOffers = offers.filter(offer => !offer.isActive);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Enhanced Header */}
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-sm p-4 shadow-lg md:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-feature-commerce/10 rounded-lg">
                                    <Package className="h-6 w-6 text-feature-commerce icon-enhanced" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-feature-commerce">
                                        إدارة المجموعات المميزة
                                    </h1>
                                    <p className="text-sm text-muted-foreground">إدارة وتنظيم مجموعات المنتجات المميزة</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="default" className="bg-feature-commerce text-white shadow-md border-feature-commerce">
                                    <Eye className="h-3 w-3 mr-1" />
                                    {activeOffers.length} نشط
                                </Badge>
                                {inactiveOffers.length > 0 && (
                                    <Badge variant="secondary" className="bg-muted/80 text-muted-foreground border-muted-foreground/30">
                                        <ToggleLeft className="h-3 w-3 mr-1" />
                                        {inactiveOffers.length} غير نشط
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Add New Offer Button */}
                    <Link
                        href="/dashboard/management-offer/new"
                        className={buttonVariants({
                            variant: "default",
                            className: "btn-add flex items-center gap-2 px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                        })}
                    >
                        <Plus className="h-5 w-5" />
                        إضافة مجموعة جديدة
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 space-y-8 p-4 md:p-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="shadow-xl border-l-4 border-l-feature-commerce card-hover-effect card-border-glow bg-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <Eye className="h-4 w-4 text-feature-commerce icon-enhanced" />
                                المجموعات النشطة
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-feature-commerce">{activeOffers.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">مجموعة مرئية للعملاء</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-xl border-l-4 border-l-feature-analytics card-hover-effect card-border-glow bg-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <ToggleLeft className="h-4 w-4 text-feature-analytics icon-enhanced" />
                                المجموعات غير النشطة
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-feature-analytics">{inactiveOffers.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">مجموعة مخفية مؤقتاً</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-xl border-l-4 border-l-feature-products card-hover-effect card-border-glow bg-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <Package className="h-4 w-4 text-feature-products icon-enhanced" />
                                إجمالي المنتجات
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-feature-products">
                                {offers.reduce((total, offer) => total + (offer._count?.productAssignments || 0), 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">منتج في جميع المجموعات</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Active Offers Section */}
                {activeOffers.length > 0 && (
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border">
                            <div className="p-2 bg-feature-commerce/20 rounded-lg">
                                <ToggleRight className="h-5 w-5 text-feature-commerce icon-enhanced" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-feature-commerce">المجموعات النشطة</h2>
                                <p className="text-sm text-muted-foreground">المجموعات المرئية للعملاء حالياً</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {activeOffers.map((offer) => (
                                <OfferCard key={offer.id} offer={offer} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Inactive Offers Section */}
                {inactiveOffers.length > 0 && (
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border">
                            <div className="p-2 bg-muted/30 rounded-lg">
                                <ToggleLeft className="h-5 w-5 text-muted-foreground icon-enhanced" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">المجموعات غير النشطة</h2>
                                <p className="text-sm text-muted-foreground">المجموعات المخفية مؤقتاً</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {inactiveOffers.map((offer) => (
                                <OfferCard key={offer.id} offer={offer} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Empty State */}
                {offers.length === 0 && (
                    <Card className="shadow-xl border-l-4 border-l-feature-commerce card-hover-effect bg-card">
                        <CardContent className="text-center py-16">
                            <div className="p-6 bg-feature-commerce/10 rounded-full w-fit mx-auto mb-6">
                                <Package className="h-16 w-16 text-feature-commerce icon-enhanced" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-feature-commerce">لا توجد مجموعات مضافة بعد</h3>
                            <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                                ابدأ بإنشاء مجموعة منتجات مميزة لعرضها في الموقع وجذب انتباه العملاء
                            </p>
                            <Link
                                href="/dashboard/management-offer/new"
                                className={buttonVariants({
                                    variant: "default",
                                    className: "btn-add px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                })}
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                إضافة مجموعة جديدة
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
} 