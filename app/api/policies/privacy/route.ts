import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/lib/prisma';
import { cacheData } from '@/lib/cache';

const getCachedPrivacyPolicy = cacheData(
  async () => {
    const policy = await db.term.findFirst({
      where: {
        type: 'PRIVACY_POLICY',
        isActive: true
      },
      orderBy: {
        version: 'desc'
      }
    });
    return policy;
  },
  ['privacy-policy'],
  { revalidate: 3600 }
);

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const policy = await getCachedPrivacyPolicy();

    if (!policy) {
      return NextResponse.json({
        title: 'سياسة الخصوصية',
        content: '',
        isActive: true,
        isPublished: false,
        version: 1
      });
    }

    return NextResponse.json({
      id: policy.id,
      title: policy.title,
      content: policy.content,
      isActive: policy.isActive,
      isPublished: policy.isPublished,
      version: policy.version
    });
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, isActive, isPublished } = body;

    // Find existing policy
    const existingPolicy = await db.term.findFirst({
      where: {
        type: 'PRIVACY_POLICY'
      },
      orderBy: {
        version: 'desc'
      }
    });

    const newVersion = existingPolicy ? existingPolicy.version + 1 : 1;

    // Create new policy
    const policy = await db.term.create({
      data: {
        title,
        content,
        type: 'PRIVACY_POLICY',
        version: newVersion,
        isActive,
        isPublished,
        metadata: {
          createdBy: session.user.id,
          createdAt: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      id: policy.id,
      title: policy.title,
      content: policy.content,
      isActive: policy.isActive,
      isPublished: policy.isPublished,
      version: policy.version
    });
  } catch (error) {
    console.error('Error saving privacy policy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 