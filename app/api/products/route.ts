import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');

    // Build query conditions
    const where: any = {
      published: true, // Use published field instead of status
    };

    if (featured === 'true') {
      // For featured products, we can use tags array to check for 'featured' tag
      where.tags = {
        has: 'featured'
      };
    }

    // Pagination
    const pageNumber = page ? parseInt(page) : 1;
    const limitNumber = limit ? parseInt(limit) : 10;
    const skip = (pageNumber - 1) * limitNumber;

    const [products, totalCount] = await Promise.all([
      db.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          compareAtPrice: true,
          imageUrl: true,
          rating: true,
          reviewCount: true,
          previewCount: true,
          outOfStock: true,
          details: true,
          categoryAssignments: {
            select: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limitNumber,
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: totalCount,
        pages: Math.ceil(totalCount / limitNumber),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 