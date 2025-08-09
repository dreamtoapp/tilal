import Image from 'next/image';
import Link from '@/components/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Icon } from '@/components/icons/Icon';
import { getCategories } from '../../actions/getCategories';

export default async function CategoryList() {
    const categories = await getCategories();

    return (
        <section className="mx-auto w-full bg-transparent shadow-sm" aria-label="Product categories">
            <header className="flex items-center justify-between pb-1">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-foreground">تسوق حسب الفئة</h2>
                        <Badge variant="outline">
                            {categories.length}
                        </Badge>
                    </div>
                    <p className="hidden md:block text-sm text-muted-foreground">استكشف مجموعتنا المتنوعة من المنتجات حسب الفئة</p>
                </div>
                {categories.length > 0 && (
                    <Link href="/categories" className="flex items-center text-sm font-medium text-primary hover:underline">
                        عرض الكل
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                            <path d="M19 12H5"></path>
                            <path d="m12 19-7-7 7-7"></path>
                        </svg>
                    </Link>
                )}
            </header>
            <Card>
                <CardContent className="px-4 py-2">
                    {categories.length > 0 ? (
                        <ScrollArea className="w-full py-1">
                            <nav aria-label="قائمة الفئات">
                                <ul className="flex gap-5 pb-1">
                                    {categories.map((category, idx) => (
                                        <li key={category.id} className="min-w-[9rem] md:min-w-[18rem] border border-border/50  px-2 rounded-xl">
                                            <Link href={`/categories/${category.slug}`} className="group cursor-pointer overflow-visible rounded-xl flex flex-col items-center">
                                                {/* Card Header (Product Name) */}
                                                <div className="flex flex-col items-center gap-1 px-1 w-full pt-2">
                                                    <h3 className="text-sm md:text-xl font-semibold text-muted-foreground truncate  w-full">{category.name}</h3>
                                                </div>
                                                {/* Card Image */}
                                                <div className="relative h-32 w-40 md:h-44 md:w-72 overflow-hidden rounded-xl shadow-md transition-all duration-300 bg-gray-900/80 flex items-center justify-center">
                                                    {category.imageUrl ? (
                                                        <Image
                                                            src={category.imageUrl}
                                                            alt={category.name}
                                                            fill
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                            className="object-contain p-2"
                                                            priority={idx < 8}
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
                                                    )}
                                                </div>
                                                {/* Card Footer (Badge + Arrow Link) */}
                                                <div className="w-full flex justify-between items-center px-2 pb-2 mt-2">
                                                    <Badge variant="outline" className="text-muted-foreground text-xs px-2 py-1 font-normal flex items-center gap-1 border border-secondary">
                                                        {category.productCount > 0 ? (
                                                            <>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M16 10V6a4 4 0 0 0-8 0v4" /></svg>
                                                                {category.productCount}
                                                            </>
                                                        ) : 'قريبا'}
                                                    </Badge>
                                                    <Badge variant="outline" className="inline-flex items-center text-muted-foreground  justify-center rounded-full p-1 hover:bg-primary/10 transition">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                                                            <path d="M5 12h14"></path>
                                                            <path d="m12 5 7 7-7 7"></path>
                                                        </svg>
                                                    </Badge>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                            <ScrollBar orientation="horizontal" className="h-2 [&>div]:bg-primary/30" />
                        </ScrollArea>
                    ) : (
                        /* Clean Empty State */
                        <div className="py-12 px-6 text-center">
                            <div className="mx-auto w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                                <Icon name="Tags" className="w-12 h-12 text-primary/60" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-3">
                                لا توجد فئات متاحة حالياً
                            </h3>
                            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                                نحن نعمل على إضافة فئات المنتجات المتنوعة. ستعود قريباً مع تشكيلة واسعة من المنتجات المميزة.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
} 