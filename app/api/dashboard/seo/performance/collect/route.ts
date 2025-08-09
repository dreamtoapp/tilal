import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { url, metrics, timestamp } = body;

    // Validate required fields
    if (!url || !metrics) {
      return NextResponse.json(
        { error: 'Missing required fields: url, metrics' },
        { status: 400 }
      );
    }

    // Here you would typically save the performance data to your database
    // For now, we'll just log it and return success
    console.log('SEO Performance Data Collected:', {
      url,
      metrics,
      timestamp: timestamp || new Date().toISOString(),
      userId: session.user.id,
    });

    // You can extend this to save to database:
    // await db.seoPerformance.create({
    //   data: {
    //     url,
    //     metrics: JSON.stringify(metrics),
    //     timestamp: timestamp || new Date(),
    //     userId: session.user.id,
    //   },
    // });

    return NextResponse.json({
      success: true,
      message: 'Performance data collected successfully',
    });
  } catch (error) {
    console.error('Error collecting SEO performance data:', error);
    return NextResponse.json(
      { error: 'Failed to collect performance data' },
      { status: 500 }
    );
  }
}
