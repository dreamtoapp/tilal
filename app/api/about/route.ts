import { NextResponse } from 'next/server';
import { getAboutPageContent } from '@/app/(e-comm)/(adminPage)/about/actions/getAboutPageContent';
import { updateAboutPageContent } from '@/app/dashboard/management/about/actions/updateAboutPageContent';

export async function GET() {
  try {
    const data = await getAboutPageContent();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await updateAboutPageContent(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
} 