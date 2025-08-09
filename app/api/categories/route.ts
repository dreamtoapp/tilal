import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeProducts = searchParams.get('includeProducts') === 'true';


    const categories = await db.category.findMany({
      where: {},
      include: {
        ...(includeProducts && {
          categoryAssignments: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  images: true,
                },
              },
            },
            take: 10,
          },
        }),
        _count: {
          select: {
            productAssignments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 