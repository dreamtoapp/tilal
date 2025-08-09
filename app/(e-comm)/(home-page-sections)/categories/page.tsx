import { Metadata } from 'next';
import Image from 'next/image';
import Link from '@/components/link';


import { getCategories } from '../../homepage/actions/getCategories';

export const metadata: Metadata = {
    title: 'جميع الفئات | متجر الأزياء',
    description: 'تصفح جميع فئات المنتجات في متجرنا'
};

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="container mx-auto py-12">
            <div className="mb-12 text-center">
                <h1 className="mb-3 text-3xl font-bold md:text-4xl lg:text-5xl">
                    تصفح حسب الفئة
                </h1>
                <p className="mx-auto max-w-2xl text-muted-foreground">
                    اكتشف مجموعتنا المتنوعة من المنتجات عالية الجودة مصنفة حسب الفئات لتجربة تسوق سهلة وممتعة
                </p>
            </div>

            {/* Categories section with featured category */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
                {categories.length > 0 && (
                    <Link
                        href={`/categories/${categories[0].slug}`}
                        className="group relative col-span-1 h-80 overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg sm:col-span-2 lg:col-span-8 lg:h-[500px]"
                    >
                        {/* Featured category background */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 flex items-center justify-center w-full">

                            {categories[0].imageUrl ? (
                                <div className="relative h-[400px] w-[400px]">
                                    <Image
                                        src={categories[0].imageUrl}
                                        alt={categories[0].name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
                                        priority
                                    />
                                </div>
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/80" />
                            )}
                        </div>

                        {/* Featured content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <span className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium uppercase">
                                فئة مميزة
                            </span>
                            <h2 className="mb-2 text-3xl font-bold">{categories[0].name}</h2>
                            {categories[0].description && (
                                <p className="mb-4 line-clamp-2 max-w-xl text-white/80">
                                    {categories[0].description}
                                </p>
                            )}
                            <div className="flex items-center">
                                <span className="mr-2 text-sm">{categories[0].productCount} منتج</span>
                                <span className="flex items-center font-medium">
                                    تصفح الآن
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-1 transition-transform duration-300 group-hover:translate-x-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Normal category grid - shows other categories */}
                <div className="col-span-1 grid grid-cols-1 gap-6 sm:col-span-2 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-2">
                    {categories.slice(1, 5).map((category: any) => (
                        <Link
                            href={`/categories/${category.slug}`}
                            key={category.id}
                            className="group flex aspect-square flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md"
                        >
                            <div className="relative w-full h-full overflow-hidden">
                                {category.imageUrl ? (
                                    <Image
                                        src={category.imageUrl}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105 p-2"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 25vw, 16vw"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
                                )}

                                {/* Category product count badge */}
                                <div className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                                    {category.productCount} منتج
                                </div>
                            </div>

                            <div className="bg-card p-3">
                                <h3 className="font-bold">{category.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Rest of the categories */}
            {categories.length > 5 && (
                <>
                    <h2 className="mb-6 mt-12 text-2xl font-bold">فئات إضافية</h2>
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {categories.slice(5).map((category: any) => (
                            <Link
                                href={`/categories/${category.slug}`}
                                key={category.id}
                                className="group flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md"
                            >
                                <div className="relative aspect-square overflow-hidden">
                                    {category.imageUrl ? (
                                        <Image
                                            src={category.imageUrl}
                                            alt={category.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
                                    )}
                                </div>

                                <div className="bg-card p-3">
                                    <h3 className="font-medium">{category.name}</h3>
                                    <span className="mt-1 text-xs text-muted-foreground">
                                        {category.productCount} منتج
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
} 