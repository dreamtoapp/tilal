import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const accessToken = process.env.WHATSAPP_PERMANENT_TOKEN;
    const businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
    const apiVersion = process.env.WHATSAPP_API_VERSION || 'v23.0';

    if (!accessToken || !businessAccountId) {
      return NextResponse.json({
        success: false,
        message: 'Missing environment variables'
      }, { status: 400 });
    }

    const endpoint = `https://graph.facebook.com/${apiVersion}/${businessAccountId}/message_templates?fields=name,components,language,status`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: data
      });
    } else {
      return NextResponse.json({
        success: false,
        error: data.error?.message || 'Failed to fetch templates',
        details: data
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Get template details error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 