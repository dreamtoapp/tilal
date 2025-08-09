import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/lib/prisma';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Policy ID is required' }, { status: 400 });
    }

    // Update the policy to published
    const policy = await db.term.update({
      where: { id },
      data: {
        isPublished: true,
        metadata: {
          publishedBy: session.user.id,
          publishedAt: new Date().toISOString()
        }
      }
    });

    // Revalidate the privacy-policy cache tag
    revalidateTag('privacy-policy');

    return NextResponse.json({
      id: policy.id,
      title: policy.title,
      content: policy.content,
      isActive: policy.isActive,
      isPublished: policy.isPublished,
      version: policy.version
    });
  } catch (error) {
    console.error('Error publishing privacy policy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 