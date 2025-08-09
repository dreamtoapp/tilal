'use server';

import db from '@/lib/prisma';


export async function getCategoryPageData(slug: string, page = 1, pageSize = 10) {
  const decodedSlug = decodeURIComponent(slug);
  try {
    // Fetch all categories (simple fields only)
    const allCategories = await db.category.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        imageUrl: true,
        productAssignments: true,
      },
    });

    // Add productCount to each category
    const categoriesWithCount = allCategories.map(category => ({
      ...category,
      productCount: category.productAssignments.length,
    }));

    // Fetch category by slug
    const category = await db.category.findUnique({
      where: { slug: decodedSlug },
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        imageUrl: true,
      },
    });
    if (!category) {
      return { success: false, error: 'Category not found.' };
    }

    // Fetch products for the category using the proper relationship
    const skip = (page - 1) * pageSize;
    const [products, totalProducts] = await db.$transaction([
      db.product.findMany({
        where: {
          categoryAssignments: {
            some: {
              categoryId: category.id,
            },
          },
          published: true,
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      db.product.count({
        where: {
          categoryAssignments: {
            some: {
              categoryId: category.id,
            },
          },
          published: true,
        },
      }),
    ]);


    console.log('products', products);
    console.log('products', products.length);
    console.log('--------------------------------');
    console.log('totalProducts', totalProducts);
    console.log('categoriesWithCount', categoriesWithCount);
    console.log('category', category);
    console.log('page', page);
    console.log('pageSize', pageSize);

    return {
      success: true,
      category,
      products,
      totalPages: Math.ceil(totalProducts / pageSize),
      currentPage: page,
      totalProducts,
      allCategories: categoriesWithCount,
    };
  } catch (error) {
    return { success: false, error: 'Failed to fetch category page data.' };
  }
} 